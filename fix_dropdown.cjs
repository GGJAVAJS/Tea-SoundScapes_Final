const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  '<button onClick={() => setFilter(\'old\')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Mais Antigos</button>',
  `<button onClick={() => setFilter('old')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Mais Antigos</button>
            <button onClick={() => setFilter('month')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Por Mês</button>
            <button onClick={() => setFilter('year')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Por Ano</button>`
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Dropdown');
