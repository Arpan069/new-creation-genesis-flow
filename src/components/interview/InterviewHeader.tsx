
import React from "react";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface InterviewHeaderProps {
  onEndInterview: () => void;
  isDialogOpen: boolean;
  toggleDialog: () => void;
}

const InterviewHeader = ({ 
  onEndInterview,
  isDialogOpen,
  toggleDialog
}: InterviewHeaderProps) => {
  return (
    <header className="w-full py-4 px-4 border-b bg-background/80 backdrop-blur-md z-40 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://interviewstaging.shiksak.com/storage/customimages/ai-interviewlogo.png"
            alt="AI Interview Logo"
            className="h-8"
          />
          <span className="font-semibold text-lg">Interview</span>
        </Link>

        <AlertDialog open={isDialogOpen} onOpenChange={toggleDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <XCircle className="h-4 w-4" />
              <span>End Interview</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Interview Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end this interview? Your progress will not be saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onEndInterview}>
                Yes, End Interview
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default InterviewHeader;
