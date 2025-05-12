
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const VideoTab = ({ videoUrl }: { videoUrl?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset error state when videoUrl changes
  useEffect(() => {
    setError(null);
  }, [videoUrl]);

  const handlePlayPause = async () => {
    if (!videoRef.current || !videoUrl) return;
    
    try {
      setIsLoading(true);
      
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          setError(null);
        } catch (err) {
          console.error("Error playing video:", err);
          setError("Could not play video. Please try again.");
          setIsPlaying(false);
          
          toast({
            title: "Playback Error",
            description: "Could not play the video. Try clicking again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!videoUrl) return;
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'interview-recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Handle video loading errors
  const handleVideoError = () => {
    console.error("Video loading failed");
    setError("Failed to load video. The file may be corrupted or unavailable.");
    setIsPlaying(false);
    setIsLoading(false);
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
            onLoadedData={() => setIsLoading(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={handlePlayPause}
            onError={handleVideoError}
          />
        ) : (
          // Otherwise show placeholder
          <span className="text-white/50 text-sm">Interview video preview</span>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white px-4 py-2 text-center">
            <div>
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        
        {!isPlaying && !isLoading && !error && (
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
          disabled={!videoUrl || isLoading}
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
          onClick={handleDownload}
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
