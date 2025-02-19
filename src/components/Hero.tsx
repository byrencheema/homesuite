import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

export const Hero = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04')",
          filter: "brightness(0.7)",
        }}
      />
      <div className="relative z-10 text-center text-white px-4 animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Find Your Perfect Home,
          <br />
          One Swipe at a Time
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          HomeSuite makes house hunting as easy as finding your next date.
          Just swipe, match, and connect!
        </p>
        <div className="space-x-4">
          {session ? (
            <>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/browse")}
              >
                Start Browsing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg rounded-full transition-all duration-300"
                onClick={handleLogout}
              >
                Log Out
                <LogOut className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};