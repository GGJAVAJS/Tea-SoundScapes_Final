const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  /<\/button>\s*<\/div>\s*<AnimatePresence mode="wait">/,
  '</button>\n      </div>\n      )}\n      <AnimatePresence mode="wait">'
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Syntax 2');
