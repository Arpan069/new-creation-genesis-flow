
import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import HeroSection from "@/components/home/HeroSection";

const Index = () => {
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Function to scroll to testimonials section
  const scrollToTestimonials = () => {
    testimonialRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      <main className="flex-grow flex flex-col relative z-10">
        <div className="container mx-auto">
          <HeroSection />
        </div>
        
        {/* Testimonial Section */}
        <div ref={testimonialRef} id="testimonials">
          <TestimonialCarousel />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
