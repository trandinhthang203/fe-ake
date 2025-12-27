import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, isLoading = false }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter, new line on Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t bg-transparent p-4">
            <div className="max-w-4xl mx-auto flex items-center">
                <div className="flex-1 relative">
                    <div className="flex items-center gap-3 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 shadow-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask follow-up regarding simulation parameters..."
                            disabled={disabled}
                            className="w-full resize-none bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 h-10"
                            rows={1}
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Nhấn Enter để gửi, Shift+Enter để xuống dòng</div>
                </div>

                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    aria-label="Send message"
                    className="ml-3 h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-2xl hover:scale-105 transition-transform disabled:opacity-60"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
