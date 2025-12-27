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
        <div className="flex-1 flex flex-col overflow-hidden relative md:ml-[var(--sidebar-width)]">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-2 sm:p-4 scroll-smooth"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
            >
                <div className="max-w-4xl mx-auto space-y-4 px-2 sm:px-0">
                    {/* Centered header similar to screenshots */}
                    <div className="w-full py-8 px-4 sm:px-6 text-center border-b border-transparent dark:border-gray-800">
                        <div className="mx-auto max-w-2xl">
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

                    {messages.length === 0 && !isLoading ? (
                        // Modern Empty state with card design
                        <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] text-center px-4">
                            {/* Enhanced Animated Brain Icon */}
                            <div className="relative mb-6 sm:mb-8">
                                <div className="absolute -inset-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 rounded-2xl shadow-2xl">
                                    <Brain className="w-10 h-10 sm:w-14 sm:h-14 text-white animate-bounce" />
                                </div>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Bắt đầu cuộc trò chuyện
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg px-4">
                                        Tôi là AI Agent Y Sinh SPOKE - chuyên gia về y học với kiến thức từ đồ thị tri thức SPOKE.
                                        Hỏi tôi bất kỳ câu hỏi nào về y sinh học, bệnh tật, hoặc nghiên cứu y khoa.
                                    </p>
                                </div>

                                {/* Sample questions in modern cards */}
                                <div className="grid gap-4 max-w-lg w-full mx-auto">
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                            <span className="text-lg">💡</span> Câu hỏi mẫu:
                                        </p>
                                    </div>
                                    {[
                                        "Ung thư vú có những triệu chứng gì?",
                                        "COVID-19 lây truyền như thế nào?",
                                        "Thuốc aspirin dùng để làm gì?"
                                    ].map((question, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gradient-to-r from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group text-left shadow-sm hover:shadow-md"
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Click to ask: ${question}`}
                                        >
                                            <p className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors font-medium">
                                                {question}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    <span>Sẵn sàng trả lời với độ chính xác cao</span>
                                </div>
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
