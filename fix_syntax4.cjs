const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// The issue might be that I added an extra <motion.div> closing tag or something
const idx = code.indexOf('<AnimatePresence mode="wait">');
if (idx !== -1) {
  let snippet = code.slice(idx, idx + 800);
  console.log(snippet);
}

