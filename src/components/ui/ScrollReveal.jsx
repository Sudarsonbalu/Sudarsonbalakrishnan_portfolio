import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  className = "",
  threshold = 0.1
}) => {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialVariant = {
    opacity: 0,
    ...directions[direction]
  };

  const animateVariant = {
    opacity: 1,
    x: 0,
    y: 0
  };

  return (
    <motion.div
      initial={initialVariant}
      whileInView={animateVariant}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Apple-like custom bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
