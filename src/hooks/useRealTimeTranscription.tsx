
import { useCallback, useRef } from "react";

/**
 * Hook for managing real-time transcription during interview
 */
export const useRealTimeTranscription = (
  addToTranscript: (speaker: string, text: string) => void,
  processWithOpenAI: (text: string, currentQuestion: string) => Promise<void>,
  currentQuestion: string
) => {
  // Track the accumulated transcript text
  const accumulatedText = useRef<string>("");
  
  // Debounce timer to avoid processing too frequently
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Callback function for handling real-time transcriptions 
   * @param text The transcribed text from OpenAI API
   */
  const handleRealTimeTranscription = useCallback((text: string) => {
    if (text.trim()) {
      // Add transcribed text to the transcript UI
      addToTranscript("You (Transcribed)", text);
      
      // Accumulate text for better context
      accumulatedText.current = `${accumulatedText.current} ${text}`.trim();
      
      // Clear previous timer if exists
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new timer to process with delay
      debounceTimerRef.current = setTimeout(() => {
        console.log("Processing accumulated text:", accumulatedText.current);
        processWithOpenAI(accumulatedText.current, currentQuestion);
        
        // Reset accumulated text after processing
        accumulatedText.current = "";
      }, 2000); // 2 seconds delay to collect more speech
    }
  }, [addToTranscript, processWithOpenAI, currentQuestion]);

  return {
    handleRealTimeTranscription
  };
};
