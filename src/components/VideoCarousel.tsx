
import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const carouselData = [
  {
    id: 1,
    title: "Mock Interview For Software Engineering",
    thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "How To Ace Your Data Science Interview",
    thumbnail: "https://images.unsplash.com/photo-1558746204-8f5be0fce8b3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Product Management Interview Tips",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "UI/UX Design Interview Best Practices",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Machine Learning Interview Questions",
    thumbnail: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?q=80&w=2074&auto=format&fit=crop"
  },
];

const VideoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
  };

  // Auto advance carousel with reduced frequency
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000); // Change slide every 8 seconds (reduced from 5 seconds)
    
    return () => clearInterval(interval);
  }, []);

  // Animation when component comes into view
  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }
  }, [controls, isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="relative w-full max-w-5xl mx-auto mt-20 mb-24 overflow-hidden rounded-2xl shadow-xl"
    >
      <div className="relative h-[400px] md:h-[500px] bg-brand-primary/5">
        {/* Simplified decorative elements */}
        <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full ${isDark ? 'bg-brand-secondary/10' : 'bg-brand-secondary/20'} blur-3xl`}></div>
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${isDark ? 'bg-brand-primary/10' : 'bg-brand-primary/20'} blur-3xl`}></div>
        
        <motion.div 
          ref={carouselRef}
          className="flex h-full"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {carouselData.map((item, index) => (
            <div key={item.id} className="relative min-w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>
              
              <img 
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">{item.title}</h2>
                  <Button className="bg-brand-secondary text-brand-primary hover:bg-brand-secondary/90">
                    Learn More
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/30 rounded-full z-30 border-white/20 text-white shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/30 rounded-full z-30 border-white/20 text-white shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === activeIndex ? "bg-brand-secondary w-8" : "bg-white/50 w-2"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </motion.div>
  );
};

export default VideoCarousel;
