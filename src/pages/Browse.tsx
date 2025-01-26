import { useState } from "react";
import { SwipeableHomes } from "@/components/SwipeableHomes";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, MapPin, Loader2 } from "lucide-react";
import { RadiusMap } from "@/components/RadiusMap";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
  const [isLoading, setIsLoading] = useState(false);

  const validateLocation = (input: string): boolean => {
    return input.trim().length >= 3; // Basic validation
  };

  const handleSearch = async () => {
    if (!validateLocation(location)) {
      toast.error("Please enter a valid location (minimum 3 characters)");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Searching for location:', location);
      // Geocode the location using Mapbox
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=pk.eyJ1IjoiYnNjaGVlbWEiLCJhIjoiY202ZHI3eWltMHo4bTJscHl3dWg5bm84MyJ9.9uHYl6mn0fgAFrAx-vetAg`
      );

      if (!response.ok) {
        throw new Error('Failed to geocode location');
      }

      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log('Found coordinates:', { lng, lat });
        setCoordinates([lng, lat]);
        setIsSearching(true);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      toast.error(error instanceof Error ? error.message : "Failed to find location");
      setIsSearching(false);
    } finally {
      setIsLoading(false);
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSearch();
                  }
                }}
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
                        onValueChange={setRadius}
                        min={0}
                        max={500}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0mi</span>
                        <span>100mi</span>
                        <span>250mi</span>
                        <span>500mi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              onClick={handleSearch} 
              className="bg-primary hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        <ErrorBoundary>
          <div className="relative">
            <SwipeableHomes 
              searchLocation={isSearching ? location : null}
              searchRadius={radius[0]}
            />
          </div>
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default Browse;