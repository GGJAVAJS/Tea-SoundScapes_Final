const fs = require('fs');

let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// Replace MixerOverlay usage
code = code.replace(
  /<MixerOverlay\s+dominantSoundId={dominantSoundId}\s+dominantLabel={dominantLabel}\s+DominantIcon={DominantIcon}\s+activeSoundIds={activeSoundIds}\s+allMixerSounds={allMixerSounds}\s+volumes={volumes}\s+handleVolumeChange={handleVolumeChange}\s+setIsMixerOpen={setIsMixerOpen}\s+isGlobalPause={isGlobalPause}\s+setIsGlobalPause={setIsGlobalPause}\s*\/>/g,
  `<MixerOverlay 
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
               eq={eq}
               handleEQChange={handleEQChange}
            />`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Usage patched.");
