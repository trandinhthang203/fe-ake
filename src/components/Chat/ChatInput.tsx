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
        <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto flex gap-2 items-end">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Đặt câu hỏi về y học..."
                    disabled={disabled}
                    className="min-h-[60px] max-h-[200px] resize-none border-blue-200 focus:border-blue-300 focus:ring-blue-200"
                    rows={2}
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    size="icon"
                    className="h-[60px] w-[60px] rounded-xl flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover-lift"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
            <div id="input-help" className="max-w-4xl mx-auto mt-2 text-xs text-gray-600 text-center">
                Nhấn Enter để gửi, Shift+Enter để xuống dòng
            </div>
        </div>
    );
};

export default ChatInput;
