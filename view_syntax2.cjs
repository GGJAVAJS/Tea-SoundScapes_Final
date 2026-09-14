const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

console.log(code.split('\n').slice(265, 290).join('\n'));
