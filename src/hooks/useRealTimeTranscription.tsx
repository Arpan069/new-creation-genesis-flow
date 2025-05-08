
import { useCallback } from "react";

/**
 * Hook for managing real-time transcription during interview
 */
export const useRealTimeTranscription = (
  addToTranscript: (speaker: string, text: string) => void,
  processWithOpenAI: (text: string, currentQuestion: string) => Promise<void>,
  currentQuestion: string
) => {
  /**
   * Callback function for handling real-time transcriptions 
   * @param text The transcribed text from OpenAI API
   */
  const handleRealTimeTranscription = useCallback((text: string) => {
    if (text.trim()) {
      // Add transcribed text to the transcript
      addToTranscript("You (Transcribed)", text);
      
      // Process the transcription with OpenAI to generate a response
      // Add a slight delay to collect more context before processing
      setTimeout(() => {
        processWithOpenAI(text, currentQuestion);
      }, 500);
    }
  }, [addToTranscript, processWithOpenAI, currentQuestion]);

  return {
    handleRealTimeTranscription
  };
};
