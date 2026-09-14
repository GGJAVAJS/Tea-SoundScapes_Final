import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

code = code.replace(
  /isCarsTheme \? 'text-\[\#A80505\]' : isSpaceTheme \? 'accent-\[\#FFE838\]/,
  "isCarsTheme ? 'accent-[#A80505] hover:border hover:border-[#A80505]/79' : isSpaceTheme ? 'accent-[#FFE838]"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
