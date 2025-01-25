import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
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
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg rounded-full transition-all duration-300"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};