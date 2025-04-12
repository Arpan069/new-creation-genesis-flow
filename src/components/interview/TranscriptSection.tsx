
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TranscriptMessage {
  speaker: string;
  text: string;
  timestamp: Date;
}

interface TranscriptSectionProps {
  transcript: TranscriptMessage[];
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcript }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [transcript]);
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Copy transcript to clipboard
  const copyTranscript = () => {
    const text = transcript
      .map(msg => `[${formatTime(msg.timestamp)}] ${msg.speaker}: ${msg.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Interview transcript has been copied to clipboard",
      });
    });
  };
  
  // Download transcript
  const downloadTranscript = () => {
    const text = transcript
      .map(msg => `[${formatTime(msg.timestamp)}] ${msg.speaker}: ${msg.text}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded transcript",
      description: "Interview transcript has been downloaded",
    });
  };
  
  return (
    <Card className="flex-grow glass-morphism border-primary/10">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transcript</CardTitle>
        
        <div className="flex gap-2">
          <Button 
            onClick={copyTranscript} 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            disabled={transcript.length === 0}
          >
            <Copy size={14} />
          </Button>
          <Button 
            onClick={downloadTranscript} 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            disabled={transcript.length === 0}
          >
            <Download size={14} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] rounded-md" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {transcript.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                Interview transcript will appear here
              </div>
            ) : (
              transcript.map((message, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${message.speaker === 'AI Interviewer' ? 'text-primary' : 'text-foreground'}`}>
                      {message.speaker}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm pl-0">{message.text}</p>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptSection;
