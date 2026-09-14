import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

// The active buttons for Registration/Analyses tab
code = code.replace(
  /'bg-\[\#FFE838\]\/\[\.88\] text-white border border-\[\#FFE838\]\/\[\.88\] shadow-\[0_0_12px_rgba\(255,232,56,0\.5\)\]'/g,
  "'bg-[#FFE838]/[.88] text-black border border-[#FFE838]/[.88] shadow-[0_0_12px_rgba(255,232,56,0.5)]'"
);

// Triggers and strategies (active)
code = code.replace(
  /'bg-\[\#FFE838\]\/\[\.88\] border border-\[\#FFE838\]\/\[\.88\] text-white shadow-\[0_0_12px_rgba\(255,232,56,0\.5\)\]'/g,
  "'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]'"
);

// Check mark on active trigger/strategy
code = code.replace(
  /isCarsTheme \? 'text-white' : isSpaceTheme \? 'text-\[\#FFE838\]'/g,
  "isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#FFE838]'"
);

// Save button (text is hardcoded to text-white)
code = code.replace(
  /text-white rounded-2xl relative overflow-hidden active:scale-95 transition-all \$\{isCarsTheme \? 'bg-\[\#FFE838\]\/\[\.88\]/g,
  "rounded-2xl relative overflow-hidden active:scale-95 transition-all ${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
