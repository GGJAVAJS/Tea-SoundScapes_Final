const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');
code = code.replace(
  "useGLTF.preload('/black_hole.glb');",
  "useGLTF.preload('/black_hole.glb');\nuseGLTF.preload('/meteor.glb');\nuseGLTF.preload('/animated_tyrannosaurus_rex_dinosaur_running_loop.glb');"
);
fs.writeFileSync('src/views/GuardianView.tsx', code);
