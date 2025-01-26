import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "@/types/home";
import { HomeCard } from "@/components/HomeCard";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, Camera, CameraOff } from "lucide-react";
import { MatchPopup } from "@/components/MatchPopup";

interface SwipeableHomesProps {
  searchLocation?: string | null;
  searchRadius?: number;
}

export function SwipeableHomes({ searchLocation, searchRadius = 10 }: SwipeableHomesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [webcamOn, setWebcamOn] = useState(false);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const httpIntervalRef = useRef<number | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current session from Supabase
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Fetch homes from Supabase or use proximity search
  const { data: homes = [], isLoading } = useQuery({
    queryKey: ["homes", searchLocation, searchRadius],
    queryFn: async () => {
      if (searchLocation) {
        // Use proximity search
        const response = await fetch("https://kkgtnejqroqngtwecncs.functions.supabase.co/proximity-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: searchLocation,
            radius: searchRadius,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message || "Failed to search homes");
          return [];
        }

        const { homes } = await response.json();
        return homes;
      } else {
        // Regular fetch all homes
        const { data, error } = await supabase
          .from("homes")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data as Home[];
      }
    },
  });

  // Handle "like" or "dislike"
  const { mutate: handleLike } = useMutation({
    mutationFn: async ({ homeId, liked }: { homeId: string; liked: boolean }) => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to like homes");
      }

      // Check if user already liked/disliked this home
      const { data: existingLike } = await supabase
        .from("home_likes")
        .select("*")
        .eq("home_id", homeId)
        .eq("user_id", session.user.id)
        .single();

      if (existingLike) {
        const { error } = await supabase
          .from("home_likes")
          .update({ liked })
          .eq("home_id", homeId)
          .eq("user_id", session.user.id);
        if (error) throw error;
      } else {
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

      // Show match popup if "liked"
      if (variables.liked) {
        setShowMatch(true);
      }

      // Animate swipe
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

  // Helper function to send frames to server via HTTP
  function sendToServer(imageData: string) {
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: JSON.stringify({ image: imageData }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error sending to server:", err));
  }

  // Toggle webcam on/off
  async function handleWebcamStart() {
    if (!webcamOn) {
      try {
        const videoElement = document.createElement("video");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        videoElement.srcObject = stream;
        await videoElement.play();

        videoStreamRef.current = stream;

        // Prepare a canvas for capturing frames
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        videoElement.addEventListener("loadedmetadata", () => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
        });

        // Send frames via HTTP at ~30ms intervals
        httpIntervalRef.current = window.setInterval(() => {
          context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/jpeg");
          sendToServer(imageData);
        }, 30);

        // Set up WebSocket
        const ws = new WebSocket("ws://localhost:8765");
        websocketRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
        };
        ws.onmessage = (event) => {
          console.log("Message from server:", event.data);

          if (event.data === "Right") {
            handleLike({ homeId: currentHome.id, liked: true });
          } else if (event.data === "Left") {
            handleLike({ homeId: currentHome.id, liked: false });
          }
        };

        setWebcamOn(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setWebcamOn(false);
      }
    } else {
      // Turn webcam off
      if (httpIntervalRef.current) {
        clearInterval(httpIntervalRef.current);
        httpIntervalRef.current = null;
      }
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
      }
      setWebcamOn(false);
    }
  }

  // Grab the home at the current index
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
        <h2 className="text-2xl font-semibold mb-4">No homes found</h2>
        <p className="text-muted-foreground">
          {searchLocation 
            ? `No homes found within ${searchRadius} miles of ${searchLocation}`
            : "Check back later for new listings."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6 relative">
        {/* The front HomeCard (animated on swipe) */}
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

      <div className="flex flex-col items-center gap-4">
        {/* Like / Dislike buttons */}
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

        {/* Enhanced webcam toggle button */}
        <Button
          onClick={handleWebcamStart}
          variant="secondary"
          size="lg"
          className="mt-4 px-6 py-3 transition-all duration-300 hover:shadow-lg flex items-center gap-2 animate-fade-in"
        >
          {webcamOn ? (
            <>
              <CameraOff className="w-5 h-5 text-red-500" />
              <span>Stop Gesture Control</span>
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 text-primary" />
              <span>Enable Gesture Control</span>
            </>
          )}
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
