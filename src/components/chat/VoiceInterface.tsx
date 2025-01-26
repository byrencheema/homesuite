import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

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
      // Ensure any existing connection is closed
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
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: isSpeaking ? 1.2 : 1,
          opacity: isSpeaking ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8 overflow-hidden"
      >
        {selectedHome ? (
          <img 
            src={selectedHome.main_image_url} 
            alt="Home"
            className="w-full h-full object-cover"
          />
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
    </div>
  );
};

export default VoiceInterface;