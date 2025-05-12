
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

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
          setMediaStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Attempt to play the video immediately after setting srcObject
            try {
              await videoRef.current.play();
              console.log("Video playback started successfully");
            } catch (playError) {
              console.error("Error playing video after initialization:", playError);
              // Don't throw here, we still want to continue with audio setup
            }
          }

          // Check specifically if audio tracks are available
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length === 0) {
            console.warn("No audio tracks available");
          }
          
          // Check specifically if video tracks are available
          const videoTracks = stream.getVideoTracks();
          if (videoTracks.length === 0) {
            console.warn("No video tracks available");
            setIsVideoOn(false);
          }
        } else {
          console.error("getUserMedia is not supported in this browser");
          toast({
            title: "Browser Compatibility Issue",
            description: "Your browser doesn't support camera access.",
            variant: "destructive",
          });
        }
        
        // Set loading to false after a small delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setIsLoading(false);
        setIsVideoOn(false); // Turn off video if there's an error
        
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          console.log("User denied permission for media devices");
          toast({
            title: "Permission Denied",
            description: "Camera access is required for the interview.",
            variant: "destructive",
          });
        } else if (error instanceof DOMException && error.name === "NotFoundError") {
          console.log("No camera found");
          toast({
            title: "No Camera Found",
            description: "Make sure your camera is properly connected.",
            variant: "destructive",
          });
        }
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

  // Toggle video
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
          
          // Update video source if needed
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
              console.error("Error playing video after adding track:", err);
            });
          }
        } catch (error) {
          console.error("Could not access camera.", error);
          toast({
            title: "Camera Access Failed",
            description: "Could not access your camera.",
            variant: "destructive",
          });
        }
      }
    }
  }, [isVideoOn]);

  // Toggle audio
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
          toast({
            title: "Microphone Access Failed",
            description: "Could not access your microphone.",
            variant: "destructive",
          });
        }
      }
    }
  }, [isAudioOn]);

  // Toggle system audio
  const toggleSystemAudio = useCallback(() => {
    setIsSystemAudioOn(prev => !prev);
  }, []);

  // Function to request media permissions again
  const requestMediaPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Explicitly request both audio and video permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      
      // Update refs and state
      mediaStreamRef.current = stream;
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          console.log("Video playback started after permissions request");
        } catch (playError) {
          console.error("Error playing video after permissions request:", playError);
        }
      }
      
      setIsVideoOn(true);
      setIsAudioOn(true);
      
      toast({
        title: "Permissions Granted",
        description: "Microphone and camera access successful.",
      });
    } catch (error) {
      console.error("Error requesting media permissions:", error);
      toast({
        title: "Permission Request Failed",
        description: "Could not get access to your camera and microphone.",
        variant: "destructive",
      });
      setIsVideoOn(false);
    } finally {
      setIsLoading(false);
    }
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
    mediaStream,
    requestMediaPermissions
  };
};
