const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetImport = "import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';";
const replacementImport = "import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';\nimport { MathematicalVisualizer } from '../components/ui/MathematicalVisualizer';";
code = code.replace(targetImport, replacementImport);

const targetRender1 = "dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} />";
const replacementRender1 = "dominantSoundId?.startsWith('imported-') ? <MathematicalVisualizer soundId={dominantSoundId} /> : dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} />";
code = code.replace(targetRender1, replacementRender1);

const targetRender2 = ") : (\n            <GenerativeArtSceneV3 />\n          )}";
const replacementRender2 = ") : (\n            dominantSoundId?.startsWith('imported-') ? <MathematicalVisualizer soundId={dominantSoundId} /> : <GenerativeArtSceneV3 />\n          )}";
code = code.replace(targetRender2, replacementRender2);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched home view visualizer');
