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
        <div className="fixed bottom-8 left-4 right-4 z-50 md:left-[calc(var(--sidebar-width)+1rem)] md:right-4">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-white dark:bg-gray-800 rounded-3xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.15),0_6px_24px_rgba(0,0,0,0.1),0_3px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_6px_24px_rgba(0,0,0,0.4),0_3px_12px_rgba(0,0,0,0.3)] focus-within:shadow-[0_12px_48px_rgba(0,0,0,0.15),0_6px_24px_rgba(0,0,0,0.1),0_3px_12px_rgba(0,0,0,0.06)] dark:focus-within:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_6px_24px_rgba(0,0,0,0.4),0_3px_12px_rgba(0,0,0,0.3)] focus-within:scale-[1.02]">
                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Hỏi tôi về y sinh học, bệnh tật, hoặc nghiên cứu y khoa..."
                        disabled={disabled}
                        className="w-full resize-none bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-h-[20px] max-h-32 focus:ring-0 focus:outline-none transition-all duration-200"
                        rows={1}
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    aria-label="Send message"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
