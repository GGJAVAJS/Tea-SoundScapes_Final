const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

if (!code.includes("import SpacePanicShader from")) {
  code = code.replace("import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';", "import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';\nimport SpacePanicShader from '../components/ui/space-panic-shader';");
}

code = code.replace(
  /<GenerativeArtSceneV3 \/>/g,
  `<SpacePanicShader />`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Patched SpacePanicShader into PanicOverlay");
