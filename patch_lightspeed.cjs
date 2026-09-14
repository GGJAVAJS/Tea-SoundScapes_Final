const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

if (!code.includes("import { LightSpeed }")) {
  code = code.replace("import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';", "import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';\nimport { LightSpeed } from '../components/ui/light-speed';");
}

code = code.replace(
  /<GenerativeArtSceneV3 \/>/g,
  `{dominantSoundId === 'marrom' ? <LightSpeed speed={1.5} /> : <GenerativeArtSceneV3 />}`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched LightSpeed into MixerOverlay");
