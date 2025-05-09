import { useCallback, useState, useRef } from "react";
import { OpenAIService } from "@/services/OpenAIService";
import { toast } from "@/hooks/use-toast";
import { speakText } from "@/utils/speechUtils";

const openAIService = new OpenAIService();

/**
 * Hook for managing AI responses in the interview
 */
export const useAIResponse = (
  isSystemAudioOn: boolean,
  addToTranscript: (speaker: string, text: string) => void,
  advanceToNextQuestion: () => void
) => {
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const conversationContext = useRef<string[]>([]);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      
      // Add user message to context
      conversationContext.current.push(`Candidate: ${transcriptText}`);
      
      // Keep context to last 6 messages for better performance
      if (conversationContext.current.length > 6) {
        conversationContext.current = conversationContext.current.slice(-6);
      }
      
      console.log(`Processing transcript: "${transcriptText}" for question: "${currentQuestion}"`);
      
      // Create a context string with recent conversation history
      const contextString = [
        `Current question: "${currentQuestion}"`,
        ...conversationContext.current
      ].join("\n\n");
      
      // Process with OpenAI
      const aiResponse = await openAIService.generateResponse(
        contextString,
        currentQuestion,
        { 
          temperature: 0.7,
          systemPrompt: `You are an AI interviewer conducting a job interview. 
          Your name is AI Interviewer. You are currently asking: "${currentQuestion}"
          Respond naturally to the candidate's answer. Keep your response brief (2-3 sentences maximum).
          Be conversational but professional. Ask thoughtful follow-up questions when appropriate.
          You must respond in complete sentences, even if the candidate's answer is unclear.
          If the candidate's answer shows they are done with this topic, end with "Let's move on to the next question."
          If the candidate's answer is unclear, ask them to clarify.
          IMPORTANT: Don't repeat yourself. Never say "Thank you for sharing" or similar phrases repeatedly.`
        }
      );
      
      console.log("AI Response received:", aiResponse);
      
      // Add AI response to conversation context
      conversationContext.current.push(`AI Interviewer: ${aiResponse}`);
      
      // Add AI response to transcript
      addToTranscript("AI Interviewer", aiResponse);
      
      // Convert AI response to speech if system audio is enabled
      await speakText(aiResponse, isSystemAudioOn);
      
      // Check if we should move to the next question
      const shouldAdvance = aiResponse.includes("next question") || 
                          aiResponse.includes("Let's move on");
      
      if (shouldAdvance) {
        // Advance to next question after speech completes
        advanceToNextQuestion();
      }
    } catch (error) {
      console.error("AI processing error:", error);
      toast({
        title: "AI Processing Error",
        description: "Failed to generate AI response. Please check your API key.",
        variant: "destructive",
      });
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
  }, [isSystemAudioOn, addToTranscript, advanceToNextQuestion]);

  // Function to reset conversation context
  const resetConversation = useCallback(() => {
    conversationContext.current = [];
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  }, []);

  return {
    isProcessingAI,
    processWithOpenAI,
    resetConversation
  };
};
