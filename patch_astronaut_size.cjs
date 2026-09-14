const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  `className="w-[1.2em] h-[1.2em] object-contain drop-shadow-md"`,
  `className="w-[2em] h-[2em] object-contain drop-shadow-md scale-125"`
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
