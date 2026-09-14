const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const target1 = `...importedSounds.map(s => ({ id: s.id, label: s.name, icon: Activity }))`;
const repl1 = `...importedSounds.map(s => ({ id: s.id, label: s.name, icon: getIconComponentForName(s.name) }))`;

const target2 = `{importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          return (`;
const repl2 = `{importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          const IconComponent = getIconComponentForName(sound.name);
          return (`;

const target3 = `<Activity className={\`w-8 h-8 shrink-0 \${isActive `;
const repl3 = `<IconComponent className={\`w-8 h-8 shrink-0 \${isActive `;

if (code.includes(target1)) code = code.replace(target1, repl1);
else console.log('target1 not found');

if (code.includes(target2)) code = code.replace(target2, repl2);
else console.log('target2 not found');

if (code.includes(target3)) code = code.replace(target3, repl3);
else console.log('target3 not found');

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched imported sounds');
