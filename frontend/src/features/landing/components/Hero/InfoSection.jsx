import React, { useEffect, useRef, useState } from 'react';
import { Scan, Clock, Shield } from 'lucide-react';

export default function InfoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const highlights = [
    { icon: Scan, text: 'OCR Technology', color: 'blue' },
    { icon: Clock, text: 'Faster Results', color: 'green' },
    { icon: Shield, text: 'Secure & Reliable', color: 'purple' },
  ];

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current && isVisible) {
        const rect = cardRef.current.getBoundingClientRect();
        const scrollProgress = 1 - (rect.top / window.innerHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

        // 3D transform calculations
        const rotateX = (clampedProgress - 0.5) * 10; // Tilts based on scroll position
        const translateY = (1 - clampedProgress) * 30;
        const scale = 0.9 + (clampedProgress * 0.1);

        cardRef.current.style.transform = `
          perspective(1200px) 
          rotateX(${rotateX}deg) 
          translateY(${translateY}px)
          scale(${scale})
        `;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <div
      ref={sectionRef}
      className="text-center space-y-6 sm:space-y-8"
    >
      {/* Highlight Pills with Staggered Animation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {highlights.map((item, index) => (
          <div
            key={index}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[1rem] sm:text-[1.125rem] font-semibold
              transition-all duration-700 ease-out text-lifewood-darkSerpent
              ${item.color === 'blue' ? 'bg-lifewood-seaSalt border border-lifewood-castletonGreen/20 hover:bg-lifewood-paper hover:shadow-lg' : ''}
              ${item.color === 'green' ? 'bg-lifewood-earthYellow/20 border border-lifewood-saffaron/50 hover:bg-lifewood-saffaron' : ''}
              ${item.color === 'purple' ? 'bg-lifewood-castletonGreen/10 border border-lifewood-castletonGreen/30 hover:bg-lifewood-castletonGreen/20' : ''}
              ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
              }
            `}
            style={{
              transitionDelay: `${index * 150}ms`,
            }}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            {item.text}
          </div>
        ))}
      </div>

      {/* Main Description Card with 3D Effect */}
      <div className="relative perspective-container">
        <div
          className={`absolute inset-0 bg-lifewood-castletonGreen rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl transition-all duration-1000
            ${isVisible ? 'opacity-10' : 'opacity-0'}
          `}
        ></div>

        <div
          ref={cardRef}
          className={`relative bg-lifewood-white/95 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-lifewood-saffaron/20 max-w-4xl mx-auto
            transition-all duration-1000 ease-out
            ${isVisible
              ? 'opacity-100'
              : 'opacity-0 scale-95'
            }
          `}
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Floating gradient orbs for depth */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lifewood-saffaron/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-lifewood-castletonGreen/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <p className="relative text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] text-lifewood-darkSerpent/90 leading-relaxed font-medium">
            <span className={`inline-block transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              Lifewood revolutionizes the traditional approach to business processes
              by eliminating manual steps and introducing{' '}
            </span>
            <span className={`font-bold text-lifewood-castletonGreen inline-block transition-all duration-700 delay-100 hover:scale-110 hover:text-lifewood-darkSerpent cursor-default
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
              Data Library & Intelligent Virtual Assistants
            </span>{' '}
            <span className={`inline-block transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              and intelligent assessment tools. Say goodbye to time-consuming manual
              evaluations and embrace a future of{' '}
            </span>
            <span className={`font-bold text-lifewood-saffaron inline-block transition-all duration-700 delay-300 hover:scale-110 hover:text-lifewood-earthYellow cursor-default drop-shadow-sm
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
              streamlined workflows
            </span>{' '}
            <span className={`inline-block transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              that benefit teams, stakeholders, and operations globally.
            </span>
          </p>

          {/* 3D shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

