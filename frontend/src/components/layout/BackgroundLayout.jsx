import React from 'react';

export default function BackgroundLayout({ children, blur = true }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      {blur && (
        <div 
          //className="absolute inset-0 bg-[url('./citBackground.png')] bg-cover bg-center blur-[12px] opacity-80 z-[-1]" 
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lifewood-paper/50 via-white/30 to-lifewood-seaSalt/50 z-[-1]" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}