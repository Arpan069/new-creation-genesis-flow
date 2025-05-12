import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from "lucide-react";

const VideoTab = ({ videoUrl }: { videoUrl?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black/80 rounded-md flex items-center justify-center relative">
        {videoUrl ? (
          // If video URL exists, show the video player
          <video 
            ref={videoRef}
            className="w-full h-full rounded-md"
            src={videoUrl}
            poster={videoUrl ? `${videoUrl}#t=0.1` : undefined}
            onEnded={() => setIsPlaying(false)}
            onClick={handlePlayPause}
          />
        ) : (
          // Otherwise show placeholder
          <span className="text-white/50 text-sm">Interview video preview</span>
        )}
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg" 
              className="rounded-full h-14 w-14"
              onClick={handlePlayPause}
              disabled={!videoUrl}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          className="flex-1"
          onClick={handlePlayPause}
          disabled={!videoUrl}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause Interview
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Play Full Interview
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          disabled={!videoUrl}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default VideoTab;
