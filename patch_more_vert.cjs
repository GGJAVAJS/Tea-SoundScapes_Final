const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const t1 = `<button onClick={() => setShowEQ(!showEQ)} className={\`p-2 transition-colors \${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}\`}>
             {themeMode !== 'child' && <MoreVertical className="w-6 h-6" />}
           </button>`;

const r1 = `{themeMode !== 'child' && (
           <button onClick={() => setShowEQ(!showEQ)} className={\`p-2 transition-colors \${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}\`}>
             <MoreVertical className="w-6 h-6" />
           </button>
           )}`;

const t2 = `<button 
            onClick={() => setIsMixerOpen(true)} 
            aria-label="Abrir Mixer"
            className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 transition-all text-gray-300 hover:text-white shadow-lg hover:shadow-accent-blue/10"
          >
            {themeMode !== 'child' && <MoreVertical className="w-6 h-6" />}
          </button>`;

const r2 = `{themeMode !== 'child' && (
          <button 
            onClick={() => setIsMixerOpen(true)} 
            aria-label="Abrir Mixer"
            className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 transition-all text-gray-300 hover:text-white shadow-lg hover:shadow-accent-blue/10"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          )}`;

if (code.includes(t1)) code = code.replace(t1, r1);
else console.log('t1 not found');

if (code.includes(t2)) code = code.replace(t2, r2);
else console.log('t2 not found');

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('done');
