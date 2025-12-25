import React from 'react';
import type { Message } from '../../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { user } = useAuth();
    const isUser = message.role === 'user';

    // Get display name for user
    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'User';

    // Get initials for avatar fallback
    const userInitial = displayName.charAt(0).toUpperCase();
    const botInitial = 'AI';

    return (
        <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar - left for bot, right for user */}
            {!isUser && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {botInitial}
                    </AvatarFallback>
                </Avatar>
            )}

            {/* Message content */}
            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Sender name */}
                <div className="text-xs text-muted-foreground mb-1 px-1">
                    {isUser ? displayName : 'Medical AI Assistant'}
                </div>

                {/* Message bubble */}
                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                        }`}
                >
                    <div className={`prose prose-sm dark:prose-invert max-w-none ${isUser ? 'prose-p:text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground' : ''}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed break-words">{children}</p>,
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
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {/* Citations for bot messages */}
                    {!isUser && message.citations && message.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs font-medium mb-3 text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Nguồn tham khảo từ SPOKE Knowledge Graph:</span>
                            </div>
                            <div className="grid gap-2">
                                {message.citations.map((citation, index) => (
                                    <a
                                        key={citation.id}
                                        href={citation.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                                    >
                                        <span className="text-xs font-medium text-blue-600 bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-700 group-hover:text-blue-700 leading-tight break-words">
                                                {citation.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                {citation.url}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
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
                    {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={displayName} />
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
