
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowUpRight,
  Calendar,
  Clock,
  Download,
  FileText,
  Play,
  Star,
  User,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InterviewDetail {
  id: number;
  candidate: string;
  position: string;
  date: string;
  time: string;
  duration: number | null;
  status: string;
  score: number | null;
  videoUrl?: string;
  transcript?: Array<{
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  analysis?: {
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    problemSolvingScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    notes: string;
  };
}

// Mock interview details
const mockInterviewDetail: InterviewDetail = {
  id: 1,
  candidate: "John Doe",
  position: "Frontend Developer",
  date: "2025-04-08",
  time: "10:30 AM",
  duration: 28,
  status: "completed",
  score: 85,
  videoUrl: "https://example.com/interview-video.mp4",
  transcript: [
    { speaker: "AI Interviewer", text: "Tell me about your experience with React.", timestamp: "00:01:20" },
    { speaker: "John Doe", text: "I've been working with React for over 3 years now. I've built multiple web applications using React and have experience with state management libraries like Redux and context API.", timestamp: "00:01:35" },
    { speaker: "AI Interviewer", text: "How do you handle state management in your React applications?", timestamp: "00:02:15" },
    { speaker: "John Doe", text: "It depends on the project requirements. For smaller applications, I typically use React's built-in useState and useContext hooks. For more complex applications with deep component trees and many state interactions, I might reach for Redux or Zustand.", timestamp: "00:02:30" },
    { speaker: "AI Interviewer", text: "Can you explain how you optimize React application performance?", timestamp: "00:03:45" },
    { speaker: "John Doe", text: "I focus on several areas for optimization. First, I use React.memo and useMemo for expensive calculations and to prevent unnecessary re-renders. I also implement useCallback for functions passed as props. For lists, I make sure to provide stable keys. Additionally, I use code splitting with React.lazy and Suspense to reduce the initial bundle size.", timestamp: "00:04:02" },
  ],
  analysis: {
    technicalScore: 88,
    communicationScore: 92,
    confidenceScore: 85,
    problemSolvingScore: 82,
    overallScore: 85,
    strengths: [
      "Strong technical knowledge of React",
      "Clear communication skills",
      "Good understanding of performance optimization",
      "Practical experience with state management"
    ],
    weaknesses: [
      "Could provide more concrete examples",
      "Limited exposure to testing frameworks"
    ],
    notes: "John demonstrates strong React knowledge and would be a valuable addition to the frontend team. Consider a follow-up interview focusing on testing practices and real-world problem solving."
  }
};

const InterviewDetailSection = ({ interviewId }: { interviewId?: number }) => {
  // In a real app, you would fetch the interview details based on the ID
  const interview = mockInterviewDetail;
  
  if (!interviewId) {
    return (
      <Card className="glass-morphism h-full flex items-center justify-center">
        <CardContent className="py-10 text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium">No Interview Selected</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            Select an interview from the list above to view detailed information and analysis.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-morphism h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {interview.status === "completed" && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Completed
                </Badge>
              )}
              <CardDescription className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {interview.date} • {interview.time} 
                {interview.duration && (
                  <span className="flex items-center ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {interview.duration} min
                  </span>
                )}
              </CardDescription>
            </div>
            <CardTitle className="flex items-center gap-2">
              <span>{interview.candidate}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-normal text-base">{interview.position}</span>
            </CardTitle>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {interview.candidate.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="video">
              <Play className="h-4 w-4 mr-2" />
              Interview
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <Star className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <FileText className="h-4 w-4 mr-2" />
              Transcript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="space-y-4">
            <div className="aspect-video bg-black/80 rounded-md flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full h-14 w-14">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <span className="text-white/50 text-sm">Interview video preview</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-1" />
                Play Full Interview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            {interview.analysis ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-4 px-4">
                      <CardTitle className="text-base">Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-4">
                      <div className="space-y-2">
                        <ScoreItem 
                          label="Technical Knowledge" 
                          score={interview.analysis.technicalScore} 
                        />
                        <ScoreItem 
                          label="Communication" 
                          score={interview.analysis.communicationScore} 
                        />
                        <ScoreItem 
                          label="Confidence" 
                          score={interview.analysis.confidenceScore} 
                        />
                        <ScoreItem 
                          label="Problem Solving" 
                          score={interview.analysis.problemSolvingScore} 
                        />
                        <Separator />
                        <ScoreItem 
                          label="Overall Score" 
                          score={interview.analysis.overallScore} 
                          isOverall 
                        />
                      </div>
                    </CardContent>
                  </Card>
                
                  <Card>
                    <CardHeader className="py-4 px-4">
                      <CardTitle className="text-base">Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 px-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Strengths</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                            {interview.analysis.strengths.map((strength, index) => (
                              <li key={index} className="text-green-600 dark:text-green-400">
                                <span className="text-foreground">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Areas for Improvement</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                            {interview.analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="text-amber-600 dark:text-amber-400">
                                <span className="text-foreground">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="py-4 px-4">
                    <CardTitle className="text-base">Hiring Manager Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <p className="text-sm">{interview.analysis.notes}</p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export Report
                  </Button>
                  <Button>
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Schedule Next Round
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Analysis not available for this interview.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="transcript" className="h-[500px]">
            {interview.transcript ? (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {interview.transcript.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{item.speaker}</span>
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      </div>
                      <p className="text-sm pl-4">{item.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Transcript not available for this interview.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Score display component
const ScoreItem = ({ 
  label, 
  score, 
  isOverall = false 
}: { 
  label: string; 
  score: number;
  isOverall?: boolean;
}) => {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${isOverall ? "font-medium" : ""}`}>{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-36 bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              score >= 85 
                ? "bg-green-600 dark:bg-green-500" 
                : score >= 70 
                ? "bg-amber-600 dark:bg-amber-500" 
                : "bg-red-600 dark:bg-red-500"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getScoreColor(score)} ${isOverall ? "text-base" : ""}`}>
          {score}%
        </span>
      </div>
    </div>
  );
};

export default InterviewDetailSection;
