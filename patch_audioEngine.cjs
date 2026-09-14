const fs = require('fs');
let code = fs.readFileSync('src/lib/audioEngine.ts', 'utf8');

// Add analyser to interface
code = code.replace(
  'trebleFilter?: BiquadFilterNode,',
  'trebleFilter?: BiquadFilterNode,\n  analyser?: AnalyserNode,'
);

// Add getAnalyser export
code = code.replace(
  'export function setVolume',
  'export function getAnalyser(type: string): AnalyserNode | undefined {\n  return activeNodes[type]?.analyser;\n}\n\nexport function setVolume'
);

fs.writeFileSync('src/lib/audioEngine.ts', code);
console.log('patched interface and export');
