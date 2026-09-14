import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

code = code.replace(
  /isCarsTheme \? 'text-\[\#A80505\]' : isSpaceTheme \? 'text-\[\#FFE838\]'/g,
  "isCarsTheme ? 'text-white' : isSpaceTheme ? 'text-[#FFE838]'"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
