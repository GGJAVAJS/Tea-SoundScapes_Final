const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

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
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsGlobalPause(!isGlobalPause); 
                    // To truly pause audio, we might need a global context toggle, 
                    // for now we trust state isGlobalPause.
                  }}
                  className="w-12 h-12 flex items-center justify-center text-white relative z-50 pointer-events-auto"
                >
                  {isGlobalPause ? <Play className="w-6 h-6 ml-1" fill="currentColor" /> : <Pause className="w-6 h-6" fill="currentColor" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMixerOpen && (
            <MixerOverlay 
               dominantSoundId={dominantSoundId} 
               dominantLabel={dominantLabel} 
               DominantIcon={DominantIcon} 
               activeSoundIds={activeSoundIds} 
               allMixerSounds={allMixerSounds} 
               volumes={volumes} 
               handleVolumeChange={handleVolumeChange} 
               setIsMixerOpen={setIsMixerOpen} 
               isGlobalPause={isGlobalPause} 
               setIsGlobalPause={setIsGlobalPause} 
            />
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
