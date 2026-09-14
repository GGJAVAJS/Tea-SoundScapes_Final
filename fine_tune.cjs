const fs = require('fs');

// 1. Ajuste quantum-nebula (SOS Pânico)
let nebula = fs.readFileSync('src/components/ui/quantum-nebula.tsx', 'utf8');
nebula = nebula.replace(/count:\s*4000,/, 'count: 25000,');
nebula = nebula.replace(/size:\s*0\.04,/, 'size: 0.025,'); // Reajustando o tamanho para equilibrar com a nova densidade
fs.writeFileSync('src/components/ui/quantum-nebula.tsx', nebula);

// 2. Ajuste atc-shader (Guardião)
let shader = fs.readFileSync('src/components/ui/atc-shader.tsx', 'utf8');
shader = shader.replace(/i\+\+\s*<\s*2\.5e1/g, 'i++ < 3.5e1'); // 3.5e1 = 35
fs.writeFileSync('src/components/ui/atc-shader.tsx', shader);

