
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import AnimatedBackground from "./hero/AnimatedBackground";
import HeroContent from "./hero/HeroContent";
import HeroIllustration from "./hero/HeroIllustration";

const HeroSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center z-20" ref={ref}>
      <AnimatedBackground mousePosition={mousePosition} />
      
      <motion.div
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="container mx-auto px-4 relative z-20 pt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <HeroContent itemVariants={itemVariants} />
          <HeroIllustration itemVariants={itemVariants} />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
