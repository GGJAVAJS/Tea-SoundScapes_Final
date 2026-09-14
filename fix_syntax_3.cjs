const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  /<\/button>\n            \)\)}\n          <\/div>\n        \)}\n      <\/div>/,
  '</button>\n            ))}\n          </div>\n      </div>'
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Syntax 3');
