const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /<div className="absolute inset-0 z-0 pointer-events-none">([\s\S]*?)<\/div>/;
const replacement = `<div className="absolute inset-0 z-0 pointer-events-none">
          {themeMode === 'child' && (
            dominantSoundId?.startsWith('imported-') ? <MathematicalVisualizer soundId={dominantSoundId} /> : dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} /> : dominantSoundId === 'natureza' ? <NatureLandscapeShader /> : dominantSoundId === 'passaros' ? <UniverseWithinShader /> : dominantSoundId === 'branco' ? <Nucleus /> : dominantSoundId === 'agua' ? <WaterShader /> : dominantSoundId === 'lareira' ? <FireShader /> : dominantSoundId === 'chuva' ? <RainShader /> : dominantSoundId === 'rosa' ? <PinkNoiseShader /> : <GenerativeArtSceneV3 />
          )}
       </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/views/HomeView.tsx', code);
