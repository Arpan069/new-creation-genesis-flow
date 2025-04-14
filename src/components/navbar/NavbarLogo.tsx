
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const NavbarLogo = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/9443eed9-aca4-4c5d-b31f-11f68e84cd81.png" 
        alt="Vinte AI Interview" 
        className="h-12 w-auto"
        loading="eager"
      />
    </Link>
  );
};

export default React.memo(NavbarLogo);
