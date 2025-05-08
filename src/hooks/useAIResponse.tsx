
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
  const processingRetries = useRef<number>(0);
  const maxRetries = 3;

  /**
   * Process transcript with OpenAI to generate interviewer response
   * @param transcriptText The transcribed text to process
   * @param currentQuestion The current interview question
   */
  const processWithOpenAI = useCallback(async (transcriptText: string, currentQuestion: string) => {
    // Avoid processing if AI is already responding or text is too similar to last processed
    if (isAIResponding.current) {
      console.log("AI is already responding, skipping processing");
      return;
    }
    
    // Check if text is too similar to avoid duplicate processing
    if (transcriptText === lastProcessedTranscript.current) {
      console.log("Transcript unchanged, skipping processing");
      return;
    }
    
    // Ignore very short transcripts (likely false positives)
    if (transcriptText.trim().split(/\s+/).length < 2) {
      console.log("Transcript too short, skipping processing");
      return;
    }
    
    try {
      isAIResponding.current = true;
      setIsProcessingAI(true);
      
      // Update reference to avoid reprocessing same text
      lastProcessedTranscript.current = transcriptText;
      
      console.log(`Processing transcript: "${transcriptText}" for question: "${currentQuestion}"`);
      
      // Process with OpenAI
      const aiResponse = await openAIService.generateResponse(
        transcriptText,
        currentQuestion,
        { 
          temperature: 0.7,
          systemPrompt: `You are an AI interviewer conducting a job interview. 
          Your name is AI Interviewer. You are currently asking: "${currentQuestion}"
          Respond to the candidate's answer. Keep your response brief (2-3 sentences maximum).
          Be conversational but professional. Ask thoughtful follow-up questions when appropriate.
          You must respond in complete sentences, even if the candidate's answer is unclear.
          If the candidate's answer isn't clear, ask them to clarify.`
        }
      );
      
      console.log("AI Response received:", aiResponse);
      
      // Reset retry counter on success
      processingRetries.current = 0;
      
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
          toast({
            title: "Text-to-speech issue",
            description: "Audio playback failed. Check your speakers.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("AI processing error:", error);
      
      // Increment retry counter
      processingRetries.current++;
      
      if (processingRetries.current <= maxRetries) {
        // Try again with a delay
        toast({
          title: "AI Processing Retry",
          description: `Trying again (${processingRetries.current}/${maxRetries})...`,
          variant: "default",
        });
        
        setTimeout(() => {
          processWithOpenAI(transcriptText, currentQuestion);
        }, 2000); // Retry after 2 seconds
      } else {
        // Reset retry counter and show error
        processingRetries.current = 0;
        toast({
          title: "AI Processing Error",
          description: "Failed to generate AI response after multiple attempts",
          variant: "destructive",
        });
      }
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
