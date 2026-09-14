const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const target = `{dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} /> : dominantSoundId === 'natureza' ? <NatureLandscapeShader /> : dominantSoundId === 'passaros' ? <UniverseWithinShader /> : dominantSoundId === 'branco' ? <Nucleus /> : dominantSoundId === 'agua' ? <WaterShader /> : dominantSoundId === 'lareira' ? <FireShader /> : dominantSoundId === 'chuva' ? <RainShader /> : dominantSoundId === 'rosa' ? <PinkNoiseShader /> : <GenerativeArtSceneV3 />}`;

const replacement = `{themeMode === 'child' ? (
            dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} /> : dominantSoundId === 'natureza' ? <NatureLandscapeShader /> : dominantSoundId === 'passaros' ? <UniverseWithinShader /> : dominantSoundId === 'branco' ? <Nucleus /> : dominantSoundId === 'agua' ? <WaterShader /> : dominantSoundId === 'lareira' ? <FireShader /> : dominantSoundId === 'chuva' ? <RainShader /> : dominantSoundId === 'rosa' ? <PinkNoiseShader /> : <GenerativeArtSceneV3 />
          ) : (
            <GenerativeArtSceneV3 />
          )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
}
