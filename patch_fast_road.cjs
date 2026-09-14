const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const regex = /const CarsPanicBackground = \(\) => \{[\s\S]*?\}\);\n\};/g;

const newCarsBlock = `const CarsPanicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-[#02040a] overflow-hidden">
      
      {/* 1. Surreal Scenery: Giant Geometric Blobs & Rings (Slightly faster) */}
      <div className="absolute inset-0 opacity-60 blur-[100px]">
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[0%] left-[10%] w-[50vw] h-[50vw] bg-[#0c1844] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 0.9, 1], x: [0, -100, 80, 0], y: [0, 100, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-[#1a0b2e] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1.6, 1], x: [0, 60, -90, 0], y: [0, 40, 90, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[30%] w-[60vw] h-[60vw] bg-[#05112e] rounded-full mix-blend-screen"
        />
      </div>

      {/* Abstract Floating Arcs/Rings for Endel vibe */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute w-[140vw] h-[140vw] border-[1px] border-white/20 rounded-full border-t-transparent border-l-transparent"
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute w-[180vw] h-[180vw] border-[2px] border-[#38bdf8]/10 rounded-full border-b-transparent"
        />
      </div>

      {/* Solid base to prevent seam below the road */}
      <div className="absolute bottom-0 left-0 right-0 h-[25vh] bg-[#02040a]" />

      {/* 2. The High-Speed Road */}
      <div className="absolute inset-x-0 bottom-[25vh] h-[20vh] flex flex-col justify-end overflow-hidden">
        
        {/* Parallax Mountains / Tech Skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-[15vh] opacity-30">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-[200%] h-full flex items-end"
          >
            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full fill-[#1a2345]">
               <path d="M0,100 L0,50 L50,30 L100,60 L150,20 L200,80 L250,40 L300,70 L400,20 L450,50 L500,10 L550,60 L600,100 Z M600,100 L600,50 L650,30 L700,60 L750,20 L800,80 L850,40 L900,70 L1000,20 L1050,50 L1100,10 L1150,60 L1200,100 Z" />
            </svg>
          </motion.div>
        </div>

        {/* The Road Surface */}
        <div className="relative w-full h-[6vh] bg-[#060a1f] border-t border-white/20 z-10 overflow-hidden flex items-center">
          {/* Lane Dashes */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="w-[200%] h-[3px] flex"
          >
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.3) 40%, transparent 40%)', backgroundSize: '120px 100%' }} />
          </motion.div>
        </div>
      </div>

      {/* 3. The Moving Car */}
      <div className="absolute bottom-[27vh] left-[50%] -translate-x-1/2 md:left-[25%] w-[160px] md:w-[220px] z-20">
        {/* Faster Chassis Bobbing */}
        <motion.div
          animate={{ y: [-2, 2, -2], rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 80" className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            {/* Car Chassis (Minimal Silhouette) */}
            <path d="M 25 55 L 20 50 L 20 35 C 20 20 35 15 55 15 L 110 15 C 130 15 150 20 165 30 L 180 35 C 185 36 190 40 190 45 L 190 55 L 25 55 Z" 
                  className="fill-[#08102e] stroke-white/20" strokeWidth="1.5" />
            
            {/* Windows */}
            <path d="M 55 18 L 105 18 C 120 18 135 22 145 28 L 105 28 L 55 28 L 45 28 C 35 28 30 24 25 18 L 55 18 Z" 
                  className="fill-white/5 stroke-white/10" strokeWidth="1" />
            
            {/* Wheel Wells cutouts */}
            <path d="M 30 55 A 15 15 0 0 1 60 55" className="fill-transparent stroke-white/20" strokeWidth="1.5" />
            <path d="M 140 55 A 15 15 0 0 1 170 55" className="fill-transparent stroke-white/20" strokeWidth="1.5" />

            {/* Back Wheel - Faster Spin! */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "45px 55px" }}>
              <circle cx="45" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
              <circle cx="45" cy="55" r="3" className="fill-white/40" />
              <line x1="45" y1="43" x2="45" y2="67" className="stroke-white/10" strokeWidth="1" />
              <line x1="33" y1="55" x2="57" y2="55" className="stroke-white/10" strokeWidth="1" />
            </motion.g>
            
            {/* Front Wheel - Faster Spin! */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "155px 55px" }}>
              <circle cx="155" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
              <circle cx="155" cy="55" r="3" className="fill-white/40" />
              <line x1="155" y1="43" x2="155" y2="67" className="stroke-white/10" strokeWidth="1" />
              <line x1="143" y1="55" x2="167" y2="55" className="stroke-white/10" strokeWidth="1" />
            </motion.g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};`;

code = code.replace(regex, newCarsBlock);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Replaced");
