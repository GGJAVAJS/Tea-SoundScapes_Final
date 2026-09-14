const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const componentCode = `
function MixerOverlay({ dominantSoundId, dominantLabel, DominantIcon, activeSoundIds, allMixerSounds, volumes, handleVolumeChange, setIsMixerOpen, isGlobalPause, setIsGlobalPause }) {
  const [isUiHidden, setIsUiHidden] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#060b13] flex flex-col pointer-events-auto overflow-hidden"
    >
       {/* Background Shader covering everything */}
       <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5] }}
            className="absolute inset-0 w-full h-full"
            gl={{ alpha: true, antialias: false }}
          >
             <SoundNebulaShader dominantSoundId={dominantSoundId} />
          </Canvas>
       </div>

       {/* Overlay UI Layer */}
       <div className="relative z-10 flex flex-col h-full w-full">
         
         {/* Top Bar - Hidden when isUiHidden */}
         <div className={\`flex items-center justify-between p-6 mt-4 transition-all duration-500 \${isUiHidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}\`}>
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

         {/* Central Area - Hidden when isUiHidden */}
         <div className={\`relative flex-1 flex items-center justify-center min-h-[300px] transition-all duration-500 \${isUiHidden ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}\`}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="w-[280px] h-[280px] rounded-full border border-dashed border-white/10"></motion.div>
               <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5"></div>
            </div>

            {DominantIcon && (
              <div className="absolute z-10 text-white drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <DominantIcon className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
              </div>
            )}
         </div>

         {/* Volumes - ALWAYS VISIBLE (or maybe they fade if idle? User wants them visible!) */}
         <div className="w-full max-w-sm mx-auto px-6 pb-8 space-y-8 z-20">
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
                     <div className="absolute left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)] pointer-events-none" style={{ width: \`\${vol * 100}%\` }}></div>
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
         </div>

         {/* Bottom Controls - ALWAYS VISIBLE */}
         <div className="mt-auto pb-12 flex items-center justify-center gap-12 z-20">
            <button onClick={(e) => { e.stopPropagation(); setIsUiHidden(!isUiHidden); }} className="text-white/30 hover:text-white transition-colors">
              <EyeOff className={\`w-6 h-6 transition-all \${isUiHidden ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}\`} />
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
         </div>
       </div>
    </motion.div>
  );
}
`;

const start = code.indexOf('function MixerOverlay');
const end = code.indexOf('export const SOUND_CONFIGS');
if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + componentCode + '\n' + code.substring(end);
  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log("Successfully updated MixerOverlay UI visibility logic.");
} else {
  console.log("Could not find MixerOverlay boundaries.");
}
