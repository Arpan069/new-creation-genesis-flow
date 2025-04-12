
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useInterviewMedia = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSystemAudioOn, setIsSystemAudioOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoOn, 
          audio: isAudioOn 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "System check complete",
            description: "Camera and microphone are working properly.",
          });
        }, 2000);
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast({
          title: "Media access error",
          description: "Could not access camera or microphone. Please check your permissions.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    initializeMedia();
    
    return () => {
      // Clean up media streams when component unmounts
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle video
  const toggleVideo = async () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    
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
          toast({
            title: "Camera error",
            description: "Could not access camera.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    
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
          toast({
            title: "Microphone error",
            description: "Could not access microphone.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Toggle system audio (AI voice)
  const toggleSystemAudio = () => {
    setIsSystemAudioOn(!isSystemAudioOn);
  };

  return {
    videoRef,
    isVideoOn,
    isAudioOn,
    isSystemAudioOn,
    isLoading,
    toggleVideo,
    toggleAudio,
    toggleSystemAudio
  };
};
