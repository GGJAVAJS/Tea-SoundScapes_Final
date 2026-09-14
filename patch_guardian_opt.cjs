const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

code = code.replace(/Array\.from\(\{ length: 80 \}\)/g, 'Array.from({ length: 35 })');
// Also reduce Sparkles count if any
code = code.replace(/<Sparkles count=\{200\}/g, '<Sparkles count={50}');
code = code.replace(/<Sparkles count=\{150\}/g, '<Sparkles count={50}');
code = code.replace(/<Sparkles count=\{500\}/g, '<Sparkles count={100}');
code = code.replace(/<Sparkles count=\{400\}/g, '<Sparkles count={100}');
code = code.replace(/<coneGeometry args=\{\[t\.scale \* 2, t\.scale \* 15, 5\]\} \/>/g, '<coneGeometry args={[t.scale * 2, t.scale * 15, 4]} />');

fs.writeFileSync('src/views/GuardianView.tsx', code);
