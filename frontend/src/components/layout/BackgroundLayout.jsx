import React from 'react';

export default function BackgroundLayout({ children }) {
  return (
    <div className="min-h-screen bg-lifewood-paper/50 relative">
      {/* Warm amber top glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,179,71,0.07) 0%, transparent 65%)' }}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
