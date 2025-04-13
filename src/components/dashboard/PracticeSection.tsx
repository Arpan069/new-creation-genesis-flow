
import React from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PracticeSectionProps {
  interviewRoles: string[];
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

const PracticeSection = ({ interviewRoles, selectedRole, setSelectedRole }: PracticeSectionProps) => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to select an interview role before starting",
        variant: "destructive",
      });
      return;
    }
    
    navigate("/candidate/interview");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Check */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>System Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Ensure your device meets all requirements for a smooth interview experience.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                    Passed
                  </Badge>
                  <span className="text-sm ml-2">Browser compatibility</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                    12 Mbps
                  </Badge>
                  <span className="text-sm ml-2">Internet speed</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                    Optimal
                  </Badge>
                  <span className="text-sm ml-2">Screen resolution</span>
                </div>
              </div>
              
              <Button className="w-full">Run Full System Check</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Interview Setup */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Start Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Select Interview Role</h3>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a role for your interview" />
                </SelectTrigger>
                <SelectContent>
                  {interviewRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-3">Interview Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex h-6 w-6 bg-primary/10 rounded-full items-center justify-center text-primary text-sm font-medium mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Select a role from the dropdown</h4>
                    <p className="text-xs text-muted-foreground">
                      Choose the position you're applying for
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-6 w-6 bg-primary/10 rounded-full items-center justify-center text-primary text-sm font-medium mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Check your system</h4>
                    <p className="text-xs text-muted-foreground">
                      Make sure your camera and microphone are working properly
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-6 w-6 bg-primary/10 rounded-full items-center justify-center text-primary text-sm font-medium mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Start your interview</h4>
                    <p className="text-xs text-muted-foreground">
                      Our AI interviewer will guide you through role-specific questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                className="w-full max-w-xs flex items-center gap-2" 
                onClick={handleStartInterview}
                disabled={!selectedRole}
              >
                <PlayCircle className="h-5 w-5" />
                Start Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PracticeSection;
