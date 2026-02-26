import React from 'react';
import { GraduationCap, Github, Mail } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Logo Section */}
          <div className="flex items-center justify-center sm:justify-start">
            <img
              src="/assets/images/lifewood-logo.png"
              alt="Lifewood Logo"
              className="h-8 sm:h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Links - Centered */}
          <div className="flex justify-center space-x-6 order-last sm:order-none">
            <button className="text-gray-400 hover:text-lifewood-castletonGreen transition-colors p-2" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-lifewood-castletonGreen transition-colors p-2" aria-label="Email">
              <Mail className="h-5 w-5" />
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} Lifewood. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}