const fs = require('fs');

// 1. Optimize quantum-nebula (SOS Panic)
let nebula = fs.readFileSync('src/components/ui/quantum-nebula.tsx', 'utf8');
// Reduce particles from 50,000 to 4,000
nebula = nebula.replace(/count:\s*50000,/, 'count: 4000,');
// Lower particle size slightly to compensate for density visually
nebula = nebula.replace(/size:\s*0\.02,/, 'size: 0.04,');
// Limit pixel ratio to 1.5 max for performance
nebula = nebula.replace(/renderer\.setPixelRatio\(window\.devicePixelRatio\);/, 'renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));');
// Optimize the bloom threshold to reduce glow calculation strain
nebula = nebula.replace(/strength:\s*0\.6,/, 'strength: 0.8,');
fs.writeFileSync('src/components/ui/quantum-nebula.tsx', nebula);


// 2. Optimize atc-shader (Guardian)
let shader = fs.readFileSync('src/components/ui/atc-shader.tsx', 'utf8');
// Reduce loop iterations from 50 to 25
shader = shader.replace(/i\+\+\s*<\s*5e1/g, 'i++ < 2.5e1');
// Reduce DPR max from 2 to 1 (huge performance gain on mobile)
shader = shader.replace(/const dpr = Math\.max\(1, Math\.min\(2, window\.devicePixelRatio\|\|1\)\)/g, 'const dpr = Math.min(1, window.devicePixelRatio || 1)');
fs.writeFileSync('src/components/ui/atc-shader.tsx', shader);

