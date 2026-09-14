const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

code = code.replace(
  /<div className="absolute top-0 left-0 bottom-0 bg-\[rgba\(56,189,248,0\.1\)\]" style=\{\{ width: `\$\{percent\}%` \}\} \/>\n/g,
  ''
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
