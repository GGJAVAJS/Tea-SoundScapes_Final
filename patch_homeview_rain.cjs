const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

if (!code.includes("import RainShader from")) {
  code = code.replace("import FireShader from '../components/ui/fire-shader';", "import FireShader from '../components/ui/fire-shader';\nimport RainShader from '../components/ui/rain-shader';");
}

code = code.replace(
  /dominantSoundId === 'lareira' \? <FireShader \/> : <GenerativeArtSceneV3 \/>/g,
  `dominantSoundId === 'lareira' ? <FireShader /> : dominantSoundId === 'chuva' ? <RainShader /> : <GenerativeArtSceneV3 />`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched RainShader into MixerOverlay");
