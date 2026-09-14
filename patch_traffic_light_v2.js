import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

const startIdx = code.indexOf('function CarsTrafficLightBackground({ dbLevel }: { dbLevel: number }) {');
const endIdx = code.indexOf('export function GuardianView({');

if (startIdx !== -1 && endIdx !== -1) {
  const newBg = `function CarsTrafficLightBackground({ dbLevel }: { dbLevel: number }) {
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;
  const isSafe = dbLevel < 40;
  
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a1a] to-[#000000] overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Film Grain */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
          backgroundRepeat: "repeat",
        }}
      />
      
      {/* Semáforo (Traffic Light Pillar) */}
      <div className="relative z-10 w-28 h-72 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-evenly py-6 overflow-hidden mt-8">
        
        {/* Red Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isExtremeAlert ? 1 : 0.05,
               scale: isExtremeAlert ? [1, 1.2, 1] : 1,
             }}
             transition={{
               scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#ef4444] mix-blend-screen"
             style={{ filter: isExtremeAlert ? "blur(15px)" : "blur(4px)" }}
          />
          <div className={\`w-10 h-10 rounded-full z-10 transition-colors duration-500 \${isExtremeAlert ? 'bg-red-500 shadow-[0_0_25px_#ef4444]' : 'bg-red-950/40 border border-red-900/30'}\`} />
        </div>

        {/* Yellow Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isAlert ? 1 : 0.05,
               scale: isAlert ? [1, 1.15, 1] : 1,
             }}
             transition={{
               scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#f59e0b] mix-blend-screen"
             style={{ filter: isAlert ? "blur(15px)" : "blur(4px)" }}
          />
          <div className={\`w-10 h-10 rounded-full z-10 transition-colors duration-500 \${isAlert ? 'bg-amber-400 shadow-[0_0_25px_#f59e0b]' : 'bg-amber-950/40 border border-amber-900/30'}\`} />
        </div>

        {/* Green Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isSafe ? 1 : 0.05,
               scale: isSafe ? [1, 1.1, 1] : 1,
             }}
             transition={{
               scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#10b981] mix-blend-screen"
             style={{ filter: isSafe ? "blur(20px)" : "blur(4px)" }}
          />
          <div className={\`w-10 h-10 rounded-full z-10 transition-colors duration-500 \${isSafe ? 'bg-emerald-400 shadow-[0_0_25px_#10b981]' : 'bg-emerald-950/40 border border-emerald-900/30'}\`} />
        </div>
        
      </div>
    </div>
  );
}

`;

  code = code.substring(0, startIdx) + newBg + code.substring(endIdx);
  fs.writeFileSync('src/views/GuardianView.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find start or end bounds.");
}
