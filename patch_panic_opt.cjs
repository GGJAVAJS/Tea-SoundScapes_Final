const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

code = code.replace(/Array\.from\(\{ length: 200 \}\)/g, 'Array.from({ length: 40 })');
code = code.replace(/segments=\{20\}/g, 'segments={8}');

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
