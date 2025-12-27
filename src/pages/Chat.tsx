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
            <div className="w-full h-full flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
                {!currentConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8 animate-fade-in">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 animate-pulse"></div>
                            <div className="relative rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-8 shadow-2xl">
                                <span className="text-7xl animate-bounce">👋</span>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-lg">
                            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Chào mừng đến với AKE Chat
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                Trợ lý AI y khoa thông minh. Bắt đầu bằng cách tạo một cuộc trò chuyện mới để khám phá Knowledge Graph.
                            </p>
                        </div>
                        <Button
                            onClick={createNewConversation}
                            size="lg"
                            className="rounded-full px-10 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                        >
                            <span className="mr-2">+</span>
                            Tạo cuộc trò chuyện mới
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <ChatContainer />
                        <ChatInput onSend={sendMessage} disabled={isLoading} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
