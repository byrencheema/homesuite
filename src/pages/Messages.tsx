import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MatchesSidebar } from "@/components/chat/MatchesSidebar";
import { TabContent } from "@/components/chat/TabContent";

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
      return data;
    },
    enabled: !!session?.user?.id && !!selectedHome?.id,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.user?.id || !selectedHome?.id) throw new Error("Not authenticated or no home selected");

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

      queryClient.setQueryData(["messages", selectedHome.id], (oldData: any = []) => {
        return [...oldData, userMessage];
      });

      const response = await supabase.functions.invoke('chat-with-home', {
        body: { message: content, homeId: selectedHome.id }
      });

      if (response.error) throw response.error;

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
              <TabContent
                selectedHome={selectedHome}
                messages={messages}
                isLoadingMessages={isLoadingMessages}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
                isPendingSend={sendMessage.isPending}
              />
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