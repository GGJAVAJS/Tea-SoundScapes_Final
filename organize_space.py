import re

with open('src/components/FloatingSpaceBackground.tsx', 'r') as f:
    content = f.read()

start_idx = content.find("{/* Floating 2D Space Images */}")
if start_idx != -1:
    new_block = """{/* Floating 2D Space Images */}
      {showImages && (
        <div className="absolute inset-0 w-full max-w-lg mx-auto h-full pointer-events-none">
        
        {/* Big Planet - Massive backdrop anchoring the bottom right */}
        <motion.img 
          src="/planet-big.png" 
          alt="" 
          className="absolute bottom-[-10%] right-[-30%] w-[32rem] opacity-30 z-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet 2 (Ringed) - Top left focal point */}
        <motion.img 
          src="/planet2.png" 
          alt="Planet 2" 
          className="absolute top-[8%] left-[-5%] w-36 opacity-70 z-0"
          animate={{ 
            y: [0, -10, 0],
            rotate: 360
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />

        {/* Moon - Orbiting near the top left planet */}
        <motion.img 
          src="/moon.png" 
          alt="Moon" 
          className="absolute top-[20%] left-[12%] w-16 opacity-80 z-0"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Planet 1 - Bottom left secondary planet */}
        <motion.img 
          src="/planet.png" 
          alt="Planet" 
          className="absolute bottom-[10%] left-[-10%] w-40 opacity-70 z-0"
          animate={{ 
            rotate: -360
          }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        />

        {/* Satellite - Top right corner framing */}
        <motion.img 
          src="/satellite.png" 
          alt="" 
          className="absolute top-[12%] right-[5%] w-24 opacity-80 z-10"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Meteor - Falling diagonally towards the center */}
        <motion.img 
          src="/meteor.png" 
          alt="Meteor" 
          className="absolute top-[28%] left-[25%] w-16 opacity-60 z-10"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: 'transform' }}
        />

        {/* Rocket - Lower right flying upward */}
        <motion.img 
          src="/rocekt.png" 
          alt="Rocket" 
          className="absolute bottom-[25%] right-[10%] w-28 opacity-90 z-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />

        {/* Asteroid 1 - Mid Right */}
        <motion.img 
          src="/asteroide.png" 
          alt="" 
          className="absolute top-[45%] right-[-5%] w-20 opacity-60 z-10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />

        {/* Asteroid 2 - Bottom Center */}
        <motion.img 
          src="/asteroide2.png" 
          alt="" 
          className="absolute bottom-[15%] left-[30%] w-14 opacity-50 z-10"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ willChange: 'transform' }}
        />

        {/* Estrela Cadente (Shooting Star) */}
        <motion.img 
          src="/estrela_cadente.png" 
          alt="Shooting Star" 
          className="absolute top-0 right-[-20%] w-40 opacity-50 z-0"
          animate={{ 
            x: ['100vw', '-100vw'],
            y: ['-50vh', '150vh'],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 4 }}
          style={{ willChange: 'transform' }}
        />
      </div>
      )}
    </div>
  );
});"""

    content = content[:start_idx] + new_block
    with open('src/components/FloatingSpaceBackground.tsx', 'w') as f:
        f.write(content)
    print("Reorganized Space Layout")
