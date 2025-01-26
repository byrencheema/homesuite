import { useState } from "react";
import { SwipeableHomes } from "@/components/SwipeableHomes";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const Browse = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([10]); // Default 10 mile radius
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (location.trim()) {
      setIsSearching(true);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Dream Home</h1>
        
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter location (e.g., San Francisco, CA)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Search radius: {radius[0]} miles
            </label>
            <Slider
              value={radius}
              onValueChange={setRadius}
              min={1}
              max={50}
              step={1}
            />
          </div>
        </div>

        <SwipeableHomes 
          searchLocation={isSearching ? location : null}
          searchRadius={radius[0]}
        />
      </div>
    </main>
  );
};

export default Browse;