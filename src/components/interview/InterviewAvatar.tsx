
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeygenAvatar } from "@/hooks/useHeygenAvatar";
import { Button } from "@/components/ui/button";
import HeygenApiKeySetup from "@/components/interview/HeygenApiKeySetup";
import { Mic, Loader2 } from "lucide-react";

interface InterviewAvatarProps {
  isInterviewStarted: boolean;
  currentQuestion: string;
  isSystemAudioOn: boolean;
}

const InterviewAvatar: React.FC<InterviewAvatarProps> = ({ 
  isInterviewStarted, 
  currentQuestion,
  isSystemAudioOn
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  
  // Use the Heygen avatar hook
  const {
    isApiKeyConfigured,
    isLoading,
    isSpeaking,
    currentVideoUrl,
    speakWithAvatar,
    handleVideoEnd
  } = useHeygenAvatar();
  
  // Effect to show API config if needed
  useEffect(() => {
    if (isApiKeyConfigured === false) {
      setShowApiConfig(true);
    }
  }, [isApiKeyConfigured]);
  
  // Effect to generate video when new question is asked
  useEffect(() => {
    if (currentQuestion && isInterviewStarted && isSystemAudioOn && isApiKeyConfigured) {
      // Generate avatar video for the current question
      speakWithAvatar(currentQuestion);
    }
  }, [currentQuestion, isInterviewStarted, isSystemAudioOn, isApiKeyConfigured, speakWithAvatar]);
  
  // Effect to play video when URL is available
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.src = currentVideoUrl;
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [currentVideoUrl]);
  
  // Handle API key configuration success
  const handleApiKeySuccess = () => {
    setShowApiConfig(false);
    setIsApiKeyConfigured(true);
  };
  
  // If API key needs configuration, show setup screen
  if (showApiConfig) {
    return <HeygenApiKeySetup onSuccess={handleApiKeySuccess} />;
  }
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/60 z-0"></div>
      <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent z-0"></div>
      
      {/* AI avatar container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="rounded-full bg-primary/10 p-1 mb-4">
            <div className={`rounded-full overflow-hidden border-4 ${
              isSpeaking && isSystemAudioOn ? 'border-primary animate-pulse' : 'border-primary/30'
            }`} style={{ width: '250px', height: '250px' }}>
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : currentVideoUrl ? (
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onEnded={handleVideoEnd}
                  playsInline
                  muted={!isSystemAudioOn}
                />
              ) : (
                <img 
                  src="/lovable-uploads/dd63a16d-398e-4187-a982-b19a91446630.png" 
                  alt="AI Interviewer Avatar" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          
          {/* Configure API button */}
          {isApiKeyConfigured === null && (
            <Button 
              size="sm"
              variant="outline"
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs"
              onClick={() => setShowApiConfig(true)}
            >
              Configure Heygen API
            </Button>
          )}
          
          {/* Speaking indicator */}
          <AnimatePresence>
            {isSpeaking && isSystemAudioOn && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Speaking
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* AI name and role */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold">Alex</h2>
          <p className="text-sm text-muted-foreground">AI Interview Assistant</p>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewAvatar;
