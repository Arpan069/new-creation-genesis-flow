
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { videoRecorder } from "@/utils/videoRecording";
import { toast } from "@/hooks/use-toast";
import { speakText } from "@/utils/speechUtils";
import { useTranscript } from "@/hooks/useTranscript";
import { useInterviewQuestions } from "@/hooks/useInterviewQuestions";
import { useAIResponse } from "@/hooks/useAIResponse";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useSpeechMonitor } from "./useSpeechMonitor";
import { useInterviewInitialization } from "./useInterviewInitialization";

/**
 * Custom hook for managing interview logic and state
 */
export const useInterview = (isSystemAudioOn: boolean) => {
  // Navigation hook for redirecting after interview
  const navigate = useNavigate();
  
  // Core interview state
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Use custom hooks
  const { transcript, addToTranscript } = useTranscript();
  
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    currentCodingQuestion, 
    showCodingChallenge,
    setShowCodingChallenge,
    advanceToNextQuestion,
    questions,
    codingQuestions,
    resetQuestions
  } = useInterviewQuestions(isSystemAudioOn, addToTranscript);
  
  const { 
    isProcessingAI, 
    processWithOpenAI,
    resetConversation 
  } = useAIResponse(
    isSystemAudioOn, 
    addToTranscript, 
    advanceToNextQuestion
  );
  
  // Handler for new speech transcription
  const handleSpeechTranscript = useCallback((text: string) => {
    if (!text || text.trim().length < 2) return;
    
    console.log("Speech transcription received:", text);
    addToTranscript("You", text);
    
    // Process with AI for meaningful content (2+ words)
    if (text.trim().split(/\s+/).length >= 2) {
      // Add a small delay to allow for transcript to be displayed
      setTimeout(() => {
        processWithOpenAI(text, currentQuestion)
          .catch(err => console.error("Error processing speech:", err));
      }, 500);
    }
  }, [addToTranscript, processWithOpenAI, currentQuestion]);
  
  // Use speech recognition with the enhanced handler
  const { 
    startListening,
    stopListening,
    clearTranscript: clearSpeechTranscript,
    isListening,
    browserSupportsSpeechRecognition,
    resetAndRestartListening,
    hasMicPermission
  } = useSpeechToText(handleSpeechTranscript, isInterviewStarted);

  // Use speech monitoring hook
  const { 
    isSpeechRecognitionActive, 
    activateSpeechRecognition, 
    deactivateSpeechRecognition 
  } = useSpeechMonitor(
    isInterviewStarted, 
    isProcessingAI, 
    isListening, 
    resetAndRestartListening
  );

  // Use interview initialization hook
  const {
    initializeInterview,
    startInterviewRecording
  } = useInterviewInitialization(
    questions,
    setCurrentQuestion,
    resetConversation,
    resetQuestions,
    setIsInterviewStarted,
    setIsRecording,
    addToTranscript,
    clearSpeechTranscript
  );

  /**
   * Start the interview and recording
   * @param stream Media stream to record from
   */
  const startInterview = useCallback(async (stream: MediaStream) => {
    try {
      // Initialize interview with first question
      const initialized = await initializeInterview();
      
      if (!initialized) return;
      
      // Start recording
      const recordingStarted = await startInterviewRecording(stream);
      
      if (!recordingStarted) return;
      
      // Delay speaking slightly to ensure UI updates first
      setTimeout(() => {
        // Simulate AI speaking the question
        speakText(questions[0], isSystemAudioOn)
          .then(() => {
            // Start listening for speech after AI finishes speaking
            startListening();
            activateSpeechRecognition();
            console.log("Started listening after AI spoke");
          })
          .catch(err => {
            console.error("Error during AI speech:", err);
            // Still start listening even if speech fails
            startListening();
            activateSpeechRecognition();
          });
      }, 500);
      
      // Add a test message to verify the system is working
      console.log("Interview started successfully");
      toast({
        title: "Interview Started",
        description: "Speak clearly when answering questions",
        duration: 5000,
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Start failed",
        description: "Could not start interview recording",
        variant: "destructive",
      });
    }
  }, [
    questions, 
    addToTranscript, 
    isSystemAudioOn, 
    startListening, 
    clearSpeechTranscript,
    resetConversation,
    resetQuestions,
    setCurrentQuestion,
    initializeInterview,
    startInterviewRecording,
    activateSpeechRecognition
  ]);

  /**
   * End the interview and save recording
   */
  const endInterview = useCallback(async () => {
    try {
      // Stop speech recognition
      stopListening();
      deactivateSpeechRecognition();
      
      if (isRecording) {
        // Stop recording and get the blob
        const recordedBlob = await videoRecorder.stopRecording();
        setIsRecording(false);
        
        // Save the recording and get the URL
        const url = await videoRecorder.saveRecording(recordedBlob);
        setVideoUrl(url);
        
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
  }, [
    isRecording,
    navigate, 
    stopListening, 
    deactivateSpeechRecognition
  ]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        // Attempt to stop recording if component unmounts during recording
        videoRecorder.cleanup();
      }
      stopListening();
      deactivateSpeechRecognition();
    };
  }, [isRecording, stopListening, deactivateSpeechRecognition]);

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
    isProcessingAI,
    isListening,
    browserSupportsSpeechRecognition,
    hasMicPermission
  };
};
