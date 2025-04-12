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
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in duration-300 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-primary/20 dark:border-white/10 shadow-lg">
                <DropdownMenuItem className="cursor-default opacity-70">
                  Signed in as <span className="font-semibold ml-1">alex.johnson@example.com</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                  <User className="h-4 w-4 mr-2" />Edit Profile
                 </DropdownMenuItem>
                {/*<DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                  <Calendar className="h-4 w-4 mr-2" /> My Interviews
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                  <Video className="h-4 w-4 mr-2" /> Practice
                </DropdownMenuItem>*/}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isMobile && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLogout}
                className="md:hidden border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-24 pb-16 px-4 md:px-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="my-interviews" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="mr-2 h-4 w-4" />
              My Interviews
            </TabsTrigger>
            <TabsTrigger value="interview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Video className="mr-2 h-4 w-4" />
              Interview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{profileData.name}</h3>
                      <p className="text-muted-foreground">{profileData.role}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <p className="text-sm">{profileData.email}</p>
                    <p className="text-sm">{profileData.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-sm">{profileData.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.experience.map((exp, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-l-2 border-primary pl-4"
                      >
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-l-2 border-primary pl-4"
                      >
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Profile Completion</div>
                        <div className="text-sm font-medium">{progress}%</div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="rounded-full p-3 bg-primary/20">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Interviews Completed</div>
                            <div className="text-2xl font-bold">{pastInterviews.length}</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="rounded-full p-3 bg-primary/20">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Upcoming Interviews</div>
                            <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="rounded-full p-3 bg-primary/20">
                            <BarChart className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Average Score</div>
                            <div className="text-2xl font-bold">
                              {pastInterviews.length > 0
                                ? Math.round(
                                    pastInterviews.reduce((acc, interview) => acc + (interview.score || 0), 0) /
                                    pastInterviews.length
                                  )
                                : 0}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="my-interviews" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Upcoming Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingInterviews.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingInterviews.map((interview, index) => (
                        <motion.div
                          key={interview.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex justify-between items-center p-4 border rounded-lg hover:border-primary/50 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="font-semibold">{interview.role}</div>
                            <div className="text-sm text-muted-foreground">{interview.company}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              {formatDate(interview.date)} ({interview.duration} min)
                            </div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90">Join Interview</Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming interviews scheduled.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    Past Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastInterviews.map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 border rounded-lg hover:border-primary/50 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold">{interview.role}</div>
                          <div className="text-sm text-muted-foreground">{interview.company}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {formatDate(interview.date)} ({interview.duration} min)
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">Score</div>
                            <div className="text-xl font-bold">{interview.score}%</div>
                          </div>
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            View Report
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="interview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5 text-primary" />
                    Start a New Interview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Role</label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      {interviewRoles.map((role, index) => (
                        <option key={index} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Interview Steps:</h4>
                    <ol className="space-y-3">
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex items-center"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <span>Select your desired role from the dropdown</span>
                      </motion.li>
                      
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex items-center"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" x2="12" y1="19" y2="22"/>
                          </svg>
                        </div>
                        <span>Run the system check to ensure your camera and microphone are working</span>
                      </motion.li>
                      
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex items-center"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <span>Click "Start Interview" to begin your AI interview session</span>
                      </motion.li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <Link to="/candidate/interview">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Interview
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>System Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Video className="h-4 w-4 text-green-600" />
                        </div>
                        <span>Camera</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Working</Badge>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                          </svg>
                        </div>
                        <span>Microphone</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Working</Badge>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <span>Network Connection</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Good (45ms)</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Run System Check Again
                  </Button>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 mr-2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      Tips for a Better Interview
                    </h4>
                    <ul className="text-sm space-y-2 text-blue-800 dark:text-blue-300">
                      <li>Ensure you're in a quiet environment</li>
                      <li>Use headphones for better audio quality</li>
                      <li>Position yourself in good lighting</li>
                      <li>Keep your camera at eye level</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Recent Practice Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:border-primary transition-all">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Frontend Developer Interview</div>
                          <Badge>5 days ago</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 mb-3">Practice Session (15 min)</div>
                        <div className="flex justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Score:</span> 82%
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:border-primary transition-all">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">React Developer Skills</div>
                          <Badge>1 week ago</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 mb-3">Practice Session (10 min)</div>
                        <div className="flex justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Score:</span> 78%
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-2">
                      <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                        View All Practice Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CandidateDashboard;
