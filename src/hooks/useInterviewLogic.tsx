
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { videoRecorder } from "@/utils/videoRecording";
import { whisperService } from "@/services/whisperService";
import { toast } from "@/hooks/use-toast";
import { TranscriptItem } from "@/types/interview";

/**
 * Interface for transcript items in the interview
 */
interface Transcript {
  speaker: string;   // Who is speaking (AI or candidate)
  text: string;      // The content of the speech
  timestamp: Date;   // When the speech occurred
}

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
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [currentCodingQuestion, setCurrentCodingQuestion] = useState("");
  const [showCodingChallenge, setShowCodingChallenge] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Reference to keep track of transcription status
  const transcriptionInProgress = useRef(false);
  
  // Interview questions - defined statically for this demo
  const [questions] = useState([
    "Tell me a little about yourself and your background.",
    "What interests you about this position?",
    "What are your greatest strengths that make you suitable for this role?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "Where do you see yourself professionally in five years?",
  ]);

  // Coding questions - defined statically for this demo
  const [codingQuestions] = useState([
    "Write a function that finds the longest substring without repeating characters in a given string.",
    "Implement a function to check if a given string is a palindrome.",
    "Create a function that reverses a linked list.",
    "Write a function to find the missing number in an array of integers from 1 to n.",
    "Implement a binary search algorithm to find a target value in a sorted array.",
  ]);

  /**
   * Callback function for handling real-time transcriptions 
   * @param text The transcribed text from Whisper API
   */
  const handleRealTimeTranscription = useCallback((text: string) => {
    if (text.trim()) {
      // Add transcribed text to the transcript
      setTranscript(prev => [...prev, {
        speaker: "You (Transcribed)",
        text: text,
        timestamp: new Date()
      }]);
    }
  }, []);

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
      speakText(questions[0]);
      
      // Notify user that interview has started
      toast({
        title: "Interview started",
        description: "Recording in progress with real-time transcription...",
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Start failed",
        description: "Could not start interview recording",
        variant: "destructive",
      });
    }
  }, [questions, codingQuestions, handleRealTimeTranscription]);

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
  }, [isRecording, navigate]);

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
      
      // Send the complete recording to Whisper for transcription
      const result = await whisperService.transcribe(audioOrVideoBlob, {
        language: "en", // Default to English
      });
      
      // Parse the result and update transcript with a final, complete version
      if (result.text) {
        // Add a final, complete transcription to the end of the transcript
        setTranscript(prev => [
          ...prev, 
          {
            speaker: "Complete Interview Transcript",
            text: result.text,
            timestamp: new Date()
          }
        ]);
        
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
  }, []);

  /**
   * Add a message to the transcript
   * @param speaker Who is speaking
   * @param text What they said
   */
  const addToTranscript = (speaker: string, text: string) => {
    setTranscript(prev => [...prev, {
      speaker,
      text,
      timestamp: new Date()
    }]);
  };

  /**
   * Simulate AI speaking text (would integrate with TTS in production)
   * @param text Text to speak
   */
  const speakText = (text: string) => {
    if (!isSystemAudioOn) return;
    
    // Here you would normally integrate with a text-to-speech API
    // For now, we'll just simulate the AI speaking with a console log
    console.log("AI Speaking:", text);
  };

  /**
   * Simulate candidate's answer and progress to next question
   * This is a demo function - in production this would be triggered by 
   * actual candidate responses detected by the transcription
   */
  const simulateAnswer = () => {
    // Get index of current question
    const currentIndex = questions.indexOf(currentQuestion);
    
    // Add simulated answer to transcript
    addToTranscript("You", "This is a simulated answer from the candidate.");
    
    // Move to the next question if available
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      setCurrentQuestion(nextQuestion);
      
      // Add next question to transcript with delay for natural conversation flow
      setTimeout(() => {
        addToTranscript("AI Interviewer", nextQuestion);
        speakText(nextQuestion);
        
        // After the third question, introduce coding challenge
        if (currentIndex === 2) {
          setTimeout(() => {
            const codingIntro = "Now let's move on to a coding challenge. Please switch to the coding tab to solve the problem.";
            addToTranscript("AI Interviewer", codingIntro);
            speakText(codingIntro);
            setShowCodingChallenge(true);
          }, 1500);
        }
      }, 1000);
    } else {
      // End of interview message
      setTimeout(() => {
        addToTranscript("AI Interviewer", "Thank you for your time. The interview is now complete.");
        speakText("Thank you for your time. The interview is now complete.");
      }, 1000);
    }
  };

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
    simulateAnswer,
    currentCodingQuestion,
    showCodingChallenge,
    videoUrl
  };
};
