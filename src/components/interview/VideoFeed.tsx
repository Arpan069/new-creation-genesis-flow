
import React, { RefObject } from "react";
import { UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import VideoControls from "./VideoControls";

interface VideoFeedProps {
  videoRef: RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSystemAudioOn: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleSystemAudio: () => void;
  isRecording?: boolean;
}

/**
 * VideoFeed component for displaying the candidate's video feed
 * 
 * @param videoRef - Reference to the video element
 * @param isVideoOn - Whether video is enabled
 * @param isAudioOn - Whether microphone audio is enabled
 * @param isSystemAudioOn - Whether system audio is enabled
 * @param toggleVideo - Function to toggle video on/off
 * @param toggleAudio - Function to toggle microphone audio on/off
 * @param toggleSystemAudio - Function to toggle system audio on/off
 * @param isRecording - Whether the interview is being recorded
 */
const VideoFeed = ({
  videoRef,
  isVideoOn,
  isAudioOn,
  isSystemAudioOn,
  toggleVideo,
  toggleAudio,
  toggleSystemAudio,
  isRecording = false,
}: VideoFeedProps) => {
  return (
    <Card className="relative glass-morphism border-primary/10">
      <CardContent className="p-2 aspect-video relative">
        {/* Main video element that displays the user's camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-md"
        />
        
        {/* Video controls for toggling camera, microphone, and system audio */}
        <VideoControls
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          isSystemAudioOn={isSystemAudioOn}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleSystemAudio={toggleSystemAudio}
        />
        
        {/* Video status indicators */}
        <div className="absolute top-4 left-4 flex items-center gap-2 p-1 px-2 bg-background/70 backdrop-blur-sm rounded-full">
          {isRecording ? (
            <>
              {/* Recording indicator with real-time transcription notice */}
              <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs font-medium text-red-500">REC</span>
              <span className="text-xs ml-1 opacity-75">(Transcribing)</span>
            </>
          ) : (
            <>
              {/* Live indicator when not recording */}
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs font-medium">LIVE</span>
            </>
          )}
        </div>
        
        {/* User indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 p-1 px-2 bg-background/70 backdrop-blur-sm rounded-full">
          <UserCheck size={14} className="text-green-500" />
          <span className="text-xs font-medium">You</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoFeed;
