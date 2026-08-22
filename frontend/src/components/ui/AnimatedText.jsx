import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Word({ children, progress, range }) {
  const amount = range[1] - range[0];
  const step = amount / children.length;
  return (
    <span className="relative mr-1.5 mt-1">
      {children.split("").map((char, i) => {
        const start = range[0] + (i * step);
        const end = range[0] + (step * (i + 1));
        return (
          <Character key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Character>
        );
      })}
    </span>
  );
}

function Character({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export function AnimatedText({ text, className = "" }) {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(" ");

  return (
    <p ref={element} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={`w_${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}
