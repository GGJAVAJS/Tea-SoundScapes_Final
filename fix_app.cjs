const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<h1 className="text-3xl font-bold text-white mb-8">Muito bem!</h1>',
  ''
);

fs.writeFileSync('src/App.tsx', code);
console.log('Success App.tsx');
