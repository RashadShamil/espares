'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageMagnifier({ src, alt }: { src: string; alt: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    
    setPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  return (
    <div 
      className="relative w-full h-full cursor-crosshair overflow-hidden rounded-xl bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        className="object-contain p-4"
        priority
      />

      {/* The Magnifying Glass Overlay */}
      {showMagnifier && (
        <div 
          className="absolute pointer-events-none border border-gray-200 bg-white shadow-2xl rounded-full w-32 h-32 z-50 hidden lg:block"
          style={{
            left: `${cursorPosition.x - 64}px`,
            top: `${cursorPosition.y - 64}px`,
            backgroundImage: `url('${src}')`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '300%', // Zoom level
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
      
      {/* Mobile Hint */}
      <div className="absolute bottom-4 right-4 bg-black/5 text-gray-400 text-xs px-2 py-1 rounded-md lg:hidden">
        Tap to zoom
      </div>
    </div>
  );
}