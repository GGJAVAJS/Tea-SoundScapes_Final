const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');
const lines = code.split('\n');

for (let i = 270; i < 330; i++) {
  console.log(`${i}: ${lines[i]}`);
}
