const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// The issue was I kept doing small search/replaces which broke the structure.
// I will just download the actual component that had a syntax error.

