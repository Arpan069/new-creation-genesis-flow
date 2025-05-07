
import { useState, useRef, useEffect, useCallback } from "react";

export const useInterviewMedia = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSystemAudioOn, setIsSystemAudioOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // New state to expose media stream to other components
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Initialize user media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: isVideoOn, 
            audio: isAudioOn 
          });
          
          mediaStreamRef.current = stream;
          setMediaStream(stream); // Set the media stream state
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          console.error("getUserMedia is not supported in this browser");
        }
        
        // Set loading to false after a small delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Reduced from 2000ms to 1000ms for better UX
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setIsLoading(false);
      }
    };

    initializeMedia();
    
    return () => {
      // Clean up media streams when component unmounts
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        setMediaStream(null);
      }
    };
  }, []);

  // Toggle video with memoized callback to prevent unnecessary re-renders
  const toggleVideo = useCallback(async () => {
    const stream = mediaStreamRef.current;
    
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        const isEnabled = videoTracks[0].enabled;
        videoTracks.forEach(track => {
          track.enabled = !isEnabled;
        });
        setIsVideoOn(!isVideoOn);
      } else if (isVideoOn) {
        // Need to get video access
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const videoTrack = newStream.getVideoTracks()[0];
          stream.addTrack(videoTrack);
          setIsVideoOn(true);
        } catch (error) {
          console.error("Could not access camera.", error);
        }
      }
    }
  }, [isVideoOn]);

  // Toggle audio with memoized callback
  const toggleAudio = useCallback(async () => {
    const stream = mediaStreamRef.current;
    
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const isEnabled = audioTracks[0].enabled;
        audioTracks.forEach(track => {
          track.enabled = !isEnabled;
        });
        setIsAudioOn(!isAudioOn);
      } else if (isAudioOn) {
        // Need to get audio access
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = newStream.getAudioTracks()[0];
          stream.addTrack(audioTrack);
          setIsAudioOn(true);
        } catch (error) {
          console.error("Could not access microphone.", error);
        }
      }
    }
  }, [isAudioOn]);

  // Toggle system audio with memoized callback
  const toggleSystemAudio = useCallback(() => {
    setIsSystemAudioOn(prev => !prev);
  }, []);

  return {
    videoRef,
    isVideoOn,
    isAudioOn,
    isSystemAudioOn,
    isLoading,
    toggleVideo,
    toggleAudio,
    toggleSystemAudio,
    mediaStream // New: Exposing media stream for recording
  };
};
