
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Transcript {
  speaker: string;
  text: string;
  timestamp: Date;
}

export const useInterviewLogic = (isSystemAudioOn: boolean) => {
  const navigate = useNavigate();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  
  // Interview questions
  const [questions] = useState([
    "Tell me a little about yourself and your background.",
    "What interests you about this position?",
    "What are your greatest strengths that make you suitable for this role?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "Where do you see yourself professionally in five years?",
  ]);

  // Start the interview
  const startInterview = () => {
    setIsInterviewStarted(true);
    setCurrentQuestion(questions[0]);
    
    // Add initial AI question to transcript
    addToTranscript("AI Interviewer", questions[0]);
    
    // Simulate AI speaking
    speakText(questions[0]);
  };

  // End the interview
  const endInterview = () => {
    // Here you would normally send the transcript data to your backend
    // for analysis and scoring
    
    toast({
      title: "Interview complete",
      description: "Thank you for participating in the interview.",
    });
    
    navigate("/candidate/dashboard");
  };

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
    // For now, we'll just simulate the AI speaking with a timer
    
    toast({
      title: "AI Speaking",
      description: text.substring(0, 60) + (text.length > 60 ? "..." : ""),
      duration: 3000,
    });
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
      }, 1000);
    } else {
      // End of interview
      setTimeout(() => {
        addToTranscript("AI Interviewer", "Thank you for your time. The interview is now complete.");
        speakText("Thank you for your time. The interview is now complete.");
        
        // Show end interview button
        toast({
          title: "Interview complete",
          description: "All questions have been answered.",
          duration: 5000,
        });
      }, 1000);
    }
  };

  return {
    isInterviewStarted,
    currentQuestion,
    transcript,
    startInterview,
    endInterview,
    simulateAnswer
  };
};
