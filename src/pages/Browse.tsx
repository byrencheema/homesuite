import { useState } from "react";
import { SwipeableHomes } from "@/components/SwipeableHomes";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, MapPin, Camera } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Browse = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([10]); // Default 10 mile radius
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (location.trim()) {
      setIsSearching(true);
    }
  };

  const handleGestureControl = () => {
    const webcamButton = document.querySelector('[data-webcam-button]') as HTMLButtonElement | null;
    if (webcamButton) {
      webcamButton.click();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Home</h1>
          <p className="text-muted-foreground">Swipe through homes that match your criteria</p>
        </div>
        
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Enter location (e.g., San Francisco, CA)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="px-4">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                  <SheetDescription>
                    Adjust the search radius to find homes in your preferred area.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Search radius: {radius[0]} miles
                    </label>
                    <Slider
                      value={radius}
                      onValueChange={setRadius}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button onClick={handleSearch} className="bg-primary hover:bg-primary-hover">
              Search
            </Button>
          </div>
        </div>

        <div className="relative">
          <SwipeableHomes 
            searchLocation={isSearching ? location : null}
            searchRadius={radius[0]}
          />
          
          {/* Webcam Control Button */}
          <Button
            variant="secondary"
            className="fixed bottom-8 right-8 shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
            onClick={handleGestureControl}
          >
            <Camera className="h-5 w-5" />
            <span>Gesture Control</span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Browse;