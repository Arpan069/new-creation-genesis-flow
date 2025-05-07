
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X, Circle } from "lucide-react";

interface InterviewHeaderProps {
  onEndInterview: () => void;
  isRecording?: boolean;
}

const InterviewHeader = ({ onEndInterview, isRecording }: InterviewHeaderProps) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Back button */}
        <Button variant="ghost" onClick={onEndInterview} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Title with recording indicator */}
        <div className="flex items-center gap-2">
          {isRecording && (
            <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
          )}
          <h1 className="text-lg font-semibold">AI Interview</h1>
        </div>

        {/* End button */}
        <Button 
          variant="ghost" 
          onClick={onEndInterview}
          className="text-destructive"
        >
          <X className="h-4 w-4 mr-1" />
          End Interview
        </Button>
      </div>
    </header>
  );
};

export default InterviewHeader;
