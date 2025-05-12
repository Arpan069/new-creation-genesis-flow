
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
    let mounted = true;
    
    const initializeMedia = async () => {
      try {
        console.log("Initializing media stream...");
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log("getUserMedia is supported, requesting access...");
          
          const constraints = { 
            video: true, 
            audio: true 
          };
          
          console.log("Media constraints:", constraints);
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("Media stream obtained successfully");
          
          // Verify we have video and audio tracks
          const videoTracks = stream.getVideoTracks();
          const audioTracks = stream.getAudioTracks();
          
          console.log(`Video tracks: ${videoTracks.length}, Audio tracks: ${audioTracks.length}`);
          videoTracks.forEach((track, i) => {
            console.log(`Video track ${i}: ${track.label}, enabled: ${track.enabled}, state: ${track.readyState}`);
          });
          
          if (!mounted) return;
          
          // Store the media stream
          mediaStreamRef.current = stream;
          setMediaStream(stream);
          
          // If we have no video tracks, update state
          if (videoTracks.length === 0) {
            console.warn("No video tracks available");
            setIsVideoOn(false);
          }
          
          // Set video element source
          if (videoRef.current) {
            console.log("Setting video element source");
            videoRef.current.srcObject = stream;
            
            try {
              // Explicitly play the video to ensure it starts
              await videoRef.current.play();
              console.log("Video playback started successfully");
            } catch (playError) {
              console.error("Error playing video:", playError);
              
              // Show user-friendly error message
              if (playError instanceof DOMException) {
                if (playError.name === "NotAllowedError") {
                  toast({
                    title: "Autoplay Blocked",
                    description: "Please click the video to start playback",
                    variant: "destructive",
                  });
                }
              }
            }
          } else {
            console.error("Video element reference is not available");
          }
        } else {
          console.error("getUserMedia is not supported in this browser");
          toast({
            title: "Browser Compatibility Issue",
            description: "Your browser doesn't support camera access.",
            variant: "destructive",
          });
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error("Error accessing media devices:", error);
        setIsVideoOn(false);
        
        if (error instanceof DOMException) {
          switch (error.name) {
            case "NotAllowedError":
              console.log("User denied permission for media devices");
              toast({
                title: "Camera Access Denied",
                description: "Please allow camera access for the interview.",
                variant: "destructive",
              });
              break;
            case "NotFoundError":
              console.log("No camera found");
              toast({
                title: "No Camera Found",
                description: "Please connect a camera and refresh the page.",
                variant: "destructive",
              });
              break;
            case "NotReadableError":
              console.log("Camera or microphone is already in use");
              toast({
                title: "Device Busy",
                description: "Camera or microphone is being used by another application.",
                variant: "destructive",
              });
              break;
            default:
              toast({
                title: "Media Error",
                description: `Could not access camera: ${error.message}`,
                variant: "destructive",
              });
          }
        }
      } finally {
        if (mounted) {
          // Set loading to false after a small delay
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    };

    initializeMedia();
    
    return () => {
      mounted = false;
      // Clean up media streams when component unmounts
      if (mediaStreamRef.current) {
        console.log("Cleaning up media stream");
        mediaStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
        mediaStreamRef.current = null;
        setMediaStream(null);
      }
    };
  }, []);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    console.log("Toggling video, current state:", isVideoOn);
    const stream = mediaStreamRef.current;
    
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      
      if (videoTracks.length > 0) {
        // If we have video tracks, toggle their enabled state
        videoTracks.forEach(track => {
          track.enabled = !track.enabled;
          console.log(`Video track ${track.label} enabled: ${track.enabled}`);
        });
        setIsVideoOn(!isVideoOn);
      } else if (!isVideoOn) {
        // If video is off and we have no tracks, try to get video access
        try {
          console.log("Requesting new video track");
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const videoTrack = newStream.getVideoTracks()[0];
          
          if (videoTrack) {
            stream.addTrack(videoTrack);
            setIsVideoOn(true);
            
            // Update video source
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(err => {
                console.error("Error playing video after adding track:", err);
              });
            }
            
            console.log("Video track added successfully");
          }
        } catch (error) {
          console.error("Could not access camera:", error);
          toast({
            title: "Camera Access Failed",
            description: "Could not access your camera.",
            variant: "destructive",
          });
        }
      }
    } else {
      console.warn("No media stream available to toggle video");
    }
  }, [isVideoOn]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    console.log("Toggling audio, current state:", isAudioOn);
    const stream = mediaStreamRef.current;
    
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      
      if (audioTracks.length > 0) {
        // If we have audio tracks, toggle their enabled state
        audioTracks.forEach(track => {
          track.enabled = !track.enabled;
          console.log(`Audio track ${track.label} enabled: ${track.enabled}`);
        });
        setIsAudioOn(!isAudioOn);
      } else if (!isAudioOn) {
        // If audio is off and we have no tracks, try to get audio access
        try {
          console.log("Requesting new audio track");
          const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = newStream.getAudioTracks()[0];
          
          if (audioTrack) {
            stream.addTrack(audioTrack);
            setIsAudioOn(true);
            console.log("Audio track added successfully");
          }
        } catch (error) {
          console.error("Could not access microphone:", error);
          toast({
            title: "Microphone Access Failed",
            description: "Could not access your microphone.",
            variant: "destructive",
          });
        }
      }
    } else {
      console.warn("No media stream available to toggle audio");
    }
  }, [isAudioOn]);

  // Toggle system audio
  const toggleSystemAudio = useCallback(() => {
    console.log("Toggling system audio, current state:", isSystemAudioOn);
    setIsSystemAudioOn(prev => !prev);
  }, [isSystemAudioOn]);

  // Function to request media permissions again
  const requestMediaPermissions = useCallback(async () => {
    setIsLoading(true);
    console.log("Requesting media permissions...");
    
    try {
      // Check if there's an existing stream we need to clean up
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped existing track: ${track.kind}`);
        });
        mediaStreamRef.current = null;
      }
      
      // Explicitly request both audio and video permissions
      console.log("Getting user media with audio and video");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      
      console.log("Media permissions granted successfully");
      console.log(`Video tracks: ${stream.getVideoTracks().length}, Audio tracks: ${stream.getAudioTracks().length}`);
      
      // Update refs and state
      mediaStreamRef.current = stream;
      setMediaStream(stream);
      setIsVideoOn(true);
      setIsAudioOn(true);
      
      // Update video element with new stream
      if (videoRef.current) {
        console.log("Setting new stream to video element");
        videoRef.current.srcObject = stream;
        
        try {
          await videoRef.current.play();
          console.log("Video playback started after permissions request");
        } catch (playError) {
          console.error("Error playing video after permissions request:", playError);
        }
      } else {
        console.error("Video reference not available");
      }
      
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
