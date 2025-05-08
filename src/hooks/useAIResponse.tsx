
import { useCallback, useRef, useState } from "react";
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
  const isAIResponding = useRef(false);
  const lastProcessedTranscript = useRef<string>("");

  /**
   * Process transcript with OpenAI to generate interviewer response
   * @param transcriptText The transcribed text to process
   * @param currentQuestion The current interview question
   */
  const processWithOpenAI = useCallback(async (transcriptText: string, currentQuestion: string) => {
    // Avoid processing if AI is already responding or no new content
    if (isAIResponding.current || transcriptText === lastProcessedTranscript.current) {
      return;
    }
    
    try {
      isAIResponding.current = true;
      setIsProcessingAI(true);
      
      // Update reference to avoid reprocessing same text
      lastProcessedTranscript.current = transcriptText;
      
      // Process with OpenAI
      const aiResponse = await openAIService.generateResponse(
        transcriptText,
        currentQuestion,
        { 
          temperature: 0.7,
          systemPrompt: `You are an AI interviewer conducting a job interview. 
          Your name is AI Interviewer. You are currently asking: "${currentQuestion}"
          Respond to the candidate's answer. Keep your response brief (2-3 sentences maximum).
          Be conversational but professional. Ask thoughtful follow-up questions when appropriate.`
        }
      );
      
      // Add AI response to transcript
      addToTranscript("AI Interviewer", aiResponse);
      
      // Convert AI response to speech if system audio is enabled
      if (isSystemAudioOn) {
        try {
          const audioBlob = await openAIService.textToSpeech(aiResponse);
          await openAIService.playAudio(audioBlob);
          
          // After speech finishes, consider moving to next question if appropriate
          const shouldAdvance = aiResponse.includes("next question") || 
                               aiResponse.includes("Let's move on");
          
          if (shouldAdvance) {
            // Advance to next question after speech completes
            advanceToNextQuestion();
          }
        } catch (error) {
          console.error("TTS error:", error);
          // Fall back to silent mode if TTS fails
        }
      }
    } catch (error) {
      console.error("AI processing error:", error);
      toast({
        title: "AI Processing Error",
        description: "Failed to generate AI response",
        variant: "destructive",
      });
    } finally {
      isAIResponding.current = false;
      setIsProcessingAI(false);
    }
  }, [isSystemAudioOn, addToTranscript, advanceToNextQuestion]);

  return {
    isProcessingAI,
    processWithOpenAI
  };
};
