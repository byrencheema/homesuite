import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      }, 1500); // Increased to 1.5 seconds to ensure message is readable

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Match Confirmation</DialogTitle>
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