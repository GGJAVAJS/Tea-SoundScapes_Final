const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const target1 = `      </div>
      )}

      <AnimatePresence mode="wait">`;

const repl1 = `      </div>

      <AnimatePresence mode="wait">`;

code = code.replace(target1, repl1);


fs.writeFileSync('src/views/DiaryView.tsx', code);
