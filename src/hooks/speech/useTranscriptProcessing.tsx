
import { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition as useSpeechRecognitionLib } from 'react-speech-recognition';

/**
 * Hook for processing speech recognition transcript
 */
export const useTranscriptProcessing = (
  isInterviewActive: boolean,
  onTranscript: (text: string) => void,
) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognitionLib();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const silentPeriodTimer = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Reset transcript and processed state
   */
  const clearTranscript = useCallback(() => {
    resetTranscript();
    setLastProcessedTranscript('');
  }, [resetTranscript]);

  /**
   * Reset and restart recognition
   */
  const resetAndRestartListening = useCallback(() => {
    SpeechRecognition.stopListening().then(() => {
      resetTranscript();
      setTimeout(() => {
        SpeechRecognition.startListening({ 
          continuous: true, 
          language: 'en-US',
        });
      }, 1000);
    }).catch(err => {
      console.error("Error resetting speech recognition:", err);
    });
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
  
  // Monitor for silent periods
  useEffect(() => {
    // Reset the silent period timer when we receive new transcripts
    if (transcript !== lastProcessedTranscript) {
      // Clear previous timer if exists
      if (silentPeriodTimer.current) {
        clearTimeout(silentPeriodTimer.current);
      }
      
      // Set new timer to check if user stopped speaking
      silentPeriodTimer.current = setTimeout(() => {
        if (isInterviewActive && listening && lastProcessedTranscript === transcript) {
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
  }, [listening, isInterviewActive, transcript, lastProcessedTranscript, resetAndRestartListening]);
  
  return {
    transcript,
    listening,
    clearTranscript,
    resetTranscript,
    resetAndRestartListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  };
};
