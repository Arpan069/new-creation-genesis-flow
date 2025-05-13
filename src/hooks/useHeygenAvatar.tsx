
import { useState, useCallback, useEffect, useRef } from "react";
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
  const videoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if API key is configured on mount
  useEffect(() => {
    const configured = heygenService.isApiKeyConfigured();
    setIsApiKeyConfigured(configured);
  }, []);
  
  // Clear the video timeout on unmount
  useEffect(() => {
    return () => {
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
      }
    };
  }, []);
  
  /**
   * Generate and play an AI avatar video for the given text
   */
  const speakWithAvatar = useCallback(async (text: string, options = {}) => {
    if (!text || !heygenService.isApiKeyConfigured()) {
      return null;
    }
    
    try {
      setIsLoading(true);
      setIsSpeaking(true);
      
      console.log("Generating Heygen video for text:", text);
      
      // Generate video with Heygen API
      const videoUrl = await heygenService.generateVideo(text, options);
      console.log("Received video URL from Heygen:", videoUrl);
      setCurrentVideoUrl(videoUrl);
      
      // Set a timeout to mark speaking as complete after estimated duration
      // Average speaking rate is about 150 words per minute, or 2.5 words per second
      // Estimate 400ms per word plus 2 seconds buffer
      const wordCount = text.split(/\s+/).length;
      const estimatedDuration = (wordCount * 400) + 2000;
      
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
      }
      
      videoTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
      }, estimatedDuration);
      
      return videoUrl;
    } catch (error) {
      console.error("Error generating AI avatar video:", error);
      toast({
        title: "Avatar Generation Failed",
        description: "Could not generate AI avatar video. Check your API key.",
        variant: "destructive"
      });
      setIsSpeaking(false);
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
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = null;
    }
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
