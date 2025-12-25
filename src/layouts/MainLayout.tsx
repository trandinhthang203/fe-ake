import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '../components/ui/sidebar';
import { ModeToggle } from '../components/ui/mode-toggle';
import AKEIcon from '../components/icons/AKEIcon';
import ChatList from '../components/Sidebar/ChatList';
import NewChatButton from '../components/Sidebar/NewChatButton';
import SearchChat from '../components/Sidebar/SearchChat';
import { Brain, Clock, Sparkles } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { conversations, currentConversation, setCurrentConversation, createNewConversation } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center px-2 py-2">
            <AKEIcon className="mr-2 h-6 w-6" />
            <h1 className="text-lg font-bold">AKE Chat</h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2 py-2">
                <NewChatButton onClick={createNewConversation} />
              </div>
              <div className="px-2 py-2">
                <SearchChat onSearch={setSearchQuery} />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2 py-1">
                <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <Clock className="mr-2 h-4 w-4" />
                  History
                </div>
                <ChatList
                  conversations={filteredConversations}
                  currentConversationId={currentConversation?.id || null}
                  onSelectConversation={setCurrentConversation}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Brain className="h-4 w-4" />
                    <span>AI Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Sparkles className="h-4 w-4" />
                    <span>Features</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-2">
            <ModeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <SidebarTrigger className="absolute top-4 left-4 z-10 md:hidden" />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
