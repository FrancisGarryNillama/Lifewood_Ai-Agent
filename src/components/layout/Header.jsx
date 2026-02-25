import React from 'react';
import { Menu, User, GraduationCap, Sparkles } from 'lucide-react';

export default function Header({ toggleSidebar, userName }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
      {/* Gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-lifewood-castletonGreen via-lifewood-saffaron to-lifewood-earthYellow"></div>

      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="group relative p-2 rounded-xl hover:bg-gradient-to-br hover:from-lifewood-paper hover:to-lifewood-seaSalt transition-all duration-300 hover:shadow-md"
          >
            <Menu className="w-6 h-6 text-gray-600 group-hover:text-lifewood-castletonGreen transition-colors" />
            {/* Animated indicator */}
            <div className="absolute inset-0 bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/lifewood-logo.png"
              alt="Lifewood Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Avatar/Icon */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>

            {/* Avatar circle */}
            <div className="relative bg-gradient-to-br from-lifewood-paper to-lifewood-seaSalt p-2 sm:p-2.5 rounded-full border-2 border-lifewood-castletonGreen/20 group-hover:border-lifewood-saffaron transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-lifewood-castletonGreen" />
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              {userName || 'Guest'}
            </span>
            {userName && (
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-lifewood-castletonGreen animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}