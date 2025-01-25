import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Home, HomeLike } from "@/types/home";
import { HomeCard } from "@/components/HomeCard";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export function SwipeableHomes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  // Get the current user's session
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: homes = [], isLoading } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Home[];
    },
  });

  const { mutate: handleLike } = useMutation({
    mutationFn: async ({ homeId, liked }: { homeId: string; liked: boolean }) => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to like homes");
      }

      const { error } = await supabase.from("home_likes").insert({
        home_id: homeId,
        user_id: session.user.id,
        liked,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes"] });
      setCurrentIndex((prev) => prev + 1);
      toast.success(
        "Preference saved! Keep swiping to find your perfect home."
      );
    },
    onError: (error) => {
      console.error("Error liking home:", error);
      if (error instanceof Error && error.message.includes("logged in")) {
        toast.error("Please log in to save your preferences");
      } else {
        toast.error("Failed to save your preference");
      }
    },
  });

  const currentHome = homes[currentIndex];

  if (isLoading) {
    return <div>Loading homes...</div>;
  }

  if (!currentHome) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No more homes to show!</h2>
        <p className="text-muted-foreground">Check back later for new listings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <HomeCard home={currentHome} />
      </div>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleLike({ homeId: currentHome.id, liked: false })}
          className="w-24"
        >
          <ThumbsDown className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          onClick={() => handleLike({ homeId: currentHome.id, liked: true })}
          className="w-24"
        >
          <ThumbsUp className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}