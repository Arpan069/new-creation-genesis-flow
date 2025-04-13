
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CandidateDashboard = () => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(30);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedRole, setSelectedRole] = useState("");

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="w-full grid grid-cols-3 gap-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              My Interviews
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Interview
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab Content */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{profileData.name}</h3>
                    <p className="text-muted-foreground">{profileData.role}</p>
                    <p className="text-sm">{profileData.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm">{profileData.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link to="/candidate/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Experience and Education */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Experience & Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Work Experience</h3>
                    <div className="space-y-4">
                      {profileData.experience.map((exp, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4 py-1">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs">{exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Education</h3>
                    <div className="space-y-4">
                      {profileData.education.map((edu, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4 py-1">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Profile Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progress} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Complete your profile to improve your interview matches
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* My Interviews Tab Content */}
          <TabsContent value="interviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Interviews */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Interviews
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

              {/* Past Interviews Summary */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Past Interviews Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{pastInterviews.length}</div>
                      <p className="text-sm text-muted-foreground">Completed Interviews</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Average Score</h4>
                      <div className="flex items-center">
                        <Progress value={85} className="h-2 flex-1" />
                        <span className="ml-2 text-sm font-medium">85%</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => {
                      document.getElementById("past-interviews")?.scrollIntoView({ behavior: "smooth" });
                    }}>
                      View All Past Interviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Past Interviews Detail */}
              <Card className="lg:col-span-3" id="past-interviews">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Past Interview Performance
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Interview Tab Content */}
          <TabsContent value="practice" className="space-y-6">
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
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Browser compatibility</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                        Passed
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Internet speed</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                        12 Mbps
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Screen resolution</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                        Optimal
                      </Badge>
                    </div>
                    
                    <Button className="w-full">Run Full System Check</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Interview Setup */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Practice Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Select Interview Role</h3>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a role to practice" />
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
                            Choose the position you'd like to practice interviewing for
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
              
              {/* Practice Resources */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Practice Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Behavioral Questions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn how to effectively respond to questions about your work style and experiences.
                        </p>
                        <Button variant="outline" className="w-full">View Resources</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Technical Preparation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Access role-specific technical questions and coding challenges.
                        </p>
                        <Button variant="outline" className="w-full">View Resources</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Interview Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Expert advice on body language, communication skills, and interview etiquette.
                        </p>
                        <Button variant="outline" className="w-full">View Resources</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
