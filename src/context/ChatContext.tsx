import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Conversation, Message } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '../services/chatService';
import { sessionService } from '../services/sessionService';
import type { SessionResponse, SessionDetailResponse, ConversationResponse } from '../types/api';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface ChatContextProps {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    waitingForFeedback: boolean;

    // Actions
    setCurrentConversation: (conversationId: string) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    sendFeedback: (feedback: string) => Promise<void>;
    createNewConversation: () => Promise<void>;
    searchConversations: (query: string) => Conversation[];
    deleteConversation: (id: string) => Promise<void>;
    loadConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used within ChatProvider');
    return ctx;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConv] = useState<Conversation | null>(null);
    const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [waitingForFeedback, setWaitingForFeedback] = useState(false);

    // Load conversations when user is authenticated
    useEffect(() => {
        if (user && !authLoading) {
            loadConversations();
        } else if (!user && !authLoading) {
            // Clear conversations when user logs out
            setConversations([]);
            setCurrentConv(null);
            setMessagesMap({});
        }
    }, [user, authLoading]);

    // Computed messages for current conversation
    const messages = currentConversation ? (messagesMap[currentConversation.id] || []) : [];

    // Switch conversation
    const setCurrentConversation = async (conversationId: string) => {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            setCurrentConv(conv);
            setWaitingForFeedback(false); // Reset waiting state when switching

            // Load conversation history if not already loaded
            if (!messagesMap[conversationId] || messagesMap[conversationId].length === 0) {
                try {
                    const sessionId = parseInt(conversationId);
                    const sessionDetail = await sessionService.getSessionDetails(sessionId);

                    // Convert backend conversations to frontend messages
                    const messages: Message[] = sessionDetail.conversations.map((conv, index) => ({
                        id: conv.conversation_id,
                        conversationId: conversationId,
                        role: conv.is_user ? 'user' : 'bot',
                        content: conv.content,
                        timestamp: new Date(conv.created_at)
                    }));

                    setMessagesMap(prev => ({
                        ...prev,
                        [conversationId]: messages
                    }));

                    // Update conversation metadata
                    setConversations(prev => prev.map(c =>
                        c.id === conversationId
                            ? {
                                ...c,
                                messageCount: messages.length,
                                lastMessage: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 50) + '...' : undefined,
                                lastMessageTime: messages.length > 0 ? messages[messages.length - 1].timestamp : c.lastMessageTime
                            }
                            : c
                    ));

                } catch (error) {
                    console.error('Error loading conversation history:', error);
                    toast.error('Không thể tải lịch sử trò chuyện');
                }
            }
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
            const sessionId = parseInt(currentConversation.id);
            const response = await chatService.sendMessage(
                content.trim(),
                sessionId,
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
            const sessionId = parseInt(currentConversation.id);
            const response = await chatService.sendFeedback(
                sessionId,
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

    const loadConversations = async () => {
        try {
            const sessions = await sessionService.getAllSessions();
            const convs: Conversation[] = sessions.map(session => ({
                id: session.session_id.toString(),
                title: session.title,
                lastMessageTime: new Date(session.created_at),
                createdAt: new Date(session.created_at),
                messageCount: 0 // Will be updated when loading messages
            }));
            setConversations(convs);
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast.error('Không thể tải danh sách cuộc trò chuyện');
        }
    };

    const createNewConversation = async () => {
        try {
            const newSession = await sessionService.createSession();
            const newConv: Conversation = {
                id: newSession.session_id.toString(),
                title: newSession.title,
                lastMessageTime: new Date(newSession.created_at),
                createdAt: new Date(newSession.created_at),
                messageCount: 0
            };

            setConversations(prev => [newConv, ...prev]);
            setMessagesMap(prev => ({ ...prev, [newConv.id]: [] }));
            setCurrentConv(newConv);
            setWaitingForFeedback(false);
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Không thể tạo cuộc trò chuyện mới');
        }
    };

    const searchConversations = (query: string): Conversation[] => {
        if (!query.trim()) return conversations;
        const lowerQuery = query.toLowerCase();
        return conversations.filter(conv =>
            conv.title.toLowerCase().includes(lowerQuery) ||
            conv.lastMessage?.toLowerCase().includes(lowerQuery)
        );
    };

    const deleteConversation = async (id: string) => {
        try {
            const sessionId = parseInt(id);
            await sessionService.deleteSession(sessionId);
            setConversations(prev => prev.filter(c => c.id !== id));
            setMessagesMap(prev => {
                const newMap = { ...prev };
                delete newMap[id];
                return newMap;
            });
            if (currentConversation?.id === id) {
                setCurrentConv(null);
            }
            toast.success('Đã xóa cuộc trò chuyện');
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Không thể xóa cuộc trò chuyện');
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
            deleteConversation,
            loadConversations
        }}>
            {children}
        </ChatContext.Provider>
    );
};
