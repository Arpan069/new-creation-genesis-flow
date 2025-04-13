
import React, { useState } from "react";
import { motion } from "framer-motion";
import EnhancedBackground from "@/components/EnhancedBackground";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Users, Calendar } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import ConfigureInterviewSection from "@/components/employer/ConfigureInterviewSection";
import InterviewsListSection from "@/components/employer/InterviewsListSection";
import InterviewDetailSection from "@/components/employer/InterviewDetailSection";
import JobDescriptionUploadSection from "@/components/employer/JobDescriptionUploadSection";
import CandidateMatchesSection from "@/components/employer/CandidateMatchesSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const EmployerDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | undefined>(undefined);
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/employer/login");
  };

  return (
    <EnhancedBackground intensity="medium">
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className={`fixed top-0 inset-x-0 z-40 py-3 px-4 md:px-6 ${
          theme === 'dark' 
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
            : 'bg-white/70 backdrop-blur-xl border-b border-gray-200/70'
        }`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://interviewstaging.shiksak.com/storage/customimages/ai-interviewlogo.png" 
                alt="AI Interview Logo" 
                className="h-8" 
              />
              <h1 className="text-xl font-bold hidden md:block">Employer Dashboard</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Button 
                variant={activeSection === "dashboard" ? "default" : "ghost"}
                className="text-sm"
                onClick={() => setActiveSection("dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeSection === "interviews" ? "default" : "ghost"}
                className="text-sm"
                onClick={() => setActiveSection("interviews")}
              >
                <Calendar className="mr-1 h-4 w-4" />
                Interviews
              </Button>
              <Button 
                variant={activeSection === "candidates" ? "default" : "ghost"}
                className="text-sm"
                onClick={() => setActiveSection("candidates")}
              >
                <Users className="mr-1 h-4 w-4" />
                Candidates
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <Link to="/employer/profile">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-brand-primary/30 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>EM</AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Employer</p>
                <p className="text-xs text-muted-foreground">Acme Inc.</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-100/50"
                onClick={handleLogout}
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 py-2 px-4 bg-background border-t">
          <Tabs defaultValue="dashboard" value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main content */}
        <main className="flex-1 pt-20 pb-20 md:pb-6 px-4 md:px-6">
          <div className="container mx-auto space-y-6">
            <Tabs value={activeSection} className="hidden">
              <TabsContent value="dashboard">
                {/* First row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ConfigureInterviewSection />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <JobDescriptionUploadSection />
                  </motion.div>
                </div>
                
                {/* Second row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CandidateMatchesSection />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="interviews">
                {/* Interviews tab content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1"
                  >
                    <InterviewsListSection onSelectInterview={setSelectedInterviewId} />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2"
                  >
                    <InterviewDetailSection interviewId={selectedInterviewId} />
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="candidates">
                {/* Candidates tab content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CandidateMatchesSection />
                </motion.div>
              </TabsContent>
            </Tabs>
            
            {activeSection === "dashboard" && (
              <>
                {/* First row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ConfigureInterviewSection />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <JobDescriptionUploadSection />
                  </motion.div>
                </div>
                
                {/* Second row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CandidateMatchesSection />
                </motion.div>
              </>
            )}
            
            {(activeSection === "dashboard" || activeSection === "interviews") && (
              /* Third row - Interviews */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:col-span-1"
                >
                  <InterviewsListSection onSelectInterview={setSelectedInterviewId} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="lg:col-span-2"
                >
                  <InterviewDetailSection interviewId={selectedInterviewId} />
                </motion.div>
              </div>
            )}
            
            {activeSection === "candidates" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CandidateMatchesSection />
              </motion.div>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className={`py-4 px-4 ${
          theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200'
        }`}>
          <div className="container mx-auto">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Interview - Employer Portal. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </EnhancedBackground>
  );
};

export default EmployerDashboard;
