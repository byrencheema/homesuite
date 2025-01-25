import { MoveRight, Heart, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: MoveRight,
    title: "Swipe Through Homes",
    description: "Browse beautiful homes with our intuitive swipe interface. Like what you see? Swipe right!",
  },
  {
    icon: Heart,
    title: "Get Matched",
    description: "When you match with a home, you'll get instant access to detailed information and virtual tours.",
  },
  {
    icon: MessageSquare,
    title: "Chat & Connect",
    description: "Ask questions about the property through our AI-powered chat system or connect with real estate agents.",
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