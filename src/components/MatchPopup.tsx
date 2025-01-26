import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, Sparkles } from "lucide-react";

interface MatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  homeTitle: string;
}

export function MatchPopup({ isOpen, onClose, homeTitle }: MatchPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 500); // Reduced to 0.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-primary animate-scale-in" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-center animate-fade-up">
            It&apos;s a Match!
          </h2>
          <p className="text-center text-muted-foreground animate-fade-up">
            You liked {homeTitle}! Start a conversation to learn more.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}