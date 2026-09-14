const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// I also need to fix the parent element issue at line 266/284
const idx = code.indexOf('<AnimatePresence mode="wait">');
if (idx !== -1) {
  let snippet = code.slice(idx - 200, idx + 200);
  console.log(snippet);
}

