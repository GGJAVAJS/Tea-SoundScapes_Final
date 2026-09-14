import React from 'react';
import { motion } from 'motion/react';

export const FloatingCarsBackground = React.memo(({ showImages = true }: { showImages?: boolean }) => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'transparent'
      }}
    >
      {showImages && (
        <div className="absolute inset-0 w-full max-w-md mx-auto">
        
        {/* Top Left: Checkered Flag */}
        <motion.img 
          src="/bandeira_corrida.png" 
          alt="" 
          className="absolute top-[8%] -left-6 w-32 opacity-90" 
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          style={{ willChange: 'transform' }} 
        />
        
        {/* Top Right: Checkered Flag (Flipped) */}
        <motion.img 
          src="/bandeira_corrida.png" 
          alt="" 
          className="absolute top-[8%] -right-6 w-32 opacity-90 scale-x-[-1]" 
          animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Top Center: Finish Line */}
        <motion.img 
          src="/chegada.png" 
          alt="" 
          className="absolute top-[5%] left-[50%] -translate-x-[50%] w-36 opacity-90" 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Mid Left: F1 Car */}
        <motion.img 
          src="/carro.png" 
          alt="" 
          className="absolute top-[40%] -left-8 w-44 opacity-95" 
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [-5, 0, -5] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Mid Right: Stopwatch */}
        <motion.img 
          src="/cronometro.png" 
          alt="" 
          className="absolute top-[45%] -right-8 w-36 opacity-95" 
          animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Bottom Center: Driver */}
        <motion.img 
          src="/piloto.png" 
          alt="" 
          className="absolute bottom-[10%] left-[50%] -translate-x-[50%] w-36 opacity-100 z-10" 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Bottom Left: Triple Cones */}
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[2%] -left-20 w-32 opacity-80 z-10" 
          animate={{ y: [0, -4, 0], rotate: [-8, -2, -8] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} 
          style={{ willChange: 'transform' }} 
        />
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[8%] left-4 w-32 opacity-90 z-10" 
          animate={{ y: [0, -6, 0], rotate: [-2, 4, -2] }} 
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} 
          style={{ willChange: 'transform' }} 
        />
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[4%] -left-6 w-40 opacity-100 z-20" 
          animate={{ y: [0, -5, 0], rotate: [-5, 0, -5] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
          style={{ willChange: 'transform' }} 
        />

        {/* Bottom Right: Triple Cones */}
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[2%] -right-20 w-32 opacity-80 z-10 scale-x-[-1]" 
          animate={{ y: [0, -5, 0], rotate: [8, 2, 8] }} 
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} 
          style={{ willChange: 'transform' }} 
        />
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[8%] right-4 w-32 opacity-90 z-10 scale-x-[-1]" 
          animate={{ y: [0, -7, 0], rotate: [2, -4, 2] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} 
          style={{ willChange: 'transform' }} 
        />
        <motion.img 
          src="/cone.png" 
          alt="" 
          className="absolute bottom-[4%] -right-6 w-40 opacity-100 z-20 scale-x-[-1]" 
          animate={{ y: [0, -8, 0], rotate: [5, 0, 5] }} 
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          style={{ willChange: 'transform' }} 
        />

      </div>
      )}
    </div>
  );
});
