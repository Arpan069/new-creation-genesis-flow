
import "regenerator-runtime/runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from "@/hooks/use-toast";
import { requestAudioPermission } from "@/utils/speechUtils";

export const useSpeechToText = (
  onTranscript: (text: string) => void,
  isInterviewActive: boolean = false
) => {
  // Use the react-speech-recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const startAttempts = useRef(0);
  const lastStartTime = useRef<number | null>(null);
  const silentPeriodTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      const hasPermission = await requestAudioPermission();
      setHasMicPermission(hasPermission);
      
      if (!hasPermission) {
        console.warn("Microphone permission not granted");
        toast({
          title: "Microphone access needed",
          description: "Please allow microphone access for speech recognition."
        });
      }
    };
    
    checkMicPermission();
  }, []);
  
  // Check for recognition errors or silent periods
  useEffect(() => {
    if (isInterviewActive && !listening && isRecognitionActive) {
      // Only log after multiple failures to avoid false positives
      if (startAttempts.current > 3) {
        console.warn("Speech recognition stopped unexpectedly. Attempting to restart...");
        // Add small delay before restart
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    }
    
    // Reset the silent period timer when we receive new transcripts
    if (transcript !== lastProcessedTranscript) {
      // Clear previous timer if exists
      if (silentPeriodTimer.current) {
        clearTimeout(silentPeriodTimer.current);
      }
      
      // Set new timer to check if user stopped speaking
      silentPeriodTimer.current = setTimeout(() => {
        if (isInterviewActive && isRecognitionActive && lastProcessedTranscript === transcript) {
          console.log("Detected silent period. Restarting speech recognition...");
          resetAndRestartListening();
        }
      }, 10000); // 10 seconds of silence
    }
    
    return () => {
      if (silentPeriodTimer.current) {
        clearTimeout(silentPeriodTimer.current);
      }
    };
  }, [listening, isInterviewActive, isRecognitionActive, transcript, lastProcessedTranscript]);
  
  // Reset and restart recognition
  const resetAndRestartListening = useCallback(() => {
    if (isRecognitionActive) {
      SpeechRecognition.stopListening().then(() => {
        resetTranscript();
        setTimeout(() => {
          startListening();
        }, 1000);
      }).catch(err => {
        console.error("Error resetting speech recognition:", err);
      });
    }
  }, [isRecognitionActive, resetTranscript]);
  
  // Start speech recognition with retry logic
  const startListening = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition');
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    // Check/request permission if needed
    if (hasMicPermission === false) {
      const hasPermission = await requestAudioPermission();
      setHasMicPermission(hasPermission);
      
      if (!hasPermission) {
        toast({
          title: "Microphone access needed",
          description: "Please allow microphone access for speech recognition."
        });
        return;
      }
    }
    
    // Prevent rapid restart attempts
    const now = Date.now();
    if (lastStartTime.current && now - lastStartTime.current < 2000) {
      console.log("Throttling speech recognition start attempts");
      return;
    }
    
    lastStartTime.current = now;
    startAttempts.current += 1;
    
    try {
      // Use continuous mode with long sessions to avoid breaks
      await SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'en-US',
      });
      
      setIsRecognitionActive(true);
      console.log('Started listening for speech');
      
      // Reset attempt counter on successful start
      startAttempts.current = 0;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      
      // Check for permission issues
      if (!isMicrophoneAvailable) {
        toast({
          title: "Microphone access needed",
          description: "Please allow microphone access for speech recognition."
        });
      }
      
      // Try again after a delay if we're in interview mode
      if (isInterviewActive && startAttempts.current < 5) {
        setTimeout(() => {
          startListening();
        }, 2000);
      }
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, isInterviewActive, hasMicPermission]);
  
  // Stop speech recognition
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setIsRecognitionActive(false);
    console.log('Stopped listening for speech');
  }, []);
  
  // Reset transcript
  const clearTranscript = useCallback(() => {
    resetTranscript();
    setLastProcessedTranscript('');
  }, [resetTranscript]);
  
  // Process transcript changes with intelligent chunking
  useEffect(() => {
    if (!isInterviewActive || !transcript) return;
    
    // Debounce processing to collect more complete phrases
    const timeoutId = setTimeout(() => {
      if (transcript === lastProcessedTranscript) return;
      
      // Check if enough new text to process
      const newText = transcript.substring(lastProcessedTranscript.length).trim();
      
      if (newText) {
        console.log("Processing new speech:", newText);
        onTranscript(newText);
        setLastProcessedTranscript(transcript);
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [transcript, lastProcessedTranscript, onTranscript, isInterviewActive]);
  
  // Auto-start listening when interview becomes active with exponential backoff
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isInterviewActive && !isRecognitionActive) {
      const delay = Math.min(1000 * Math.pow(2, startAttempts.current), 10000);
      timeoutId = setTimeout(() => {
        startListening();
      }, delay);
    } else if (!isInterviewActive && isRecognitionActive) {
      stopListening();
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (isRecognitionActive) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isInterviewActive, isRecognitionActive, startListening, stopListening]);
  
  return {
    isListening: listening,
    currentTranscript: transcript,
    startListening,
    stopListening,
    clearTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    hasMicPermission,
    resetAndRestartListening
  };
};
