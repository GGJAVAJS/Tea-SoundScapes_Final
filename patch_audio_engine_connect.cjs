const fs = require('fs');
let code = fs.readFileSync('src/lib/audioEngine.ts', 'utf8');

const targetConn = 'trebleFilter.connect(ctx.destination);';
const replConn = `const analyser = ctx.createAnalyser();\n    analyser.fftSize = 256;\n    trebleFilter.connect(analyser);\n    analyser.connect(ctx.destination);`;
code = code.split(targetConn).join(replConn);

const targetReturn1 = 'baseVolume: targetVolume \n    };';
const replReturn1 = 'baseVolume: targetVolume,\n      analyser \n    };';
code = code.split(targetReturn1).join(replReturn1);

const targetReturn2 = 'baseVolume: targetVolume };';
const replReturn2 = 'baseVolume: targetVolume, analyser };';
code = code.split(targetReturn2).join(replReturn2);

fs.writeFileSync('src/lib/audioEngine.ts', code);
console.log('patched connection');
