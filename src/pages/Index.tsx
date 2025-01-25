import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Router>
        <Navbar />
        <Hero />
      </Router>
    </main>
  );
};

export default Index;