import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import StreamingMessage from './StreamingMessage';
import { Skeleton } from '../ui/skeleton';
import { Brain, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatContainer: React.FC = () => {
    const { messages, isLoading, isStreaming, streamingContent } = useChat();
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Auto-scroll to bottom when new messages arrive or streaming content changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, isStreaming, streamingContent]);

    // Show/hide scroll to bottom button
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
            }
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Centered header similar to screenshots */}
            <div className="w-full border-b border-transparent dark:border-gray-800">
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-center">
                    <div className="mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center bg-white dark:bg-transparent shadow-sm dark:shadow-none">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                            <span className="text-xl">*</span>
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">Hello, {user?.fullname || 'User'}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">I'm ready to analyze medical data. Ask me about symptoms, protein structures, or drug interactions.</p>
                    <div className="mt-3">
                        <span className="inline-block px-3 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-full">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-2 sm:p-4 scroll-smooth"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
            >
                <div className="max-w-4xl mx-auto space-y-4 px-2 sm:px-0">
                    {messages.length === 0 && !isLoading ? (
                        // Enhanced Empty state
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] sm:min-h-[500px] text-center px-4">
                            {/* Animated Brain Icon */}
                            <div className="relative mb-4 sm:mb-6">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 rounded-full">
                                    <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-bounce" />
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Bắt đầu cuộc trò chuyện
                            </h2>
                            <p className="text-gray-600 mb-6 sm:mb-8 max-w-lg leading-relaxed text-sm sm:text-base px-2">
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
                                        className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors cursor-pointer group text-left"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Click to ask: ${question}`}
                                    >
                                        <p className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">
                                            {question}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-gray-500">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Sẵn sàng trả lời với độ chính xác cao</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}

                            {/* Streaming message */}
                            {isStreaming && (
                                <StreamingMessage content={streamingContent} isTyping={true} />
                            )}

                            {/* Enhanced Loading indicator with typing animation */}
                            {isLoading && !isStreaming && (
                                <div className="flex gap-4 mb-6 animate-fade-in">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                                        <Brain className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col max-w-[80%]">
                                        <div className="text-xs text-muted-foreground mb-1 px-1">
                                            Medical AI Assistant
                                        </div>
                                        <div className="rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">AI đang suy nghĩ...</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 px-1">
                                            {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div id="scroll-anchor" className="h-1" />
                        </>
                    )}
                </div>
            </div>

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                    aria-label="Scroll to bottom"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ChatContainer;
