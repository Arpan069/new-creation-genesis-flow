
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewAvatar from "@/components/interview/InterviewAvatar";
import VideoFeed from "@/components/interview/VideoFeed";
import QuestionCard from "@/components/interview/QuestionCard";
import InterviewTabs from "@/components/interview/InterviewTabs";
import { useInterviewMedia } from "@/hooks/useInterviewMedia";
import { useInterview } from "@/hooks/useInterview";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedBackground from "@/components/EnhancedBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Main Interview Page Component
 * Facilitates an AI-powered interview experience with real-time video, 
 * transcription, and AI-generated responses
 */
const InterviewPage = () => {
  const { 
    videoRef, 
    isVideoOn, 
    isAudioOn, 
    isSystemAudioOn, 
    isLoading, 
    toggleVideo, 
    toggleAudio, 
    toggleSystemAudio,
    mediaStream,
    requestMediaPermissions
  } = useInterviewMedia();
  
  const { 
    isInterviewStarted, 
    isRecording,
    isProcessingAI,
    currentQuestion, 
    transcript,
    startInterview,
    endInterview,
    currentCodingQuestion,
    browserSupportsSpeechRecognition,
    isListening
  } = useInterview(isSystemAudioOn);

  // Debug state to show speech recognition status
  const [lastTranscribed, setLastTranscribed] = useState("");
  
  // Effect to monitor transcription updates
  useEffect(() => {
    if (transcript.length > 0) {
      const lastEntry = transcript[transcript.length - 1];
      if (lastEntry.speaker === "You") {
        setLastTranscribed(lastEntry.text);
      }
    }
  }, [transcript]);

  /**
   * Start interview with recording when user clicks start button
   * Checks if media stream is available
   */
  const handleStartInterview = async () => {
    if (!mediaStream) {
      // Try requesting permissions silently
      if (requestMediaPermissions) {
        try {
          await requestMediaPermissions();
        } catch (error) {
          console.error("Camera access needed: Please allow camera and microphone access to continue.");
          return;
        }
      }
      
      // If still no media stream, log error
      if (!mediaStream) {
        console.error("Camera access needed: Please allow camera and microphone access to continue.");
        return;
      }
    }
    
    // Check if browser supports speech recognition
    if (!browserSupportsSpeechRecognition) {
      console.info("Browser compatibility: For best experience, use Chrome, Edge, or Safari for speech recognition.");
    }
    
    // Start interview logic with media stream for recording
    await startInterview(mediaStream);
  };

  return (
    <EnhancedBackground intensity="light" variant="default">
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <InterviewHeader 
          onEndInterview={endInterview} 
          isRecording={isRecording} 
          isProcessingAI={isProcessingAI} 
        />
        
        <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-auto container mx-auto">
          {/* Left side - AI Avatar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex flex-col gap-4"
          >
            <Card className="relative overflow-hidden glass-morphism border-primary/10 h-[calc(100vh-300px)]"> 
              <CardContent className="p-0 h-full flex flex-col justify-center items-center">
                <InterviewAvatar 
                  isInterviewStarted={isInterviewStarted}
                  currentQuestion={currentQuestion} 
                  isSystemAudioOn={isSystemAudioOn}
                />
              </CardContent>
            </Card>
            
            <QuestionCard 
              isInterviewStarted={isInterviewStarted}
              currentQuestion={currentQuestion}
              startInterview={handleStartInterview}
              isLoading={isLoading}
            />
          </motion.div>
          
          {/* Right side - Video feed and tabs for transcript/coding */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex flex-col gap-4"
          >
            <VideoFeed 
              videoRef={videoRef}
              isVideoOn={isVideoOn}
              isAudioOn={isAudioOn}
              isSystemAudioOn={isSystemAudioOn}
              toggleVideo={toggleVideo}
              toggleAudio={toggleAudio}
              toggleSystemAudio={toggleSystemAudio}
              isRecording={isRecording}
              isListening={isListening}
              lastTranscribed={lastTranscribed}
            />
            
            <InterviewTabs 
              transcript={transcript}
              codingQuestion={currentCodingQuestion}
            />
          </motion.div>
        </main>
      </div>
    </EnhancedBackground>
  );
};

export default InterviewPage;
