import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { AuthButtons } from '../../auth';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`backdrop-blur-md sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 shadow-lg border-b border-gray-200'
          : 'bg-white/80 shadow-sm border-b border-gray-100'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2.5 sm:py-3 md:py-4">
          {/* Logo Section - Responsive */}
          <div className="flex items-center group cursor-pointer">
            <img
              src="/lifewood-logo.png"
              alt="Lifewood Logo"
              className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Auth Buttons */}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}