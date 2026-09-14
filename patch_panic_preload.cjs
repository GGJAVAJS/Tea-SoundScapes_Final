const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');
code = code.replace(
  "useGLTF.preload('/space_boi.glb');",
  "useGLTF.preload('/space_boi.glb');\nuseGLTF.preload('/animated_flying_pteradactal_dinosaur_loop.glb');"
);
fs.writeFileSync('src/views/PanicOverlay.tsx', code);
