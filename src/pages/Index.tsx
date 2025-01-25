import { SwipeableHomes } from "@/components/SwipeableHomes";

const Index = () => {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Dream Home</h1>
        <SwipeableHomes />
      </div>
    </main>
  );
};

export default Index;