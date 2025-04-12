
import React, { useState } from "react";
import { motion } from "framer-motion";
import EnhancedBackground from "@/components/EnhancedBackground";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Users } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import ConfigureInterviewSection from "@/components/employer/ConfigureInterviewSection";
import InterviewsListSection from "@/components/employer/InterviewsListSection";
import InterviewDetailSection from "@/components/employer/InterviewDetailSection";
import { ThemeToggle } from "@/components/ThemeToggle";

const EmployerDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | undefined>(undefined);
  
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
        
        {/* Main content */}
        <main className="flex-1 pt-20 pb-6 px-4 md:px-6">
          <div className="container mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ConfigureInterviewSection />
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <InterviewsListSection onSelectInterview={setSelectedInterviewId} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <InterviewDetailSection interviewId={selectedInterviewId} />
              </motion.div>
            </div>
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
