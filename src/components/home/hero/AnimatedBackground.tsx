
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number };
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ mousePosition }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle parallax effect based on mouse position
  useEffect(() => {
    const handleMouseMove = () => {
      if (!containerRef.current) return;
      
      const elements = containerRef.current.querySelectorAll(".parallax-element");
      
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = Number(htmlEl.dataset.speed) || 0;
        const x = (mousePosition.x - window.innerWidth / 2) * speed;
        const y = (mousePosition.y - window.innerHeight / 2) * speed;
        
        htmlEl.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    
    handleMouseMove();
  }, [mousePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full z-0">
      <div className="absolute inset-0 z-0">
        {/* Gradient background */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-zinc-900 via-slate-900 to-black'
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}></div>
        
        {/* Grid overlay */}
        <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'bg-grid-white/10' : 'bg-grid-black/5'}`}></div>
      </div>
      
      {/* Floating elements */}
      <motion.div
        className="parallax-element absolute top-[10%] left-[15%] w-72 h-72 rounded-full opacity-20 blur-3xl bg-primary/30"
        data-speed="-0.01"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="parallax-element absolute top-[30%] right-[25%] w-64 h-64 rounded-full opacity-10 blur-3xl bg-blue-500/30"
        data-speed="0.02"
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="parallax-element absolute bottom-[20%] left-[25%] w-80 h-80 rounded-full opacity-10 blur-3xl bg-purple-500/30"
        data-speed="0.015"
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Regular style tag without the jsx property */}
      <style>
        {`.bg-grid-white {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .bg-grid-black {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }`}
      </style>
    </div>
  );
};

export default AnimatedBackground;
