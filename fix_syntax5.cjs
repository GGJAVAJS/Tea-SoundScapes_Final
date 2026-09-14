const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Also the first error is at line 235: JSX fragment has no corresponding closing tag.
// And line 279: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
console.log(code.split('\n').slice(225, 290).join('\n'));
