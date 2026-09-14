const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

if (!code.includes("import FireShader from")) {
  code = code.replace("import WaterShader from '../components/ui/water-shader';", "import WaterShader from '../components/ui/water-shader';\nimport FireShader from '../components/ui/fire-shader';");
}

code = code.replace(
  /dominantSoundId === 'agua' \? <WaterShader \/> : <GenerativeArtSceneV3 \/>/g,
  `dominantSoundId === 'agua' ? <WaterShader /> : dominantSoundId === 'lareira' ? <FireShader /> : <GenerativeArtSceneV3 />`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched FireShader into MixerOverlay");
