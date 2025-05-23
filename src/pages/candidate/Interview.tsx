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
import { ApiKeySetup } from "@/components/interview/ApiKeySetup";
import type { TranscriptItem } from "@/types/interview"; 
import type { Transcript } from "@/types/transcript"; // To properly type the state
import { backendService } from "@/services/api/BackendService"; // Added this import

const InterviewPage = () => {
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);

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
    isListening,
    isAISpeaking
  } = useInterview(isSystemAudioOn);

  const [lastTranscribed, setLastTranscribed] = useState("");

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Using backendService instance now
        const health = await backendService.healthCheck();
        setBackendReady(health.status === "ok");
        setApiKeyConfigured(health.api_key_configured || false);
      } catch (error) {
        console.error("Backend connection error:", error);
        setBackendReady(false);
        setApiKeyConfigured(false);
      }
    };

    checkBackendStatus();
  }, []);

  useEffect(() => {
    if (transcript.length > 0) {
      const lastEntry = transcript[transcript.length - 1];
      if (lastEntry.speaker === "You") {
        setLastTranscribed(lastEntry.text);
      }
    }
  }, [transcript]);

  const handleApiKeySuccess = () => {
    setApiKeyConfigured(true);
  };

  const handleStartInterview = async () => {
    if (!mediaStream) {
      if (requestMediaPermissions) {
        try {
          await requestMediaPermissions();
        } catch (error) {
          console.error("Please allow camera and mic access.");
          return;
        }
      }

      // Check again if mediaStream became available
      // It's possible requestMediaPermissions updates it asynchronously
      // This check is a bit redundant if useInterviewMedia guarantees update, but safe
      if (!mediaStream && !videoRef.current?.srcObject) {
         console.error("Media stream unavailable even after permission request.");
         // Try to get it one more time if not available - defensive
         if (requestMediaPermissions) await requestMediaPermissions();
         if(!mediaStream && !videoRef.current?.srcObject) {
            console.error("Media stream still unavailable.");
            return;
         }
      }
    }

    // Ensure mediaStream is used if available, otherwise fallback to videoRef.current.srcObject if it exists
    const streamToUse = mediaStream || (videoRef.current?.srcObject as MediaStream | null);

    if (!streamToUse) {
      console.error("No media stream available to start interview.");
      return;
    }
    
    // Re-assign stream to video tag before recording
    if (videoRef.current && streamToUse && videoRef.current.srcObject !== streamToUse) {
      videoRef.current.srcObject = streamToUse;
      // Ensure play is called if srcObject changes, especially if autoplay is not reliable
      try {
        await videoRef.current.play();
      } catch(playError){
        console.warn("Error trying to play video after re-assigning srcObject:", playError);
        // This can happen if the user hasn't interacted with the page yet.
      }
    }


    if (!browserSupportsSpeechRecognition) {
      console.warn("Speech recognition may not work in this browser.");
    }

    const clonedStream = streamToUse.clone();
    await startInterview(clonedStream);
  };

  const handleEndInterview = () => {
    // Convert Transcript[] to TranscriptItem[]
    const formattedTranscript: TranscriptItem[] = transcript.map(item => ({
      ...item,
      timestamp: item.timestamp.toISOString(), 
    }));
    endInterview(formattedTranscript);
  };

  if (backendReady === true && apiKeyConfigured === false) {
    return (
      <EnhancedBackground intensity="light" variant="default">
        <div className="flex flex-col min-h-screen p-4 justify-center items-center">
          <ApiKeySetup onSuccess={handleApiKeySuccess} />
        </div>
      </EnhancedBackground>
    );
  }

  if (backendReady === null) {
    return (
      <EnhancedBackground intensity="light" variant="default">
        <div className="flex flex-col min-h-screen p-4 justify-center items-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-semibold">Connecting to backend...</h2>
              <p className="text-muted-foreground">Please wait while we establish connection</p>
            </CardContent>
          </Card>
        </div>
      </EnhancedBackground>
    );
  }

  if (backendReady === false) {
    return (
      <EnhancedBackground intensity="light" variant="default">
        <div className="flex flex-col min-h-screen p-4 justify-center items-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 text-destructive mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Backend Connection Error</h2>
              <p className="text-center text-muted-foreground mt-2">
                Could not connect to the Flask backend. Please make sure it's running.
              </p>
            </CardContent>
          </Card>
        </div>
      </EnhancedBackground>
    );
  }

  return (
    <EnhancedBackground intensity="light" variant="default">
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <InterviewHeader
          onEndInterview={handleEndInterview} 
          isRecording={isRecording}
          isProcessingAI={isProcessingAI}
        />

        <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-auto container mx-auto">
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
                  isSpeaking={isAISpeaking}
                  isListening={isListening && !isAISpeaking}
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
