import { useState } from "react";
import { SwipeableHomes } from "@/components/SwipeableHomes";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, MapPin } from "lucide-react";
import { RadiusMap } from "@/components/RadiusMap";
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
  const [radius, setRadius] = useState([25]); // Default 25 mile radius
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const handleSearch = async () => {
    if (location.trim()) {
      try {
        // Geocode the location using Mapbox
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location
          )}.json?access_token=pk.eyJ1IjoiYnNjaGVlbWEiLCJhIjoiY202ZHI3eWltMHo4bTJscHl3dWg5bm84MyJ9.9uHYl6mn0fgAFrAx-vetAg`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates([lng, lat]);
          setIsSearching(true);
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }
  };

  // Define radius steps
  const radiusSteps = [5, 25, 100, 500];

  // Find nearest step for slider
  const getNearestStep = (value: number) => {
    return radiusSteps.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
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
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="px-4">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                  <SheetDescription>
                    Adjust the search radius to find homes in your preferred area.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-6">
                    {/* Map with radius visualization */}
                    <RadiusMap 
                      center={coordinates}
                      radiusMiles={radius[0]}
                    />
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium">
                        Search radius: {radius[0]} miles
                      </label>
                      <Slider
                        value={radius}
                        onValueChange={(newValue) => {
                          const nearestStep = getNearestStep(newValue[0]);
                          setRadius([nearestStep]);
                        }}
                        min={5}
                        max={500}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {radiusSteps.map((step) => (
                          <span key={step}>{step}mi</span>
                        ))}
                      </div>
                    </div>
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
        </div>
      </div>
    </main>
  );
};

export default Browse;