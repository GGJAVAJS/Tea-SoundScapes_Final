const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const t1 = `{themeMode !== 'child' && (
           <button onClick={() => setShowEQ(!showEQ)} className={\`p-2 transition-colors \${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}\`}>
             <MoreVertical className="w-6 h-6" />
           </button>
           )}`;

const r1 = `<button onClick={() => setShowEQ(!showEQ)} className={\`p-2 transition-colors \${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}\`}>
             <MoreVertical className="w-6 h-6" />
           </button>`;

if (code.includes(t1)) code = code.replace(t1, r1);
else console.log('t1 not found');

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('done');
