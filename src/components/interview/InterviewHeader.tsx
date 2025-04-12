
import React from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface InterviewHeaderProps {
  onEndInterview: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({ onEndInterview }) => {
  const { theme } = useTheme();
  const [time, setTime] = React.useState<string>("00:00");
  const [seconds, setSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setTime(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <header className={`sticky top-0 z-40 py-3 px-4 md:px-6 ${
      theme === 'dark' 
        ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
        : 'bg-white/70 backdrop-blur-xl border-b border-gray-200/70'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img 
              src="https://interviewstaging.shiksak.com/storage/customimages/ai-interviewlogo.png" 
              alt="AI Interview Logo" 
              className="h-8" 
            />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-xl font-bold hidden md:block">AI Interview</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary/10 p-1.5 px-3 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{time}</span>
          </div>
          
          <Button 
            onClick={onEndInterview} 
            variant="ghost" 
            className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <X className="mr-2 h-4 w-4" />
            End Interview
          </Button>
        </div>
      </div>
    </header>
  );
};

export default InterviewHeader;
