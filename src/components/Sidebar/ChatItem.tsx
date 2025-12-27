import React from 'react';
import type { Conversation } from '../../types/chat';
import { MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ conversation, isActive, onClick }) => {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Hôm qua';
        } else if (days < 7) {
            return `${days} ngày trước`;
        } else {
            return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl ring-2 ring-blue-300/50"
                    : "hover:bg-gradient-to-r hover:from-blue-50/80 hover:via-purple-50/60 hover:to-indigo-50/80 border border-gray-200/60 hover:border-blue-300/70 hover:shadow-lg"
            )}
        >
            {/* Active indicator bar */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
            )}

            <div className="flex items-start gap-3">
                <div className="relative">
                    <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 shadow-sm",
                        isActive
                            ? "bg-white/25 text-white shadow-white/20"
                            : "bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 group-hover:from-blue-200 group-hover:to-purple-200 group-hover:shadow-md"
                    )}>
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    {/* Status indicator dot */}
                    <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-all duration-300",
                        isActive ? "bg-green-400 border-white" : "bg-gray-400 border-gray-100"
                    )}></div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={cn(
                            "font-semibold text-sm truncate transition-colors duration-200",
                            isActive ? "text-white" : "text-gray-900 group-hover:text-blue-700"
                        )}>
                            {conversation.title}
                        </h3>
                        <div className={cn(
                            "flex items-center gap-1 text-xs flex-shrink-0 transition-colors duration-200",
                            isActive ? "text-white/90" : "text-muted-foreground group-hover:text-gray-600"
                        )}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(conversation.lastMessageTime)}</span>
                        </div>
                    </div>

                    {conversation.lastMessage && (
                        <p className={cn(
                            "text-xs line-clamp-2 leading-relaxed transition-colors duration-200",
                            isActive ? "text-white/85" : "text-muted-foreground group-hover:text-gray-600"
                        )}>
                            {conversation.lastMessage}
                        </p>
                    )}
                </div>
            </div>

            {/* Hover effect overlay */}
            {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            )}
        </button>
    );
};

export default ChatItem;
