import React from 'react';
import { motion } from 'motion/react';

export const DinoProfileBackground = React.memo(() => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'
      }}
    >
      <div className="absolute inset-0 w-full max-w-md mx-auto">
        {/* Clouds */}
        <motion.img src="/cloud.png" alt="" className="absolute -top-4 -left-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" alt="" className="absolute -top-2 left-[20%] w-32 opacity-90" animate={{ y: [0, -8, 0], x: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" alt="" className="absolute top-0 left-[40%] w-32 opacity-90" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" alt="" className="absolute -top-2 right-[15%] w-32 opacity-90" animate={{ y: [0, -7, 0], x: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" alt="" className="absolute -top-4 -right-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ willChange: 'transform' }} />

        {/* Fossils */}
        <motion.img src="/fossil.png" alt="" className="absolute top-24 left-4 w-24 opacity-90" animate={{ y: [0, -10, 0], rotate: [-20, -15, -20] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/fossil_rex.png" alt="" className="absolute top-[35%] right-2 w-28 opacity-90" animate={{ y: [0, -15, 0], rotate: [10, 15, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />

        {/* Character dino_fofo */}
        <motion.img src="/dino_fofo.png" alt="" className="absolute bottom-24 left-[-10px] w-32 z-10" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
      </div>
    </div>
  );
});
