import React, { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';
import { Skeleton } from '../ui/skeleton';

interface ChatContainerProps {
    messages: Message[];
    isLoading?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 scroll-smooth"
            >
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 && !isLoading ? (
                        // Enhanced Empty state
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center px-4">
                            {/* Animated Brain Icon */}
                            <div className="relative mb-6">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full">
                                    <Brain className="w-12 h-12 text-white animate-bounce" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Bắt đầu cuộc trò chuyện
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-lg leading-relaxed">
                                Tôi là AI Agent Y Sinh SPOKE - chuyên gia về y học với kiến thức từ đồ thị tri thức SPOKE.
                                Hỏi tôi bất kỳ câu hỏi nào về y sinh học, bệnh tật, hoặc nghiên cứu y khoa.
                            </p>

                            {/* Sample questions */}
                            <div className="grid gap-3 max-w-md w-full">
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-700 mb-2">📚 Câu hỏi mẫu:</p>
                                </div>
                                {[
                                    "Ung thư vú có những triệu chứng gì?",
                                    "COVID-19 lây truyền như thế nào?",
                                    "Thuốc aspirin dùng để làm gì?"
                                ].map((question, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors cursor-pointer group"
                                    >
                                        <p className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">
                                            {question}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Sẵn sàng trả lời với độ chính xác cao</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs flex-shrink-0">
                                        AI
                                    </div>
                                    <div className="flex flex-col gap-2 max-w-[80%]">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[300px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            )}
                            <div id="scroll-anchor" className="h-1" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
