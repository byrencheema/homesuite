import { Home } from "@/types/home";
import { Message } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatContainerProps {
  messages: Message[];
  isLoadingMessages: boolean;
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isPendingSend: boolean;
}

export const ChatContainer = ({
  messages,
  isLoadingMessages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  isPendingSend,
}: ChatContainerProps) => {
  return (
    <>
      <ScrollArea className="flex-1 p-4">
        {isLoadingMessages ? (
          <div className="space-y-4">
            <Progress value={33} />
            <Progress value={66} />
            <Progress value={100} />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isPendingSend && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg px-4 py-2 bg-muted">
                  <Progress value={undefined} className="w-12 h-2" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <ChatInput
        value={messageInput}
        onChange={setMessageInput}
        onSubmit={handleSendMessage}
        isLoading={isPendingSend}
      />
    </>
  );
};