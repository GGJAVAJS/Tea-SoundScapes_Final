import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

// Fix the \n\n syntax error
code = code.replace(/\\n\\nexport function GuardianView/, '\n\nexport function GuardianView');

// Delete CarsGuardianBackground
const bgRegex = /function CarsGuardianBackground\(\{ dbLevel \}: \{ dbLevel: number \}\) \{[\s\S]*?group>\s*\);\s*\}/;
code = code.replace(bgRegex, '');

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
