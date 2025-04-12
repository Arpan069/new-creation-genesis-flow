
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface QuestionCardProps {
  isInterviewStarted: boolean;
  currentQuestion: string;
  simulateAnswer: () => void;
  startInterview: () => void;
  isLoading: boolean;
}

const QuestionCard = ({
  isInterviewStarted,
  currentQuestion,
  simulateAnswer,
  startInterview,
  isLoading,
}: QuestionCardProps) => {
  if (isInterviewStarted) {
    return (
      <Card className="glass-morphism border-primary/10">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Current Question:</h3>
            <p className="text-md">{currentQuestion}</p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={simulateAnswer} className="bg-primary hover:bg-primary/90">
              <MessageSquare className="mr-2 h-4 w-4" />
              Simulate Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-morphism border-primary/10">
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Ready to begin your interview?</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure your camera and microphone are working properly.</p>
          <Button 
            onClick={startInterview} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Setting up..." : "Start Interview"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
