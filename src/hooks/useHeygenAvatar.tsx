
import { useState, useCallback, useEffect } from "react";
import { heygenService } from "@/services/HeygenService";
import { toast } from "@/hooks/use-toast";

/**
 * Custom hook for managing Heygen AI avatar interactions
 */
export const useHeygenAvatar = () => {
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Check if API key is configured on mount
  useEffect(() => {
    const configured = heygenService.isApiKeyConfigured();
    setIsApiKeyConfigured(configured);
  }, []);
  
  /**
   * Generate and play an AI avatar video for the given text
   */
  const speakWithAvatar = useCallback(async (text: string, options = {}) => {
    if (!text || !heygenService.isApiKeyConfigured()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setIsSpeaking(true);
      
      // Generate video with Heygen API
      const videoUrl = await heygenService.generateVideo(text, options);
      setCurrentVideoUrl(videoUrl);
      
      return videoUrl;
    } catch (error) {
      console.error("Error generating AI avatar video:", error);
      toast({
        title: "Avatar Generation Failed",
        description: "Could not generate AI avatar video. Check your API key.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Handle when avatar video ends
   */
  const handleVideoEnd = useCallback(() => {
    setIsSpeaking(false);
  }, []);
  
  return {
    isApiKeyConfigured,
    isLoading,
    isSpeaking,
    currentVideoUrl,
    speakWithAvatar,
    handleVideoEnd
  };
};
