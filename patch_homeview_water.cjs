const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

if (!code.includes("import WaterShader from")) {
  code = code.replace("import Nucleus from '../components/ui/nucleus';", "import Nucleus from '../components/ui/nucleus';\nimport WaterShader from '../components/ui/water-shader';");
}

code = code.replace(
  /dominantSoundId === 'natureza' \? <Nucleus \/> : <GenerativeArtSceneV3 \/>/g,
  `dominantSoundId === 'natureza' ? <Nucleus /> : dominantSoundId === 'agua' ? <WaterShader /> : <GenerativeArtSceneV3 />`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched WaterShader into MixerOverlay");
