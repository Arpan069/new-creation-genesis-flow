import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { videoRecorder } from "@/utils/videoRecording";
import { elevenLabsService } from "@/services/elevenLabsService";
import { toast } from "@/hooks/use-toast";
import { TranscriptItem } from "@/types/interview";

interface Transcript {
  speaker: string;
  text: string;
  timestamp: Date;
}

export const useInterviewLogic = (isSystemAudioOn: boolean) => {
  const navigate = useNavigate();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [currentCodingQuestion, setCurrentCodingQuestion] = useState("");
  const [showCodingChallenge, setShowCodingChallenge] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Reference to keep track of transcription status
  const transcriptionInProgress = useRef(false);
  
  // Interview questions
  const [questions] = useState([
    "Tell me a little about yourself and your background.",
    "What interests you about this position?",
    "What are your greatest strengths that make you suitable for this role?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "Where do you see yourself professionally in five years?",
  ]);

  // Coding questions
  const [codingQuestions] = useState([
    "Write a function that finds the longest substring without repeating characters in a given string.",
    "Implement a function to check if a given string is a palindrome.",
    "Create a function that reverses a linked list.",
    "Write a function to find the missing number in an array of integers from 1 to n.",
    "Implement a binary search algorithm to find a target value in a sorted array.",
  ]);

  // Start the interview and recording
  const startInterview = useCallback(async (stream: MediaStream) => {
    try {
      setIsInterviewStarted(true);
      setCurrentQuestion(questions[0]);
      
      // Start recording
      await videoRecorder.startRecording(stream);
      setIsRecording(true);
      
      // Add initial AI question to transcript
      addToTranscript("AI Interviewer", questions[0]);
      
      // Set initial coding question but don't show it yet
      setCurrentCodingQuestion(codingQuestions[0]);
      
      // Simulate AI speaking
      speakText(questions[0]);
      
      toast({
        title: "Interview started",
        description: "Recording in progress...",
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Start failed",
        description: "Could not start interview recording",
        variant: "destructive",
      });
    }
  }, [questions, codingQuestions]);

  // End the interview and save recording
  const endInterview = useCallback(async () => {
    try {
      if (isRecording) {
        // Stop recording and get the blob
        const recordedBlob = await videoRecorder.stopRecording();
        setIsRecording(false);
        
        // Save the recording and get the URL
        const url = await videoRecorder.saveRecording(recordedBlob);
        setVideoUrl(url);
        
        // Generate transcript if it hasn't been done yet
        if (!transcriptionInProgress.current && transcript.length > 0) {
          generateTranscript(recordedBlob);
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
  }, [isRecording, navigate, transcript]);

  // Generate transcript from recording
  const generateTranscript = useCallback(async (audioOrVideoBlob: Blob) => {
    try {
      transcriptionInProgress.current = true;
      toast({
        title: "Generating transcript",
        description: "This may take a moment...",
      });
      
      const result = await elevenLabsService.transcribe(audioOrVideoBlob, {
        language: "en", // Default to English
      });
      
      // Parse the result and update transcript
      if (result.text) {
        // This is a simple implementation; in a real app, you'd want to 
        // parse timestamps and speaker labels more accurately
        const newTranscriptItem: TranscriptItem = {
          speaker: "Candidate",
          text: result.text,
          timestamp: new Date().toISOString()
        };
        
        // Add to state in a format compatible with your app
        setTranscript(prev => [
          ...prev, 
          {
            speaker: "Candidate (Transcribed)",
            text: result.text,
            timestamp: new Date()
          }
        ]);
        
        toast({
          title: "Transcript generated",
          description: "Interview transcript has been created",
        });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description: "Could not generate transcript from recording",
        variant: "destructive",
      });
    } finally {
      transcriptionInProgress.current = false;
    }
  }, []);

  // Add message to transcript
  const addToTranscript = (speaker: string, text: string) => {
    setTranscript(prev => [...prev, {
      speaker,
      text,
      timestamp: new Date()
    }]);
  };

  // Simulate AI speaking text
  const speakText = (text: string) => {
    if (!isSystemAudioOn) return;
    
    // Here you would normally integrate with a text-to-speech API
    // For now, we'll just simulate the AI speaking with a console log
    console.log("AI Speaking:", text);
  };

  // Simulate candidate's answer and progress to next question
  const simulateAnswer = () => {
    // In a real app, this would be triggered by speech recognition
    // For demonstration, we'll use a button
    
    const currentIndex = questions.indexOf(currentQuestion);
    
    // Add simulated answer to transcript
    addToTranscript("You", "This is a simulated answer from the candidate.");
    
    // Move to the next question if available
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      setCurrentQuestion(nextQuestion);
      
      // Add next question to transcript
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
      // End of interview
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
