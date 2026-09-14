const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// The original section we want to replace starts with "{/* 2. Undulating Road (Sea of Asphalt) */}"
// and ends right before "</div>\n    </div>\n  );\n};" which is the end of the CarsPanicBackground component.

// Using standard replace for the entire Road + Car block
const oldRoadAndCar = `{/* 2. Undulating Road (Sea of Asphalt) */}
      
      {/* Deep Background Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-[45vh] opacity-50">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%] h-full flex items-end"
        >
          <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#05091a]">
            <path d="M 0 150 C 300 250, 300 50, 600 150 C 900 250, 900 50, 1200 150 C 1500 250, 1500 50, 1800 150 C 2100 250, 2100 50, 2400 150 L 2400 400 L 0 400 Z" />
          </svg>
        </motion.div>
      </div>

      {/* Midground Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-[35vh] opacity-70">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%] h-full flex items-end"
        >
          <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#070d24]">
            <path d="M 0 200 C 300 100, 300 300, 600 200 C 900 100, 900 300, 1200 200 C 1500 100, 1500 300, 1800 200 C 2100 100, 2100 300, 2400 200 L 2400 400 L 0 400 Z" />
          </svg>
        </motion.div>
      </div>

      {/* Foreground Wave (The Road) */}
      <div className="absolute bottom-0 left-0 right-0 h-[25vh]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%] h-full flex items-end"
        >
          <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#040612] stroke-white/10" strokeWidth="2">
            <path d="M 0 250 C 300 320, 300 180, 600 250 C 900 320, 900 180, 1200 250 C 1500 320, 1500 180, 1800 250 C 2100 320, 2100 180, 2400 250 L 2400 400 L 0 400 Z" />
          </svg>
        </motion.div>
      </div>

      {/* 3. The Moving Car */}
      <div className="absolute bottom-[10vh] left-[50%] -translate-x-1/2 md:left-[25%] w-[160px] md:w-[220px]">
        {/* Chassis Bobbing */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-1, 2, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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

            {/* Back Wheel */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "45px 55px" }}>
              <circle cx="45" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
              <circle cx="45" cy="55" r="3" className="fill-white/40" />
              <line x1="45" y1="43" x2="45" y2="67" className="stroke-white/10" strokeWidth="1" />
              <line x1="33" y1="55" x2="57" y2="55" className="stroke-white/10" strokeWidth="1" />
            </motion.g>
            
            {/* Front Wheel */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "155px 55px" }}>
              <circle cx="155" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
              <circle cx="155" cy="55" r="3" className="fill-white/40" />
              <line x1="155" y1="43" x2="155" y2="67" className="stroke-white/10" strokeWidth="1" />
              <line x1="143" y1="55" x2="167" y2="55" className="stroke-white/10" strokeWidth="1" />
            </motion.g>
          </svg>
        </motion.div>
      </div>`;

const newRoadAndCar = `{/* Solid base to prevent seam below the raised waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[25vh] bg-[#040612]" />

      {/* Container for Road and Car shifted up to the center */}
      <div className="absolute inset-x-0 bottom-[25vh]">
        {/* 2. Undulating Road (Sea of Asphalt) */}
        
        {/* Deep Background Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-[45vh] opacity-50">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 w-[200%] h-full flex items-end"
          >
            <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#05091a]">
              <path d="M 0 150 C 300 250, 300 50, 600 150 C 900 250, 900 50, 1200 150 C 1500 250, 1500 50, 1800 150 C 2100 250, 2100 50, 2400 150 L 2400 400 L 0 400 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Midground Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] opacity-70">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 w-[200%] h-full flex items-end"
          >
            <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#070d24]">
              <path d="M 0 200 C 300 100, 300 300, 600 200 C 900 100, 900 300, 1200 200 C 1500 100, 1500 300, 1800 200 C 2100 100, 2100 300, 2400 200 L 2400 400 L 0 400 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Foreground Wave (The Road) */}
        <div className="absolute bottom-0 left-0 right-0 h-[25vh]">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 w-[200%] h-full flex items-end"
          >
            <svg viewBox="0 0 2400 400" preserveAspectRatio="none" className="w-full h-full fill-[#040612] stroke-white/10" strokeWidth="2">
              <path d="M 0 250 C 300 320, 300 180, 600 250 C 900 320, 900 180, 1200 250 C 1500 320, 1500 180, 1800 250 C 2100 320, 2100 180, 2400 250 L 2400 400 L 0 400 Z" />
            </svg>
          </motion.div>
        </div>

        {/* 3. The Moving Car */}
        <div className="absolute bottom-[10vh] left-[50%] -translate-x-1/2 md:left-[25%] w-[160px] md:w-[220px]">
          {/* Chassis Bobbing */}
          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [-1, 2, -1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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

              {/* Back Wheel */}
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "45px 55px" }}>
                <circle cx="45" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
                <circle cx="45" cy="55" r="3" className="fill-white/40" />
                <line x1="45" y1="43" x2="45" y2="67" className="stroke-white/10" strokeWidth="1" />
                <line x1="33" y1="55" x2="57" y2="55" className="stroke-white/10" strokeWidth="1" />
              </motion.g>
              
              {/* Front Wheel */}
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "155px 55px" }}>
                <circle cx="155" cy="55" r="12" className="fill-[#02040a] stroke-white/30" strokeWidth="1.5" />
                <circle cx="155" cy="55" r="3" className="fill-white/40" />
                <line x1="155" y1="43" x2="155" y2="67" className="stroke-white/10" strokeWidth="1" />
                <line x1="143" y1="55" x2="167" y2="55" className="stroke-white/10" strokeWidth="1" />
              </motion.g>
            </svg>
          </motion.div>
        </div>
      </div>`;

if (code.includes(oldRoadAndCar)) {
    code = code.replace(oldRoadAndCar, newRoadAndCar);
    fs.writeFileSync('src/views/PanicOverlay.tsx', code);
    console.log("Success");
} else {
    console.error("String not found");
}

