const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

if (!code.includes("import Nucleus from")) {
  code = code.replace("import { LightSpeed } from '../components/ui/light-speed';", "import { LightSpeed } from '../components/ui/light-speed';\nimport Nucleus from '../components/ui/nucleus';");
}

code = code.replace(
  /\{dominantSoundId === 'marrom' \? <LightSpeed speed=\{0\.4\} \/> : <GenerativeArtSceneV3 \/>\}/g,
  `{dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} /> : dominantSoundId === 'natureza' ? <Nucleus /> : <GenerativeArtSceneV3 />}`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched Nucleus into MixerOverlay");
