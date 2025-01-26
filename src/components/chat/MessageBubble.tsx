import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex", !message.is_ai ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          !message.is_ai
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}