import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedListings } from "@/components/FeaturedListings";

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedListings />
    </div>
  );
}

export default App;