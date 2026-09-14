const fs = require('fs');

let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');
const newOverlay = fs.readFileSync('new_mixer_overlay.jsx', 'utf-8');

const start = code.indexOf('function MixerOverlay');
const end = code.indexOf('export const SOUND_CONFIGS');

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + newOverlay + '\n' + code.substring(end);
  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log("Replaced MixerOverlay successfully");
} else {
  console.log("Could not find boundaries");
}
