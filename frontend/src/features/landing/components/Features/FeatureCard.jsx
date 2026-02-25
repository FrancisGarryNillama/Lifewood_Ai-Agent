import React, { useRef, useState } from 'react';

export default function FeatureCard({ icon: Icon, title, description, color = 'blue', index = 0 }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const colorClasses = {
    blue: 'bg-lifewood-seaSalt text-lifewood-castletonGreen group-hover:bg-lifewood-castletonGreen group-hover:text-lifewood-white',
    green: 'bg-lifewood-saffaron/20 text-lifewood-saffaron group-hover:bg-lifewood-saffaron group-hover:text-lifewood-darkSerpent',
    purple: 'bg-lifewood-darkSerpent/10 text-lifewood-darkSerpent group-hover:bg-lifewood-darkSerpent group-hover:text-lifewood-white',
  };

  const titleColors = {
    blue: 'group-hover:text-lifewood-castletonGreen',
    green: 'group-hover:text-lifewood-saffaron',
    purple: 'group-hover:text-lifewood-darkSerpent',
  };

  const glowColors = {
    blue: 'group-hover:shadow-lifewood-castletonGreen/30',
    green: 'group-hover:shadow-lifewood-saffaron/30',
    purple: 'group-hover:shadow-lifewood-darkSerpent/30',
  };

  // 3D Tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    );
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 
        transition-all duration-500 ease-out cursor-pointer
        hover:shadow-2xl hover:border-gray-200 ${glowColors[color]}
      `}
      style={{
        transform: transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500
        ${color === 'blue' ? 'bg-gradient-to-br from-lifewood-saffaron to-blue-600' : ''}
        ${color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : ''}
        ${color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-lifewood-earthYellow' : ''}
      `}></div>

      {/* Card content with 3D layering */}
      <div className="relative" style={{ transform: 'translateZ(50px)' }}>
        {/* Icon with enhanced animation */}
        <div
          className={`${colorClasses[color]} w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl 
            flex items-center justify-center mx-auto mb-4 sm:mb-5 
            transition-all duration-500 transform
            group-hover:scale-110 group-hover:rotate-6
            shadow-lg group-hover:shadow-xl
          `}
          style={{
            transform: 'translateZ(30px)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        {/* Title */}
        <h3
          className={`text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 ${titleColors[color]} 
            transition-colors duration-300 text-center
          `}
          style={{ transform: 'translateZ(20px)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center"
          style={{ transform: 'translateZ(10px)' }}
        >
          {description}
        </p>
      </div>

      {/* Shine effect overlay */}
      <div
        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 
          bg-gradient-to-tr from-transparent via-white/20 to-transparent 
          transition-opacity duration-500 pointer-events-none"
        style={{ transform: 'translateZ(60px)' }}
      ></div>

      {/* Floating decorative element */}
      <div
        className={`absolute -top-2 -right-2 w-8 h-8 rounded-full blur-xl opacity-0 group-hover:opacity-30 
          transition-all duration-700 animate-pulse
          ${color === 'blue' ? 'bg-lifewood-castletonGreen' : ''}
          ${color === 'green' ? 'bg-green-500' : ''}
          ${color === 'purple' ? 'bg-lifewood-saffaron' : ''}
        `}
        style={{
          animationDelay: `${index * 0.2}s`,
        }}
      ></div>
    </div>
  );
}