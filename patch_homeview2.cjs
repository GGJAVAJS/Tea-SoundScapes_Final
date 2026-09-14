const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// 1. Ensure all icons are imported
const importRegex = /import {([^}]+)} from 'lucide-react';/;
if (code.match(importRegex)) {
  const newImportsStr = "CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, EyeOff, Pause, Play, Bookmark";
  code = code.replace(importRegex, `import { ${newImportsStr} } from 'lucide-react';`);
}

// 2. Ensure isGlobalPause state exists
if (!code.includes('isGlobalPause')) {
  code = code.replace(/const \[isMixerOpen, setIsMixerOpen\] = useState\(false\);/, "const [isMixerOpen, setIsMixerOpen] = useState(false);\n  const [isGlobalPause, setIsGlobalPause] = useState(false);");
}

// 3. Find the AnimatePresence block inside createPortal and replace it
const portalStartStr = "typeof document !== 'undefined' && createPortal(";
const portalStartIndex = code.indexOf(portalStartStr);
if (portalStartIndex !== -1) {
  const animateStart = code.indexOf('<AnimatePresence>', portalStartIndex);
  const lastAnimateEnd = code.lastIndexOf('</AnimatePresence>') + '</AnimatePresence>'.length;
  
  if (animateStart !== -1 && lastAnimateEnd !== -1) {
    const newPortalContent = `
        <AnimatePresence>
          {activeSoundIds.length > 0 && !isMixerOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 left-4 right-4 z-40 cursor-pointer"
              onClick={() => setIsMixerOpen(true)}
            >
              <div className="bg-[#0B1121] border border-white/10 rounded-full p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/5 relative">
                     {DominantIcon && <DominantIcon className="w-6 h-6 text-white" />}
                     {!isGlobalPause && <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-white/30"></motion.div>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-wide">{dominantLabel}</span>
                    <span className="text-accent-blue text-xs opacity-80">Mixagem Ativa</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsGlobalPause(!isGlobalPause); }}
                  className="w-12 h-12 flex items-center justify-center text-white"
                >
                  {isGlobalPause ? <Play className="w-6 h-6 ml-1" fill="currentColor" /> : <Pause className="w-6 h-6" fill="currentColor" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMixerOpen && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-[#060b13] flex flex-col pointer-events-auto"
            >
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]"></div>
               </div>

               <div className="flex items-center justify-between p-6 relative z-10 mt-4">
                 <button onClick={() => setIsMixerOpen(false)} className="text-white/70 hover:text-white p-2">
                   <ChevronDown className="w-8 h-8" strokeWidth={1.5} />
                 </button>
                 <div className="flex flex-col items-center">
                   <span className="text-white font-bold text-lg">{dominantLabel}</span>
                   <span className="text-white/50 text-[10px] tracking-widest uppercase mt-1 font-bold">Foco</span>
                 </div>
                 <button className="text-white/70 hover:text-white p-2">
                   <MoreVertical className="w-6 h-6" />
                 </button>
               </div>

               <div className="relative flex-1 flex items-center justify-center min-h-[300px] z-10">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-[280px] h-[280px] rounded-full border border-dashed border-white/10"></motion.div>
                     <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5"></div>
                  </div>

                  <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 100%)' }}>
                    <Canvas
                      camera={{ position: [0, 0, 5] }}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      gl={{ alpha: true, antialias: false }}
                    >
                       <SoundNebulaShader dominantSoundId={dominantSoundId} />
                    </Canvas>
                  </div>

                  {DominantIcon && (
                    <div className="absolute z-10 text-white drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                      <DominantIcon className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
                    </div>
                  )}
               </div>

               <div className="w-full max-w-sm mx-auto px-6 pb-8 space-y-8 z-10">
                  {activeSoundIds.length === 0 && (
                     <div className="text-center text-white/40 text-sm">Nenhum som ativo</div>
                  )}
                  {activeSoundIds.map(id => {
                     const sound = allMixerSounds.find(s => s.id === id);
                     const vol = volumes[id] || 1;
                     return (
                       <div key={id} className="flex flex-col gap-3 relative">
                         <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{sound?.label}</span>
                         <div className="relative w-full h-[3px] bg-white/10 rounded-full flex items-center">
                           <div className="absolute left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]" style={{ width: \`\${vol * 100}%\` }}></div>
                           <input
                              type="range"
                              min="0" max="1" step="0.01"
                              value={vol}
                              onChange={(e) => handleVolumeChange(id, parseFloat(e.target.value))}
                              className="absolute inset-0 w-full appearance-none bg-transparent h-[3px] rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(250,204,21,1)] cursor-pointer z-10"
                           />
                         </div>
                       </div>
                     )
                  })}
               </div>

               <div className="mt-auto pb-12 flex items-center justify-center gap-12 z-10">
                  <button className="text-white/30 hover:text-white transition-colors">
                    <EyeOff className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setIsGlobalPause(!isGlobalPause)}
                    className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     {isGlobalPause ? <Play className="w-8 h-8 text-white ml-1" fill="none" strokeWidth={1} /> : <Pause className="w-8 h-8 text-white" fill="none" strokeWidth={1} />}
                  </button>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <Bookmark className="w-6 h-6" />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>`;
    
    code = code.substring(0, animateStart) + newPortalContent + code.substring(lastAnimateEnd);
    fs.writeFileSync('src/views/HomeView.tsx', code);
    console.log("Successfully replaced AnimatePresence block.");
  } else {
    console.log("Could not find AnimatePresence block.");
  }
} else {
  console.log("Could not find createPortal.");
}
