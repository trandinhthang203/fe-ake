import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface NewChatButtonProps {
    onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            variant="default"
        >
            <Plus className="h-4 w-4 mr-2" />
            Cuộc trò chuyện mới
        </Button>
    );
};

export default NewChatButton;
