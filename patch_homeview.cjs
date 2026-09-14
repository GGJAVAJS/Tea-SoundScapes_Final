const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const replacement = `
  const allMixerSounds = [
    ...SOUND_CONFIGS,
    ...importedSounds.map(s => ({ id: s.id, label: s.name, icon: Activity }))
  ];

  const activeSoundIds = Object.keys(activeSounds).filter(id => activeSounds[id]);
  let dominantSoundId = null;
  let maxVol = -1;
  for (const id of activeSoundIds) {
    const v = volumes[id] || 1;
    if (v > maxVol) {
      maxVol = v;
      dominantSoundId = id;
    }
  }
  const DominantIcon = dominantSoundId ? allMixerSounds.find(s => s.id === dominantSoundId)?.icon : null;
  const dominantLabel = dominantSoundId ? allMixerSounds.find(s => s.id === dominantSoundId)?.label : 'Silêncio';

  return (
`;

code = code.replace(/const allMixerSounds = \[\s*\.\.\.SOUND_CONFIGS,\s*\.\.\.importedSounds\.map\(s => \(\{ id: s\.id, label: s\.name, icon: Activity \}\)\)\s*\];\s*return \(/s, replacement);

const widgetReplacement = `                  </div>
                  
                  {/* Internal Media Widget / Shader Visualizer */}
                  <div className="w-full h-48 rounded-3xl overflow-hidden relative mb-6 border border-white/10 bg-black/50">
                    <Canvas
                      camera={{ position: [0, 0, 5] }}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      gl={{ alpha: true, antialias: false }}
                    >
                       <SoundNebulaShader dominantSoundId={dominantSoundId} />
                    </Canvas>
                    
                    {/* Overlay text or visualizer graphics (like in CommunityView) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <motion.div
                         animate={{ scale: [1, 1.1, 1] }}
                         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                         className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm relative"
                       >
                          {dominantSoundId && <motion.div 
                             animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
                             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                             className="absolute inset-0 rounded-full border border-dashed border-white/30"
                          />}
                          {DominantIcon && <DominantIcon className="w-8 h-8 text-white relative z-10" />}
                       </motion.div>
                       <span className="text-[10px] text-white/50 mt-4 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                         {dominantLabel}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">`;

code = code.replace(/<\/div>\s*<div className="flex flex-col gap-8 max-h-\[60vh\] overflow-y-auto custom-scrollbar pr-3">/s, widgetReplacement);

fs.writeFileSync('src/views/HomeView.tsx', code);
