function MixerOverlay({ dominantSoundId, dominantLabel, DominantIcon, activeSoundIds, allMixerSounds, volumes, handleVolumeChange, setIsMixerOpen, isGlobalPause, setIsGlobalPause, eq, handleEQChange }) {
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [showEQ, setShowEQ] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#060b13] flex flex-col pointer-events-auto overflow-hidden"
    >
       {/* New Quantum Nebula Background Shader */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          <GenerativeArtSceneV3 />
       </div>

       {/* Overlay UI Layer */}
       <div className="relative z-10 flex flex-col h-full w-full">
         
         {/* Top Bar - Hidden when isUiHidden */}
         <div className={`flex items-center justify-between p-6 mt-4 transition-all duration-500 ${isUiHidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
           <button onClick={() => setIsMixerOpen(false)} className="text-white/70 hover:text-white p-2">
             <ChevronDown className="w-8 h-8" strokeWidth={1.5} />
           </button>
           
           <div className="flex flex-col items-center">
             <span className="text-white font-bold text-lg">{dominantLabel || "Mixagem"}</span>
             <span className="text-white/50 text-[10px] tracking-widest uppercase mt-1 font-bold">Mixer</span>
           </div>
           
           <button onClick={() => setShowEQ(!showEQ)} className={`p-2 transition-colors ${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
             <MoreVertical className="w-6 h-6" />
           </button>
         </div>

         {/* Spacer */}
         <div className="flex-1" />

         {/* Main Content Area (Volumes or EQ) */}
         <div className={`w-full max-w-sm mx-auto px-6 pb-8 space-y-8 z-20 transition-all duration-500 ${isUiHidden ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            
            {showEQ ? (
              // EQ CONTROLS
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 space-y-6">
                <div className="text-center text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Equalizador Geral</div>
                {['bass', 'mid', 'treble'].map(band => {
                  // We'll control EQ for the dominant sound, or ideally all active sounds.
                  // For simplicity, we control the dominant sound's EQ.
                  const currentEq = eq[dominantSoundId] || { bass: 0.5, mid: 0.5, treble: 0.5 };
                  const val = currentEq[band];
                  const labels = { bass: 'Graves', mid: 'Médios', treble: 'Agudos' };
                  return (
                    <div key={band} className="flex flex-col gap-3 relative">
                      <div className="flex justify-between items-center text-white/50 text-[10px] font-bold tracking-widest uppercase">
                        <span>{labels[band]}</span>
                        <span>{Math.round(val * 100)}%</span>
                      </div>
                      <div className="relative w-full h-[3px] bg-white/10 rounded-full flex items-center">
                        <div className="absolute left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full pointer-events-none" style={{ width: `${val * 100}%` }}></div>
                        <input
                           type="range"
                           min="0" max="1" step="0.01"
                           value={val}
                           onChange={(e) => {
                             e.stopPropagation();
                             // Apply to all active sounds for a "global" EQ feel, or just dominant
                             activeSoundIds.forEach(id => {
                               handleEQChange(id, band, parseFloat(e.target.value));
                             });
                           }}
                           className="absolute inset-0 w-full appearance-none bg-transparent h-[3px] rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(34,211,238,1)] cursor-pointer z-50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // VOLUME CONTROLS
              <>
                {activeSoundIds.length === 0 && (
                   <div className="text-center text-white/40 text-sm">Nenhum som ativo</div>
                )}
                {activeSoundIds.map(id => {
                   const sound = allMixerSounds.find(s => s.id === id);
                   const vol = volumes[id] !== undefined ? volumes[id] : 1;
                   return (
                     <div key={id} className="flex flex-col gap-3 relative">
                       <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{sound?.label}</span>
                       <div className="relative w-full h-[3px] bg-white/10 rounded-full flex items-center">
                         <div className="absolute left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)] pointer-events-none" style={{ width: `${vol * 100}%` }}></div>
                         <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={vol}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleVolumeChange(id, parseFloat(e.target.value));
                            }}
                            className="absolute inset-0 w-full appearance-none bg-transparent h-[3px] rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(250,204,21,1)] cursor-pointer z-50"
                         />
                       </div>
                     </div>
                   )
                })}
              </>
            )}
         </div>

         {/* Bottom Controls */}
         <div className="mt-auto pb-12 relative flex items-center justify-center h-24 z-20">
            <AnimatePresence>
              {!isUiHidden && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 20 }} 
                  className="absolute flex items-center justify-center gap-12 w-full"
                >
                  <button onClick={(e) => { e.stopPropagation(); setIsUiHidden(true); }} className="text-white/30 hover:text-white transition-colors">
                    <EyeOff className="w-6 h-6 transition-all" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsGlobalPause(!isGlobalPause); }}
                    className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     {isGlobalPause ? <Play className="w-8 h-8 text-white ml-1" fill="none" strokeWidth={1} /> : <Pause className="w-8 h-8 text-white" fill="none" strokeWidth={1} />}
                  </button>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isUiHidden && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.5 }} 
                  className="absolute flex items-center justify-center w-full"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsUiHidden(false); }} 
                    className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     <EyeOff className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
       </div>
    </motion.div>
  );
}
