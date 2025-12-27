import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Brain } from 'lucide-react';

interface StreamingMessageProps {
    content: string;
    isTyping?: boolean;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ content, isTyping = false }) => {
    const [displayContent, setDisplayContent] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    // Simulate streaming by progressively revealing text
    useEffect(() => {
        if (!content) {
            setDisplayContent('');
            return;
        }

        let currentIndex = 0;
        const words = content.split(' ');
        let currentText = '';

        const interval = setInterval(() => {
            if (currentIndex < words.length) {
                currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
                setDisplayContent(currentText);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Adjust speed as needed

        return () => clearInterval(interval);
    }, [content]);

    // Blinking cursor effect
    useEffect(() => {
        if (!isTyping) return;

        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, [isTyping]);

    return (
        <div className="flex gap-4 mb-6 justify-start animate-fade-in-up">
            {/* AI Avatar */}
            <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full p-2">
                    <Brain className="w-4 h-4" />
                </AvatarFallback>
            </Avatar>

            {/* Message content */}
            <div className="flex flex-col max-w-[80%] items-start">
                {/* Sender name */}
                <div className="text-xs text-muted-foreground mb-1 px-1">
                    Medical AI Assistant
                </div>

                {/* Streaming message bubble */}
                <div className="group relative">
                    <div className="rounded-2xl px-4 py-3 shadow-sm bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-gray-800">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="mb-2 last:mb-0 leading-relaxed break-words text-sm">
                                {displayContent}
                                {isTyping && showCursor && <span className="inline-block w-1.5 h-5 bg-indigo-500 ml-2 align-bottom animate-pulse"></span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamingMessage;
