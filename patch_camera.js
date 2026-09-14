import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// Change interval
code = code.replace(
  /const interval = setInterval\(\(\) => \{\s+setMode\(prev => \(prev === 1 \? 2 : 1\)\);\s+\}, 20000\);/,
  `const interval = setInterval(() => {
      setMode(prev => (prev === 1 ? 2 : 1));
    }, 15000);`
);

// Change lerp factor
code = code.replace(
  /const lerpFactor = 1.5 \* delta;/,
  `// Transição muito mais lenta e cinemática (ajuste de tempo)
      const lerpFactor = 0.5 * delta;`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
