import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedListings } from "@/components/FeaturedListings";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedListings />
    </main>
  );
};

export default Index;