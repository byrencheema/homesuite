import { SwipeableHomes } from "@/components/SwipeableHomes";
import { Navbar } from "@/components/Navbar";

const Browse = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Dream Home</h1>
        <SwipeableHomes />
      </div>
    </main>
  );
};

export default Browse;