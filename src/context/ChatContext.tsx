import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Conversation, Message } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '../services/chatService';
import { toast } from 'sonner';

interface ChatContextProps {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    waitingForFeedback: boolean;

    // Actions
    setCurrentConversation: (conversationId: string) => void;
    sendMessage: (content: string) => Promise<void>;
    sendFeedback: (feedback: string) => Promise<void>;
    createNewConversation: () => void;
    searchConversations: (query: string) => Conversation[];
    deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used within ChatProvider');
    return ctx;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    // In a real app, conversations would be loaded from backend on mount.
    // For now, we'll keep them in local state or localStorage could be added.
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConv] = useState<Conversation | null>(null);
    const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Logic for feedback flow
    const [waitingForFeedback, setWaitingForFeedback] = useState(false);

    // Computed messages for current conversation
    const messages = currentConversation ? (messagesMap[currentConversation.id] || []) : [];

    // Switch conversation
    const setCurrentConversation = (conversationId: string) => {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            setCurrentConv(conv);
            setWaitingForFeedback(false); // Reset waiting state when switching
        }
    };

    const sendMessage = async (content: string) => {
        if (!content.trim() || !currentConversation) return;

        // Smart redirect: If we are waiting for feedback, this "message" is actually feedback
        if (waitingForFeedback) {
            await sendFeedback(content);
            return;
        }

        setIsLoading(true);

        // 1. Add User Message to UI immediately
        const userMessage: Message = {
            id: uuidv4(),
            conversationId: currentConversation.id,
            role: 'user',
            content: content.trim(),
            timestamp: new Date()
        };

        // Update local state
        setMessagesMap(prev => ({
            ...prev,
            [currentConversation.id]: [...(prev[currentConversation.id] || []), userMessage]
        }));

        try {
            // 2. Call Backend API
            const response = await chatService.sendMessage(
                content.trim(),
                currentConversation.id,
                false // use_cache default
            );

            // 3. Process Bot Response
            const botMessage: Message = {
                id: uuidv4(),
                conversationId: currentConversation.id,
                role: 'bot',
                content: response.answer,
                citations: response.sources && Object.keys(response.sources).length > 0 ? [{
                    id: uuidv4(),
                    title: 'SPOKE Knowledge Graph',
                    url: 'https://spoke.ucsf.edu/', // Placeholder or real link if available
                    snippet: JSON.stringify(response.sources)
                }] : [], // Helper to map 'sources' dict to array if needed, or keep as is
                timestamp: new Date()
            };

            setMessagesMap(prev => ({
                ...prev,
                [currentConversation.id]: [...(prev[currentConversation.id] || []), botMessage]
            }));

            // 4. Handle Feedback Loop
            if (response.needs_feedback) {
                setWaitingForFeedback(true);
                toast.info("Bot cần thêm thông tin từ bạn để trả lời chính xác hơn.");
            } else {
                setWaitingForFeedback(false);
            }

            // 5. Update Conversation Metadata (last message, time)
            setConversations(prev => prev.map(conv =>
                conv.id === currentConversation.id
                    ? {
                        ...conv,
                        lastMessage: botMessage.content.substring(0, 50) + '...',
                        lastMessageTime: botMessage.timestamp,
                        messageCount: (messagesMap[currentConversation.id]?.length || 0) + 2
                    }
                    : conv
            ));

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: uuidv4(),
                conversationId: currentConversation.id,
                role: 'bot',
                content: 'Xin lỗi, đã có lỗi xảy ra khi kết nối với server.',
                timestamp: new Date()
            };
            setMessagesMap(prev => ({
                ...prev,
                [currentConversation.id]: [...(prev[currentConversation.id] || []), errorMessage]
            }));
            toast.error('Không thể kết nối với server');
        } finally {
            setIsLoading(false);
        }
    };

    const sendFeedback = async (feedback: string) => {
        if (!feedback.trim() || !currentConversation) return;

        setIsLoading(true);

        const userMessage: Message = {
            id: uuidv4(),
            conversationId: currentConversation.id,
            role: 'user',
            content: feedback.trim(),
            timestamp: new Date()
        };

        setMessagesMap(prev => ({
            ...prev,
            [currentConversation.id]: [...(prev[currentConversation.id] || []), userMessage]
        }));

        try {
            const response = await chatService.sendFeedback(
                currentConversation.id,
                feedback.trim()
            );

            const botMessage: Message = {
                id: uuidv4(),
                conversationId: currentConversation.id,
                role: 'bot',
                content: response.answer,
                citations: response.sources ? [{
                    id: uuidv4(),
                    title: 'SPOKE Result',
                    url: '#',
                    snippet: JSON.stringify(response.sources)
                }] : [],
                timestamp: new Date()
            };

            setMessagesMap(prev => ({
                ...prev,
                [currentConversation.id]: [...(prev[currentConversation.id] || []), botMessage]
            }));

            // Update feedback state based on new response
            if (response.needs_feedback) {
                setWaitingForFeedback(true);
            } else {
                setWaitingForFeedback(false);
            }

        } catch (error) {
            console.error('Error sending feedback:', error);
            toast.error('Lỗi khi gửi phản hồi');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewConversation = () => {
        const newConv: Conversation = {
            id: uuidv4(), // Client-side ID first, backend will use this or map it
            title: 'Cuộc trò chuyện mới',
            lastMessageTime: new Date(),
            createdAt: new Date(),
            messageCount: 0
        };

        setConversations(prev => [newConv, ...prev]);
        setMessagesMap(prev => ({ ...prev, [newConv.id]: [] }));
        setCurrentConv(newConv);
        setWaitingForFeedback(false);
        console.log("🟦 [FE DEBUG] Generated New Conversation UUID:", newConv.id);
    };

    const searchConversations = (query: string): Conversation[] => {
        if (!query.trim()) return conversations;
        const lowerQuery = query.toLowerCase();
        return conversations.filter(conv =>
            conv.title.toLowerCase().includes(lowerQuery) ||
            conv.lastMessage?.toLowerCase().includes(lowerQuery)
        );
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        setMessagesMap(prev => {
            const newMap = { ...prev };
            delete newMap[id];
            return newMap;
        });
        if (currentConversation?.id === id) {
            setCurrentConv(null);
        }
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            currentConversation,
            messages,
            isLoading,
            waitingForFeedback,
            setCurrentConversation,
            sendMessage,
            sendFeedback,
            createNewConversation,
            searchConversations,
            deleteConversation
        }}>
            {children}
        </ChatContext.Provider>
    );
};
