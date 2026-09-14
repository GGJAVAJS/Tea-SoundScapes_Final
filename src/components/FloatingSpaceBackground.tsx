import React from 'react';
import { motion } from 'motion/react';

export const FloatingSpaceBackground = React.memo(({ showImages = true }: { showImages?: boolean }) => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden" 
      style={{ width: '100vw', height: '100vh' }}
    >
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, var(--color-aurora-cyan), var(--color-aurora-teal), transparent, var(--color-aurora-cyan))',
          willChange: 'transform'
        }}
      />
      
      {/* Floating 2D Space Images */}
      {showImages && (
        <div className="absolute inset-0 w-full max-w-lg mx-auto h-full pointer-events-none">
        
        {/* Big Planet - Massive backdrop anchoring the bottom right. Only floating. */}
        <motion.img 
          src="/themes/space/planet-big.png" 
          alt="" 
          className="absolute bottom-[-10%] right-[-30%] w-[32rem] opacity-30 z-0"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet 2 (Ringed) - Top left area. Only floating. */}
        <motion.img 
          src="/themes/space/planet2.png" 
          alt="Planet 2" 
          className="absolute top-[2%] left-[10%] w-36 opacity-70 z-0"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Meteor - Moved to where Planet 2 was (Top Left) */}
        <motion.img 
          src="/themes/space/meteor.png" 
          alt="Meteor" 
          className="absolute top-[10%] left-[-5%] w-16 opacity-80 z-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Moon - Orbiting near the satellite, slightly above the rocket (Middle-Right). Only floating. */}
        <motion.img 
          src="/themes/space/moon.png" 
          alt="Moon" 
          className="absolute top-[35%] right-[15%] w-16 opacity-80 z-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet 1 - Bottom left secondary planet. Only floating. */}
        <motion.img 
          src="/themes/space/planet.png" 
          alt="Planet" 
          className="absolute bottom-[10%] left-[-10%] w-40 opacity-70 z-0"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Satellite - Top right corner framing */}
        <motion.img 
          src="/themes/space/satellite.png" 
          alt="" 
          className="absolute top-[12%] right-[5%] w-24 opacity-80 z-10"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Rocket - Lower right flying upward */}
        <motion.img 
          src="/themes/space/rocekt.png" 
          alt="Rocket" 
          className="absolute bottom-[25%] right-[5%] w-28 opacity-90 z-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Asteroid 1 - Mid Right */}
        <motion.img 
          src="/themes/space/asteroide.png" 
          alt="" 
          className="absolute top-[55%] left-[8%] w-20 opacity-60 z-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Asteroid 2 - Bottom Center */}
        <motion.img 
          src="/themes/space/asteroide2.png" 
          alt="" 
          className="absolute bottom-[15%] left-[30%] w-14 opacity-50 z-10"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ willChange: 'transform' }}
        />

        {/* Estrela Cadente (Shooting Star) - Adjusted to cross more through the middle */}
        <motion.img 
          src="/themes/space/estrela_cadente.png" 
          alt="Shooting Star" 
          className="absolute top-0 right-0 w-40 opacity-50 z-0"
          animate={{ 
            x: ['30vw', '-80vw'],
            y: ['-20vh', '100vh'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 3 }}
          style={{ willChange: 'transform' }}
        />
      </div>
      )}
    </div>
  );
});