const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// I am just going to cut out the inner code of RegistroView and re-inject a working one
const lines = code.split('\n');

const startIdx = lines.findIndex(l => l.includes('function RegistroView('));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('}'));

console.log('start', startIdx);
console.log('end', endIdx);
