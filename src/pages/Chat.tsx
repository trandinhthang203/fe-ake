import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/Chat/ChatContainer';
import ChatInput from '../components/Chat/ChatInput';

import { Button } from '../components/ui/button';

export default function ChatPage() {
    const { user } = useAuth();
    const { messages, isLoading, sendMessage, currentConversation, conversations, setCurrentConversation, createNewConversation } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    // Auto-select first conversation if none selected
    useEffect(() => {
        if (!currentConversation && conversations.length > 0) {
            setCurrentConversation(conversations[0].id);
        }
    }, [currentConversation, conversations, setCurrentConversation]);

    if (!user) return null;

    return (
        <MainLayout>
            <div className="w-full h-full flex flex-col">
                {!currentConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                        <div className="rounded-full bg-primary/10 p-6">
                            <span className="text-6xl">👋</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Chào mừng đến với AKE Chat</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Trợ lý AI y khoa thông minh. Bắt đầu bằng cách tạo một cuộc trò chuyện mới để khám phá Knowledge Graph.
                            </p>
                        </div>
                        <Button onClick={createNewConversation} size="lg" className="rounded-full px-8">
                            + Tạo cuộc trò chuyện mới
                        </Button>
                    </div>
                ) : (
                    <>
                        <ChatContainer messages={messages} isLoading={isLoading} />
                        <ChatInput onSend={sendMessage} disabled={isLoading} />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
