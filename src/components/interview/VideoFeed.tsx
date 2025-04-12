
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
}

const VideoFeed = ({
  videoRef,
  isVideoOn,
  isAudioOn,
  isSystemAudioOn,
  toggleVideo,
  toggleAudio,
  toggleSystemAudio,
}: VideoFeedProps) => {
  return (
    <Card className="relative glass-morphism border-primary/10">
      <CardContent className="p-2 aspect-video relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-md"
        />
        
        {/* Video controls */}
        <VideoControls
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          isSystemAudioOn={isSystemAudioOn}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleSystemAudio={toggleSystemAudio}
        />
        
        {/* Video indicators */}
        <div className="absolute top-4 left-4 flex items-center gap-2 p-1 px-2 bg-background/70 backdrop-blur-sm rounded-full">
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="text-xs font-medium">LIVE</span>
        </div>
        
        <div className="absolute top-4 right-4 flex items-center gap-2 p-1 px-2 bg-background/70 backdrop-blur-sm rounded-full">
          <UserCheck size={14} className="text-green-500" />
          <span className="text-xs font-medium">You</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoFeed;
