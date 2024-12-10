"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const toggleVisibility = () => {
    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = (scrollTop / documentHeight) * 100;

    setScrollPercentage(scrolledPercentage);
    setIsVisible(scrollTop > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Calculate the circle's circumference and offset
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollPercentage / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-8 right-8 
        h-12 w-12 
        flex items-center justify-center 
        rounded-full 
        bg-white/80 
        shadow-lg 
        border border-gray-200
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:bg-white hover:scale-110
        focus:outline-none focus:ring-6 focus:ring-teal-800
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }
      `}
      style={{
        transform: isVisible
          ? `translateY(${Math.min(scrollPercentage * 0.1, 20)}px)`
          : "translateY(4rem)",
      }}
    >
      <div className="relative w-12 h-12">
        {/* Background circle */}
        <svg
          className="absolute top-0 left-0 -rotate-90 w-12 h-12"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="fill-none stroke-gray-200"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="fill-none stroke-teal-500 transition-all duration-300"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Arrow icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowUp
            className={`
              w-6 h-6 text-gray-700
              transition-transform duration-300
              ${scrollPercentage > 90 ? "scale-110" : "scale-100"}
            `}
          />
        </div>
      </div>
    </button>
  );
};

export default BackToTop;
