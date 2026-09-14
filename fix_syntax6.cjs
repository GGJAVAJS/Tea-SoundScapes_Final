const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Also look at AnimatePresence mode wait.
const idx = code.indexOf('<AnimatePresence mode="wait">');
if (idx !== -1) {
  let snippet = code.slice(idx, idx + 800);
  console.log(snippet);
}

