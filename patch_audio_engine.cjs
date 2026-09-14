const fs = require('fs');

let code = fs.readFileSync('src/lib/audioEngine.ts', 'utf-8');

const newToggle = `export function toggleGlobalPause(isPaused: boolean) {
  const ctx = getAudioContext();
  if (isPaused) {
    if (ctx.state === 'running') {
      ctx.suspend();
    }
    // Pause all active HTMLAudioElements
    Object.values(activeNodes).forEach(node => {
      if (node.audioElement) {
        node.audioElement.pause();
      }
    });
  } else {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Play all active HTMLAudioElements
    Object.values(activeNodes).forEach(node => {
      if (node.audioElement) {
        node.audioElement.play().catch(e => console.error("Resume playback error:", e));
      }
    });
  }
}`;

const start = code.indexOf('export function toggleGlobalPause');
if (start !== -1) {
  code = code.substring(0, start) + newToggle;
  fs.writeFileSync('src/lib/audioEngine.ts', code);
  console.log("Patched toggleGlobalPause");
}
