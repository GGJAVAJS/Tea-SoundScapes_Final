const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const target1 = `      <div className="glass-card flex p-1 mb-8 rounded-full hide-on-print border-white/10">`;

const target2 = `      <AnimatePresence mode="wait">`;
const repl2 = `      )}
      <AnimatePresence mode="wait">`;

code = code.replace(target2, repl2);

fs.writeFileSync('src/views/DiaryView.tsx', code);
