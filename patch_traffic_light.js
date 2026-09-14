import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

// 1. Remove CarsGuardianBackground
const bgRegex = /function CarsGuardianBackground\(\{ dbLevel \}: \{ dbLevel: number \}\) \{[\s\S]*?return \([\s\S]*?\}\);\s*\}/;
if (code.match(bgRegex)) {
  code = code.replace(bgRegex, '');
} else {
  console.log("Could not find CarsGuardianBackground");
}

// 2. Add CarsTrafficLightBackground
const newBg = `function CarsTrafficLightBackground({ dbLevel }: { dbLevel: number }) {
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;
  const isSafe = dbLevel < 40;
  
  // Emerald for safe, Amber for alert, Red for extreme alert
  let lightColor = '#10b981'; // safe
  if (isExtremeAlert) lightColor = '#ef4444';
  else if (isAlert) lightColor = '#f59e0b';
  
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
      <div className="relative z-10 w-32 h-64 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Aura central (Fumaça de luz) */}
        <motion.div
           animate={{
             backgroundColor: lightColor,
             scale: isSafe ? [1, 1.1, 1] : [1, 1.2, 1],
             opacity: isSafe ? [0.4, 0.8, 0.4] : [0.7, 1, 0.7]
           }}
           transition={{
             backgroundColor: { duration: 1.5, ease: "easeInOut" },
             scale: { duration: isSafe ? 3.0 : 1.0, repeat: Infinity, ease: "easeInOut" },
             opacity: { duration: isSafe ? 3.0 : 1.0, repeat: Infinity, ease: "easeInOut" }
           }}
           className="w-24 h-24 rounded-full mix-blend-screen"
           style={{ filter: "blur(25px)" }}
        />
      </div>
    </div>
  );
}`;

const viewIndex = code.indexOf('export function GuardianView');
code = code.slice(0, viewIndex) + newBg + '\\n\\n' + code.slice(viewIndex);

// 3. Update Audio triggering logic
code = code.replace(
  "if (isSpaceTheme && isAlert && interventionActive) {",
  "if ((isSpaceTheme || isCarsTheme) && isAlert && interventionActive) {"
);

// 4. Update the render for isChildTheme
// Replace the ErrorBoundary wrapping the Canvas
const canvasStart = code.indexOf('<ErrorBoundary>');
const canvasEnd = code.indexOf('</ErrorBoundary>') + '</ErrorBoundary>'.length;
const canvasBlock = code.slice(canvasStart, canvasEnd);

const newCanvasBlock = `
        {!isCarsTheme && (
          ${canvasBlock}
        )}
        {isCarsTheme && <CarsTrafficLightBackground dbLevel={dbLevel} />}
`;

code = code.replace(canvasBlock, newCanvasBlock);

// Remove the old {isCarsTheme && <CarsGuardianBackground dbLevel={dbLevel} />} inside Canvas
code = code.replace(
  "{isCarsTheme && <CarsGuardianBackground dbLevel={dbLevel} />}",
  ""
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
