import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { Navbar } from "@/components/Navbar";
import { HomeCard } from "@/components/HomeCard";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const navigate = useNavigate();

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-center mb-8">Your Matches</h1>
        {isLoading ? (
          <div className="text-center py-12">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No matches yet. Start swiping to find your perfect home!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((home) => (
              <div key={home.id} className="relative animate-fade-up">
                <HomeCard home={home} />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                  onClick={() => navigate(`/chat/${home.id}`)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Matches;