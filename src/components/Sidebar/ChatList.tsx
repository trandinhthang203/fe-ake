import React from 'react';
import type { Conversation } from '../../types/chat';
import ChatItem from './ChatItem';
import { ScrollArea } from '../ui/scroll-area';

interface ChatListProps {
    conversations: Conversation[];
    currentConversationId: string | null;
    onSelectConversation: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
    conversations,
    currentConversationId,
    onSelectConversation
}) => {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-200/50">
                <p className="text-sm text-muted-foreground font-medium">
                    Chưa có cuộc trò chuyện nào
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Bắt đầu chat mới để tư vấn y học
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-2">
                {conversations.map((conversation) => (
                    <ChatItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={conversation.id === currentConversationId}
                        onClick={() => onSelectConversation(conversation.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatList;
