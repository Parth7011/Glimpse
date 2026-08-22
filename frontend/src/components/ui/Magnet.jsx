import React, { useState, useRef, useEffect } from 'react';

export function Magnet({ children, padding = 150, strength = 3, className = '' }) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;
      
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Check if mouse is within padding area
      if (
        e.clientX >= left - padding &&
        e.clientX <= left + width + padding &&
        e.clientY >= top - padding &&
        e.clientY <= top + height + padding
      ) {
        setIsActive(true);
        setPosition({
          x: distX / strength,
          y: distY / strength
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength]);

  return (
    <div
      ref={magnetRef}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}
