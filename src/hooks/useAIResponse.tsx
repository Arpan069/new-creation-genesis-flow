
import { useCallback, useState, useRef } from "react";
import { speakText } from "@/utils/speechUtils";
import { useConversationContext } from "@/hooks/useConversationContext";
import { processAIResponse, shouldAdvanceToNextQuestion } from "@/utils/aiResponseProcessor";
import { toast } from "@/hooks/use-toast";

/**
 * Hook for managing AI responses in the interview
 */
const useAIResponse = (
  isSystemAudioOn: boolean,
  addToTranscript: (speaker: string, text: string) => void,
  advanceToNextQuestion: () => void
) => {
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addToContext, resetContext, getContextString } = useConversationContext();

  /**
   * Process transcript with OpenAI to generate interviewer response
   * @param transcriptText The transcribed text to process
   * @param currentQuestion The current interview question
   */
  const processWithOpenAI = useCallback(async (transcriptText: string, currentQuestion: string) => {
    // Skip if text is very short (likely noise)
    if (transcriptText.trim().split(/\s+/).length < 2) {
      console.log("Text too short, skipping AI processing");
      return;
    }
    
    // Clear any existing timeout
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    
    try {
      setIsProcessingAI(true);
      toast({
        title: "Processing response",
        description: "Generating AI interviewer response..."
      });
      
      // Add user message to context
      addToContext("Candidate", transcriptText);
      
      // Create context string with conversation history
      const contextString = getContextString(currentQuestion);
      
      console.log("Processing with AI. Context:", contextString);
      
      // Process with OpenAI
      const aiResponse = await processAIResponse(contextString, currentQuestion);
      
      // Add AI response to conversation context
      addToContext("AI Interviewer", aiResponse);
      
      // Add AI response to transcript
      addToTranscript("AI Interviewer", aiResponse);
      
      // The actual speech synthesis is now handled by the InterviewAvatar component
      // which will detect the new AI response and generate a video
      // We keep this for backwards compatibility and as a fallback
      if (!isSystemAudioOn) {
        console.log("System audio is off, skipping speech synthesis");
      }
      
      // Check if we should move to the next question
      if (shouldAdvanceToNextQuestion(aiResponse)) {
        // Advance to next question after speech completes
        // Add a small delay to account for avatar generation time
        setTimeout(() => {
          advanceToNextQuestion();
        }, 5000); // Increased delay to give more time for avatar speaking
      }
      
      return aiResponse;
    } catch (error) {
      console.error("AI processing error:", error);
      toast({
        title: "AI Response Error",
        description: "Failed to generate AI response. Please check your API key.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessingAI(false);
      
      // Set a timeout to prompt the user if they're silent for too long
      processingTimeoutRef.current = setTimeout(() => {
        if (!isProcessingAI) {
          console.log("User silent for too long, AI might prompt for more input");
          // We could add logic here to have AI prompt for more input 
          // if the user is silent for too long
        }
      }, 20000); // 20 second timeout
    }
  }, [isSystemAudioOn, addToTranscript, addToContext, getContextString, advanceToNextQuestion]);

  // Function to reset conversation context
  const resetConversation = useCallback(() => {
    resetContext();
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  }, [resetContext]);

  return {
    isProcessingAI,
    processWithOpenAI,
    resetConversation
  };
};

export { useAIResponse };
