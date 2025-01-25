import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { HomeCard } from "@/components/HomeCard";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { MatchPopup } from "@/components/MatchPopup";

export function SwipeableHomes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

      // First, check if a like already exists
      const { data: existingLike } = await supabase
        .from("home_likes")
        .select("*")
        .eq("home_id", homeId)
        .eq("user_id", session.user.id)
        .single();

      if (existingLike) {
        // If it exists, update it
        const { error } = await supabase
          .from("home_likes")
          .update({ liked })
          .eq("home_id", homeId)
          .eq("user_id", session.user.id);

        if (error) throw error;
      } else {
        // If it doesn't exist, insert it
        const { error } = await supabase
          .from("home_likes")
          .insert({
            home_id: homeId,
            user_id: session.user.id,
            liked,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["homes"] });
      if (variables.liked) {
        setShowMatch(true);
      }
      setIsAnimating(true);
      setSwipeDirection(variables.liked ? "right" : "left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 300);
      toast.success("Preference saved! Keep swiping to find your perfect home.");
    },
    onError: (error) => {
      console.error("Error liking home:", error);
      if (error instanceof Error && error.message.includes("logged in")) {
        toast.error("Please log in to save your preferences");
        navigate("/auth");
      } else {
        toast.error("Failed to save your preference");
      }
    },
  });

  const currentHome = homes[currentIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-lg text-gray-500">Loading homes...</div>
      </div>
    );
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
      <div className="mb-6 relative">
        <div
          className={`transition-transform duration-300 ${
            isAnimating
              ? swipeDirection === "left"
                ? "-translate-x-full rotate-[-20deg]"
                : "translate-x-full rotate-[20deg]"
              : ""
          }`}
        >
          <HomeCard home={currentHome} />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleLike({ homeId: currentHome.id, liked: false })}
          className="w-24 h-16"
        >
          <ThumbsDown className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          onClick={() => handleLike({ homeId: currentHome.id, liked: true })}
          className="w-24 h-16 bg-primary hover:bg-primary-hover"
        >
          <ThumbsUp className="w-6 h-6" />
        </Button>
      </div>
      <MatchPopup
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        homeTitle={currentHome.title}
      />
    </div>
  );
}