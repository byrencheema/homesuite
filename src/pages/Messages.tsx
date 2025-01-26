import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { Navbar } from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MatchesSidebar } from "@/components/chat/MatchesSidebar";
import { Progress } from "@/components/ui/progress";
import { Message } from "@/types/message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceInterface from "@/components/chat/VoiceInterface";

export default function Messages() {
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: matches = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("home_likes")
        .select(`
          home_id,
          homes (*)
        `)
        .eq("user_id", session.user.id)
        .eq("liked", true);

      if (error) throw error;
      return data.map(match => match.homes) as Home[];
    },
    enabled: !!session?.user?.id,
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", selectedHome?.id],
    queryFn: async () => {
      if (!session?.user?.id || !selectedHome?.id) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("home_id", selectedHome.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!session?.user?.id && !!selectedHome?.id,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.user?.id || !selectedHome?.id) throw new Error("Not authenticated or no home selected");

      // Insert user message
      const { data: userMessage, error: userMessageError } = await supabase
        .from("messages")
        .insert({
          content,
          user_id: session.user.id,
          home_id: selectedHome.id,
          is_ai: false,
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Optimistically update the messages list with user's message
      queryClient.setQueryData(["messages", selectedHome.id], (oldData: Message[] = []) => {
        return [...oldData, userMessage];
      });

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-home', {
        body: { message: content, homeId: selectedHome.id }
      });

      if (response.error) throw response.error;

      // Insert AI response
      const { error: aiMessageError } = await supabase
        .from("messages")
        .insert({
          content: response.data.reply,
          user_id: session.user.id,
          home_id: selectedHome.id,
          is_ai: true,
        });

      if (aiMessageError) throw aiMessageError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedHome?.id] });
      setMessageInput("");
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      // Invalidate to revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["messages", selectedHome?.id] });
    },
  });

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage.mutate(messageInput);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-4 h-[calc(100vh-1rem)]">
        <div className="bg-white rounded-lg shadow-sm h-full flex overflow-hidden">
          <MatchesSidebar
            matches={matches}
            selectedHome={selectedHome}
            onSelectHome={setSelectedHome}
            isLoading={isLoadingMatches}
          />

          <div className="flex-1 flex flex-col">
            {selectedHome ? (
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <ChatHeader home={selectedHome}>
                  <TabsList className="ml-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="voice">Voice</TabsTrigger>
                  </TabsList>
                </ChatHeader>

                <TabsContent value="chat" className="flex-1 flex flex-col">
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
                        {sendMessage.isPending && (
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
                    isLoading={sendMessage.isPending}
                  />
                </TabsContent>

                <TabsContent value="voice" className="flex-1">
                  <VoiceInterface selectedHome={selectedHome} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a home to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}