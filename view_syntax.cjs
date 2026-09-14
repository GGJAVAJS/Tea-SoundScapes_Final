const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// I need to look at lines around 425-460 where the JSX fragment is failing
console.log(code.split('\n').slice(425, 460).join('\n'));
