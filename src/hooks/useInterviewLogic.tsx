
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { videoRecorder } from "@/utils/videoRecording";
import { OpenAIService } from "@/services/OpenAIService";
import { toast } from "@/hooks/use-toast";
import { speakText } from "@/utils/speechUtils";
import { useTranscript } from "@/hooks/useTranscript";
import { useInterviewQuestions } from "@/hooks/useInterviewQuestions";
import { useAIResponse } from "@/hooks/useAIResponse";
import { useRealTimeTranscription } from "@/hooks/useRealTimeTranscription";

const openAIService = new OpenAIService();

/**
 * Custom hook for managing interview logic and state
 * @param isSystemAudioOn - Whether system audio is enabled
 */
export const useInterviewLogic = (isSystemAudioOn: boolean) => {
  // Navigation hook for redirecting after interview
  const navigate = useNavigate();
  
  // Core interview state
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // References to keep track of transcription status
  const transcriptionInProgress = useRef(false);

  // Use custom hooks
  const { transcript, addToTranscript } = useTranscript();
  
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    currentCodingQuestion, 
    setCurrentCodingQuestion,
    showCodingChallenge,
    setShowCodingChallenge,
    advanceToNextQuestion,
    questions,
    codingQuestions
  } = useInterviewQuestions(isSystemAudioOn, addToTranscript);
  
  const { isProcessingAI, processWithOpenAI } = useAIResponse(
    isSystemAudioOn, 
    addToTranscript, 
    advanceToNextQuestion
  );
  
  const { handleRealTimeTranscription } = useRealTimeTranscription(
    addToTranscript,
    processWithOpenAI,
    currentQuestion
  );

  /**
   * Generate a complete transcript from the full recording
   * @param audioOrVideoBlob The complete recording blob
   */
  const generateFullTranscript = useCallback(async (audioOrVideoBlob: Blob) => {
    try {
      transcriptionInProgress.current = true;
      toast({
        title: "Finalizing transcript",
        description: "Processing complete interview...",
      });
      
      // Send the complete recording to OpenAI for transcription
      const result = await openAIService.transcribe(audioOrVideoBlob, {
        language: "en", // Default to English
      });
      
      // Parse the result and update transcript with a final, complete version
      if (result.text) {
        // Add a final, complete transcription to the end of the transcript
        addToTranscript("Complete Interview Transcript", result.text);
        
        toast({
          title: "Transcript finalized",
          description: "Complete interview transcript has been created",
        });
      }
    } catch (error) {
      console.error("Final transcription error:", error);
      toast({
        title: "Final transcription incomplete",
        description: "Could not generate complete transcript from recording",
        variant: "destructive",
      });
    } finally {
      transcriptionInProgress.current = false;
    }
  }, [addToTranscript]);

  /**
   * Start the interview and recording
   * @param stream Media stream to record from
   */
  const startInterview = useCallback(async (stream: MediaStream) => {
    try {
      // Set interview as started
      setIsInterviewStarted(true);
      // Set the first question
      setCurrentQuestion(questions[0]);
      
      // Start recording with real-time transcription enabled
      await videoRecorder.startRecording(stream, {
        enableRealTimeTranscription: true,
        transcriptionCallback: handleRealTimeTranscription
      });
      
      // Update recording state
      setIsRecording(true);
      
      // Add initial AI question to transcript
      addToTranscript("AI Interviewer", questions[0]);
      
      // Set initial coding question but don't show it yet
      setCurrentCodingQuestion(codingQuestions[0]);
      
      // Simulate AI speaking the question
      speakText(questions[0], isSystemAudioOn);
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Start failed",
        description: "Could not start interview recording",
        variant: "destructive",
      });
    }
  }, [questions, codingQuestions, handleRealTimeTranscription, addToTranscript, isSystemAudioOn]);

  /**
   * End the interview and save recording
   */
  const endInterview = useCallback(async () => {
    try {
      if (isRecording) {
        // Stop recording and get the blob
        const recordedBlob = await videoRecorder.stopRecording();
        setIsRecording(false);
        
        // Save the recording and get the URL
        const url = await videoRecorder.saveRecording(recordedBlob);
        setVideoUrl(url);
        
        // Final transcription of the full recording for completeness
        if (!transcriptionInProgress.current) {
          generateFullTranscript(recordedBlob);
        }
        
        toast({
          title: "Interview completed",
          description: "Recording saved successfully",
        });
      }
      
      // Navigate back to dashboard
      navigate("/candidate/dashboard");
    } catch (error) {
      console.error("Error ending interview:", error);
      toast({
        title: "Error",
        description: "Failed to end interview properly",
        variant: "destructive",
      });
      navigate("/candidate/dashboard");
    }
  }, [isRecording, navigate, generateFullTranscript]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        // Attempt to stop recording if component unmounts during recording
        videoRecorder.cleanup();
      }
    };
  }, [isRecording]);

  return {
    isInterviewStarted,
    isRecording,
    currentQuestion,
    transcript,
    startInterview,
    endInterview,
    currentCodingQuestion,
    showCodingChallenge,
    videoUrl,
    isProcessingAI
  };
};
