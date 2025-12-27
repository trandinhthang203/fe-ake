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
  SidebarInset,
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
    <div className="flex h-screen w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center px-4 py-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <AKEIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-lg font-bold ml-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AKE Chat</h1>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <SidebarGroup className="mb-4">
            <SidebarGroupContent>
              <div className="space-y-3">
                <NewChatButton onClick={createNewConversation} />
                <SearchChat onSearch={setSearchQuery} />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mb-4">
            <SidebarGroupContent>
              <div className="mb-3">
                <div className="flex items-center text-sm font-medium text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  History
                </div>
              </div>
              <ChatList
                conversations={filteredConversations}
                currentConversationId={currentConversation?.id || null}
                onSelectConversation={setCurrentConversation}
              />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <Brain className="h-4 w-4" />
                    <span>AI Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
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

      <SidebarInset>
        <SidebarTrigger className="absolute top-4 left-4 z-10 md:hidden" />
        {children}
      </SidebarInset>
    </div>
  );
};

export default MainLayout;
