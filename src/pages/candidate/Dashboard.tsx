
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Calendar,
  User,
  Video,
  Clock,
  Award,
  CheckCircle,
  PlayCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import ThreeBackground from "@/components/ThreeBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const CandidateDashboard = () => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(30);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/candidate/login");
  };

  const profileData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Software Engineer",
    location: "San Francisco, CA",
    bio: "Experienced software engineer with a passion for building great products. Currently looking for new opportunities.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        duration: "2020 - Present",
      },
      {
        title: "Software Developer",
        company: "WebApps Co.",
        duration: "2017 - 2020",
      },
    ],
    education: [
      {
        degree: "Master of Computer Science",
        institution: "Stanford University",
        year: "2017",
      },
      {
        degree: "Bachelor of Engineering",
        institution: "MIT",
        year: "2015",
      },
    ],
  };

  const upcomingInterviews = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechCorp",
      date: "2025-04-10T14:00:00",
      duration: 60,
      status: "scheduled",
    },
    {
      id: 2,
      role: "Full Stack Engineer",
      company: "InnovateX",
      date: "2025-04-15T11:30:00",
      duration: 45,
      status: "scheduled",
    },
  ];

  const pastInterviews = [
    {
      id: 3,
      role: "React Developer",
      company: "WebSolutions",
      date: "2025-03-28T10:00:00",
      duration: 60,
      status: "completed",
      score: 85,
    },
    {
      id: 4,
      role: "JavaScript Engineer",
      company: "AppDev Inc.",
      date: "2025-03-20T15:30:00",
      duration: 45,
      status: "completed",
      score: 92,
    },
    {
      id: 5,
      role: "Frontend Specialist",
      company: "UX Masters",
      date: "2025-03-15T13:00:00",
      duration: 60,
      status: "completed",
      score: 78,
    },
  ];

  const interviewRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ThreeBackground isDarkMode={theme === "dark"} />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b dark:border-gray-800">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img 
                src="https://interviewstaging.shiksak.com/storage/customimages/ai-interviewlogo.png" 
                alt="AI Interview Logo" 
                className="h-8" 
              />
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="border-2 border-primary transition-all hover:scale-105 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in duration-300">
                <div className="p-3 border-b">
                  <p className="font-medium">{profileData.name}</p>
                  <p className="text-xs text-muted-foreground">{profileData.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/candidate/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-100 focus:text-red-600 dark:focus:bg-red-900/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-24 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm">Complete your profile to improve your matches</p>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <p className="text-sm">Basic information</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <p className="text-sm">Contact details</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2" />
                    <p className="text-sm">Resume upload</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2" />
                    <p className="text-sm">Skills assessment</p>
                  </div>
                </div>
                
                <Button className="w-full">Complete Profile</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Practice Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">Prepare for your next interview with our AI-powered practice sessions.</p>
                <div className="space-y-3">
                  {interviewRoles.slice(0, 4).map((role, index) => (
                    <Button key={index} variant="outline" className="flex items-center justify-between w-full">
                      <span>{role}</span>
                      <PlayCircle className="h-4 w-4 ml-2" />
                    </Button>
                  ))}
                </div>
                <Link to="/candidate/interview">
                  <Button className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Start Practice Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
                <TabsTrigger value="past">Past Interviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Scheduled Interviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingInterviews.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingInterviews.map((interview) => (
                          <motion.div 
                            key={interview.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border rounded-lg hover:bg-accent hover:border-accent transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{interview.role}</h3>
                                <p className="text-sm text-muted-foreground">{interview.company}</p>
                              </div>
                              <Badge>{interview.status}</Badge>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(interview.date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{interview.duration} minutes</span>
                              </div>
                            </div>
                            <div className="mt-4 flex">
                              <Button size="sm">Join Interview</Button>
                              <Button variant="outline" size="sm" className="ml-2">Reschedule</Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-1">No Scheduled Interviews</h3>
                        <p className="text-sm text-muted-foreground">
                          You don't have any upcoming interviews scheduled.
                        </p>
                        <Button className="mt-4">Browse Job Opportunities</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      Interview History & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pastInterviews.length > 0 ? (
                      <div className="space-y-4">
                        {pastInterviews.map((interview) => (
                          <motion.div 
                            key={interview.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border rounded-lg hover:bg-accent hover:border-accent transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{interview.role}</h3>
                                <p className="text-sm text-muted-foreground">{interview.company}</p>
                              </div>
                              <div className="flex items-center">
                                <Badge variant={interview.score >= 80 ? "default" : "outline"}>
                                  {interview.score}%
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(interview.date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{interview.duration} minutes</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="text-sm mb-1 flex justify-between">
                                <span>Performance</span>
                                <span className={interview.score >= 80 ? "text-green-600" : "text-amber-600"}>
                                  {interview.score >= 90 ? "Excellent" : 
                                   interview.score >= 80 ? "Good" : 
                                   interview.score >= 70 ? "Average" : "Needs Improvement"}
                                </span>
                              </div>
                              <Progress 
                                value={interview.score} 
                                className="h-2"
                                style={{
                                  background: 'var(--background-muted)',
                                }}
                              />
                            </div>
                            <div className="mt-4">
                              <Button size="sm" variant="outline">
                                <Video className="h-4 w-4 mr-1" />
                                View Recording
                              </Button>
                              <Button size="sm" variant="outline" className="ml-2">
                                <Award className="h-4 w-4 mr-1" />
                                See Feedback
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-1">No Past Interviews</h3>
                        <p className="text-sm text-muted-foreground">
                          You haven't completed any interviews yet.
                        </p>
                        <Button className="mt-4">Practice Interview</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Work className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We're working on analyzing your profile and interviews to recommend the perfect job opportunities for you.
                  </p>
                  <Button className="mt-4" variant="outline">Update Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Missing Work icon component
const Work = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
};

export default CandidateDashboard;
