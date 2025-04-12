
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const NavbarLogo = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="https://interviewstaging.shiksak.com/storage/customimages/ai-interviewlogo.png" 
        alt="Aura Interview AI" 
        className="h-9 w-auto mr-2"
      />
      <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Aura AI
      </span>
    </Link>
  );
};

export default NavbarLogo;
