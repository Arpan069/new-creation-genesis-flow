
import React from "react";
import { motion } from "framer-motion";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewAvatar from "@/components/interview/InterviewAvatar";
import TranscriptSection from "@/components/interview/TranscriptSection";
import VideoFeed from "@/components/interview/VideoFeed";
import QuestionCard from "@/components/interview/QuestionCard";
import { useInterviewMedia } from "@/hooks/useInterviewMedia";
import { useInterviewLogic } from "@/hooks/useInterviewLogic";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedBackground from "@/components/EnhancedBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

const InterviewPage = () => {
  const { 
    videoRef, 
    isVideoOn, 
    isAudioOn, 
    isSystemAudioOn, 
    isLoading, 
    toggleVideo, 
    toggleAudio, 
    toggleSystemAudio 
  } = useInterviewMedia();
  
  const { 
    isInterviewStarted, 
    currentQuestion, 
    transcript, 
    startInterview, 
    endInterview, 
    simulateAnswer 
  } = useInterviewLogic(isSystemAudioOn);

  return (
    <EnhancedBackground intensity="light" variant="default">
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <InterviewHeader onEndInterview={endInterview} />
        
        <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-auto container mx-auto">
          {/* Left side - AI Avatar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 flex flex-col gap-4"
          >
            <Card className="flex-1 relative overflow-hidden glass-morphism border-primary/10">
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
              simulateAnswer={simulateAnswer}
              startInterview={startInterview}
              isLoading={isLoading}
            />
          </motion.div>
          
          {/* Right side - Video feed and transcript */}
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
            />
            
            <TranscriptSection transcript={transcript} />
          </motion.div>
        </main>
      </div>
    </EnhancedBackground>
  );
};

export default InterviewPage;
