import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { Navbar } from "@/components/Navbar";
import { HomeCard } from "@/components/HomeCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
}

export default function Messages() {
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [messageInput, setMessageInput] = useState("");

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

  // Placeholder for messages - you'll need to implement the actual messages table
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedHome?.id],
    queryFn: async () => {
      return [] as Message[];
    },
    enabled: !!selectedHome,
  });

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedHome) return;
    
    // TODO: Implement message sending functionality
    setMessageInput("");
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-4 h-[calc(100vh-1rem)]">
        <div className="bg-white rounded-lg shadow-sm h-full flex overflow-hidden">
          {/* Matches Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
              {isLoadingMatches ? (
                <div className="p-4 text-center text-gray-500">Loading matches...</div>
              ) : matches.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No matches yet. Start browsing to find your perfect home!
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {matches.map((home) => (
                    <button
                      key={home.id}
                      onClick={() => setSelectedHome(home)}
                      className={`w-full p-2 rounded-lg transition-colors ${
                        selectedHome?.id === home.id
                          ? "bg-primary/10"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={home.main_image_url}
                          alt={home.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-left">
                          <h3 className="font-medium truncate">{home.title}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {home.city}, {home.state}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedHome ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedHome.main_image_url}
                      alt={selectedHome.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="font-semibold">{selectedHome.title}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedHome.city}, {selectedHome.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === session.user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.sender_id === session.user.id
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex space-x-2"
                  >
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
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