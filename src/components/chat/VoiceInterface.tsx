import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInterfaceProps {
  selectedHome: {
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    price: number;
    description: string;
    main_image_url: string;
  } | null;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ selectedHome }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
    }
  };

  const startConversation = async () => {
    if (!selectedHome) {
      toast({
        title: "Error",
        description: "Please select a home first",
        variant: "destructive",
      });
      return;
    }

    try {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }

      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Voice interface is ready",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={isConnected ? 'connected' : 'disconnected'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.1, 1] : 1,
              rotate: isSpeaking ? [-1, 1, -1] : 0,
            }}
            transition={{
              duration: 2,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center mb-8 overflow-hidden relative"
          >
            {selectedHome ? (
              <>
                <img 
                  src={selectedHome.main_image_url} 
                  alt="Home"
                  className="w-full h-full object-cover"
                />
                {isSpeaking && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-2 bg-primary/20"
                    animate={{
                      scaleY: [1, 2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </>
            ) : (
              isConnected ? (
                <Mic className={`w-12 h-12 ${isSpeaking ? 'text-primary' : 'text-gray-400'}`} />
              ) : (
                <MicOff className="w-12 h-12 text-gray-400" />
              )
            )}
          </motion.div>

          {!isConnected ? (
            <Button 
              onClick={startConversation}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Start Conversation
            </Button>
          ) : (
            <Button 
              onClick={endConversation}
              variant="secondary"
            >
              End Conversation
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VoiceInterface;