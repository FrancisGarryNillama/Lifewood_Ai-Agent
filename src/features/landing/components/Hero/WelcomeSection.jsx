import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export default function WelcomeSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative text-center mb-6 sm:mb-8 px-2">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-lifewood-saffaron/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-lifewood-castletonGreen/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-lifewood-earthYellow/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-lifewood-castletonGreen/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Badge */}
        <div
          className={`inline-flex items-center bg-lifewood-seaSalt 
            text-lifewood-darkSerpent px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold 
            mb-4 sm:mb-6 md:mb-8 border border-lifewood-castletonGreen/30 shadow-lg 
            backdrop-blur-sm hover:shadow-xl transition-all duration-500 cursor-pointer group
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}
        >
          <div className="relative flex items-center">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-lifewood-saffaron group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative text-lifewood-darkSerpent">
              Welcome to Lifewood Document Assistant
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lifewood-saffaron opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lifewood-earthYellow"></span>
              </span>
            </span>
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 text-lifewood-saffaron group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Enhanced Title - Display Scale */}
        <h1
          className={`text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-bold text-lifewood-darkSerpent mb-4 sm:mb-6 leading-thight
            transition-all duration-1000 delay-100
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <span className="block mb-2 text-[2rem] sm:text-[2.5rem] md:text-[3rem]">Empowering Flow with</span>
          <span className="relative inline-block mt-4">
            <span className="text-lifewood-castletonGreen">
              Intelligence
            </span>
            {/* Underline decoration */}
            <div className="absolute -bottom-2 left-0 right-0 h-2 bg-lifewood-saffaron rounded-full
              transform origin-left transition-transform duration-1000 delay-500"
              style={{
                transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
              }}
            ></div>
            {/* Sparkle decoration */}
            <TrendingUp className="absolute -top-4 -right-8 sm:-right-12 h-6 w-6 sm:h-8 sm:w-8 text-lifewood-saffaron opacity-90
              animate-bounce hidden sm:block"
              style={{ animationDelay: '1s' }}
            />
          </span>
        </h1>

        {/* Enhanced Subtitle - Headline Scale (1/2 Display) */}
        <p
          className={`text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-lifewood-darkSerpent/80 font-medium max-w-4xl mx-auto px-2 mt-8
            leading-relaxed transition-all duration-1000 delay-300
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          Evaluating employee documents with{' '}
          <span className="relative inline-block">
            <span className="text-lifewood-castletonGreen font-semibold">
              always on
            </span>
            <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
              <path d="M0,2 Q25,0 50,2 T100,2" stroke="#ffb347" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span> capabilities.
        </p>

        {/* Stats or Features Preview - Body Scale (1/2 Headline) */}
        <div
          className={`mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8
            transition-all duration-1000 delay-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {[
            { label: 'Proactive', value: '24/7', icon: '🔋' },
            { label: 'Transformative', value: '10x', icon: '🚀' },
            { label: 'Adaptable', value: 'Global', icon: '🌍' },
          ].map((stat, i) => (
            <div
              key={i}
              className="group relative bg-lifewood-white px-4 sm:px-6 py-4 rounded-2xl border border-lifewood-castletonGreen/20 
                shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default min-w-[160px]"
            >
              <div className="text-[1.5rem] font-bold text-lifewood-castletonGreen
                group-hover:scale-110 group-hover:text-lifewood-saffaron transition-all duration-300 inline-block">
                {stat.value}
              </div>
              <div className="text-[1rem] text-lifewood-darkSerpent/80 font-medium mt-2 flex items-center justify-center gap-2">
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS to make the gradient animation work
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}