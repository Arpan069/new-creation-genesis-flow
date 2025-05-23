
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { videoRecorder } from "@/utils/videoRecording";
import { speakText } from "@/utils/speechUtils";
import { backendService } from "@/services/api/BackendService"; // Import backendService
import type { TranscriptItem } from "@/types/interview"; // Import TranscriptItem

/**
 * Helper function to format transcript items into a single string.
 */
function formatTranscriptToString(transcriptItems: TranscriptItem[]): string {
  return transcriptItems.map(item => `${item.speaker} (${item.timestamp}): ${item.text}`).join('\n\n');
}

/**
 * Custom hook for managing interview actions
 */
export function useInterviewActions(
  isSystemAudioOn: boolean,
  questions: string[],
  isRecording: boolean,
  setIsRecording: (value: boolean) => void,
  setVideoUrl: (url: string | null) => void,
  navigateToDashboard: () => void,
  stopListening: () => void,
  deactivateSpeechRecognition: () => void
) {
  /**
   * End the interview, save recording, and process details.
   * @param currentTranscript The current transcript items.
   */
  const endInterview = useCallback(async (currentTranscript: TranscriptItem[]) => {
    try {
      // Stop speech recognition
      stopListening();
      deactivateSpeechRecognition();
      
      let videoUrl: string | null = null;

      if (isRecording) {
        // Stop recording and get the blob
        const recordedBlob = await videoRecorder.stopRecording();
        setIsRecording(false);
        
        // Save the recording and get the URL
        // videoStorage.saveRecording will use the path from VIDEO_STORAGE_CONFIG
        videoUrl = await videoRecorder.saveRecording(recordedBlob);
        setVideoUrl(videoUrl); // Update local state if needed for UI
        
        toast({
          title: "Interview recording saved locally.",
          description: "Now processing and saving details to server...",
        });
      }
      
      if (videoUrl && currentTranscript && currentTranscript.length > 0) {
        const transcriptText = formatTranscriptToString(currentTranscript);
        try {
          // Call backend to save details and trigger analysis
          // Title can be more dynamic if needed, e.g., based on user or first question
          const interviewTitle = questions.length > 0 ? `Interview about "${questions[0].substring(0, 50)}..."` : "AI Practice Interview";
          
          await backendService.saveCompletedInterview({
            video_url: videoUrl,
            transcript_text: transcriptText,
            title: interviewTitle 
          });
          toast({
            title: "Interview details saved!",
            description: "Your interview and analysis have been stored.",
          });
        } catch (apiError) {
          console.error("Error saving interview details to backend:", apiError);
          toast({
            title: "Server Error",
            description: "Failed to save interview details to server. Recording saved locally.",
            variant: "destructive",
          });
        }
      } else if (isRecording) {
         toast({
            title: "Notice",
            description: "No video URL or transcript to save to server. Recording might have failed or transcript empty.",
            variant: "default",
          });
      }
      
      // Navigate back to dashboard regardless of backend save success for now
      navigateToDashboard();
    } catch (error) {
      console.error("Error ending interview:", error);
      toast({
        title: "Error",
        description: "Failed to end interview properly. Some data may not be saved.",
        variant: "destructive",
      });
      navigateToDashboard(); // Ensure navigation even on error
    }
  }, [
    isRecording,
    navigateToDashboard, 
    stopListening, 
    deactivateSpeechRecognition,
    setIsRecording,
    setVideoUrl,
    questions, // Added questions for title generation
    isSystemAudioOn // isSystemAudioOn was a param but not used in endInterview, kept for consistency with hook params
  ]);

  /**
   * Speak the first question
   */
  const speakFirstQuestion = useCallback(async () => {
    // Delay speaking slightly to ensure UI updates first
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (questions.length > 0) {
            speakText(questions[0], isSystemAudioOn)
            .then(() => resolve())
            .catch(err => {
                console.error("Error during AI speech:", err);
                resolve(); // Still resolve even if speech fails
            });
        } else {
            console.warn("No questions to speak for speakFirstQuestion.");
            resolve();
        }
      }, 500);
    });
  }, [questions, isSystemAudioOn]);
  
  return {
    endInterview,
    speakFirstQuestion
  };
}

