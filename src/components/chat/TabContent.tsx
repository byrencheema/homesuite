import { Home } from "@/types/home";
import { Message } from "@/types/message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContainer } from "@/components/chat/ChatContainer";
import VoiceInterface from "@/components/chat/VoiceInterface";
import { useState } from "react";

interface TabContentProps {
  selectedHome: Home;
  messages: Message[];
  isLoadingMessages: boolean;
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isPendingSend: boolean;
}

export const TabContent = ({
  selectedHome,
  messages,
  isLoadingMessages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  isPendingSend,
}: TabContentProps) => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="flex-1 flex flex-col h-full"
    >
      <div className="sticky top-0 z-10 bg-white">
        <ChatHeader home={selectedHome}>
          <TabsList className="ml-4">
            <TabsTrigger 
              value="chat" 
              className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Voice
            </TabsTrigger>
          </TabsList>
        </ChatHeader>
      </div>

      <TabsContent 
        value="chat" 
        className="flex-1 flex flex-col data-[state=inactive]:hidden m-0"
      >
        <ChatContainer
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          isPendingSend={isPendingSend}
        />
      </TabsContent>

      <TabsContent 
        value="voice" 
        className="flex-1 data-[state=inactive]:hidden m-0"
      >
        <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
          <VoiceInterface selectedHome={selectedHome} />
        </div>
      </TabsContent>
    </Tabs>
  );
};