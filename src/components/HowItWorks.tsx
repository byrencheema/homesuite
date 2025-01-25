import { Swipe, Heart, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Swipe,
    title: "Swipe",
    description: "Browse homes effortlessly with our intuitive swipe interface",
  },
  {
    icon: Heart,
    title: "Match",
    description: "Get matched with homes that perfectly fit your criteria",
  },
  {
    icon: MessageSquare,
    title: "Connect",
    description: "Chat directly with property owners or agents",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How HomeSuite Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};