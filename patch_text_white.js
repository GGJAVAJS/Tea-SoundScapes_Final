import fs from 'fs';
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

// The other themes might have lost text-white on the Save button
code = code.replace(
  /: isSpaceTheme \? 'bg-\[\#FFE838\]\/20 hover:bg-\[\#FFE838\]\/30/g,
  ": isSpaceTheme ? 'text-white bg-[#FFE838]/20 hover:bg-[#FFE838]/30"
);
code = code.replace(
  /: isDinoTheme \? 'bg-\[\#80F356\]\/20 hover:bg-\[\#80F356\]\/30/g,
  ": isDinoTheme ? 'text-white bg-[#80F356]/20 hover:bg-[#80F356]/30"
);
code = code.replace(
  /: 'bg-accent-blue\/20 hover:bg-accent-blue\/30/g,
  ": 'text-white bg-accent-blue/20 hover:bg-accent-blue/30"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
