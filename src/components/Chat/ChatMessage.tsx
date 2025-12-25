import React from 'react';
import type { Message } from '../../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle, Brain, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { user } = useAuth();
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    // Get display name for user
    const displayName = user?.fullname || user?.email || 'User';

    // Get initials for avatar fallback
    const userInitial = displayName.charAt(0).toUpperCase();

    // Biomedical keywords to highlight
    const biomedicalKeywords = [
        'ung thư', 'cancer', 'tim mạch', 'cardiovascular', 'đái tháo đường', 'diabetes',
        'huyết áp', 'hypertension', 'viêm phổi', 'pneumonia', 'covid-19', 'coronavirus',
        'vaccine', 'vắc xin', 'antibiotics', 'kháng sinh', 'insulin', 'insulin',
        'chemotherapy', 'hóa trị', 'radiation', 'xạ trị', 'surgery', 'phẫu thuật',
        'diagnosis', 'chẩn đoán', 'symptoms', 'triệu chứng', 'treatment', 'điều trị',
        'prevention', 'phòng ngừa', 'immune', 'miễn dịch', 'virus', 'vi rút',
        'bacteria', 'vi khuẩn', 'infection', 'nhiễm trùng', 'inflammation', 'viêm',
        'chronic', 'mãn tính', 'acute', 'cấp tính', 'genetic', 'di truyền',
        'mutation', 'đột biến', 'protein', 'protein', 'dna', 'rna', 'gene', 'gen',
        'enzyme', 'enzyme', 'hormone', 'hormone', 'cell', 'tế bào', 'tissue', 'mô',
        'organ', 'cơ quan', 'system', 'hệ thống', 'blood', 'máu', 'heart', 'tim',
        'lung', 'phổi', 'liver', 'gan', 'kidney', 'thận', 'brain', 'não',
        'bone', 'xương', 'muscle', 'cơ', 'skin', 'da', 'nerve', 'thần kinh'
    ];

    // Function to highlight biomedical keywords
    const highlightKeywords = (text: string) => {
        let highlightedText = text;
        biomedicalKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$&</mark>`);
        });
        return highlightedText;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex gap-2 sm:gap-4 mb-4 sm:mb-6 animate-fade-in-up hover-lift ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar - left for bot, right for user */}
            {!isUser && (
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            {/* Message content */}
            <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Sender name */}
                <div className="text-xs text-muted-foreground mb-1 px-1">
                    {isUser ? displayName : 'Medical AI Assistant'}
                </div>

                {/* Message bubble with copy button */}
                <div className="group relative">
                    <div
                        className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${isUser
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {/* Copy button for AI messages */}
                        {!isUser && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {copied ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                    <Copy className="w-3 h-3" />
                                )}
                            </Button>
                        )}
                        <div className={`prose prose-sm dark:prose-invert max-w-none ${isUser ? 'prose-p:text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground' : ''}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => (
                                        <p
                                            className="mb-2 last:mb-0 leading-relaxed break-words"
                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(String(children)) }}
                                        />
                                    ),
                                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                    code: ({ children }) => <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 font-mono text-xs">{children}</code>,
                                    pre: ({ children }) => <pre className="bg-black/10 dark:bg-white/10 rounded p-2 mb-2 overflow-x-auto text-xs">{children}</pre>,
                                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>,
                                }}
                            >
                                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                            </ReactMarkdown>
                        </div>

                        {/* Citations for bot messages */}
                        {!isUser && message.citations && message.citations.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Nguồn tham khảo từ SPOKE Knowledge Graph:</span>
                                </div>
                                <div className="space-y-1">
                                    {message.citations.map((citation, index) => (
                                        <a
                                            key={citation.id}
                                            href={citation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group border border-blue-100 dark:border-blue-800"
                                        >
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 leading-tight break-words">
                                                    {citation.title || 'Nguồn SPOKE'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                                    {citation.url || 'spoke.ucsf.edu'}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>

            {/* User avatar - on the right */}
            {isUser && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    {user?.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {userInitial}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

export default ChatMessage;
