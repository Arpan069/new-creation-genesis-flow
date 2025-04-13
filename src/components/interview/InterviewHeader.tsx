
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface InterviewHeaderProps {
  onEndInterview: () => void;
}

const InterviewHeader = ({ onEndInterview }: InterviewHeaderProps) => {
  const navigate = useNavigate();

  const handleEndInterview = () => {
    navigate("/candidate/dashboard");
  };

  return (
    <header className="w-full py-4 px-4 border-b bg-background/80 backdrop-blur-md z-40 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/dd63a16d-398e-4187-a982-b19a91446630.png"
            alt="Vinte AI Interview Logo"
            className="h-8"
          />
        </Link>

        <Button variant="outline" className="gap-2" onClick={handleEndInterview}>
          <XCircle className="h-4 w-4" />
          <span>End Interview</span>
        </Button>
      </div>
    </header>
  );
};

export default InterviewHeader;
