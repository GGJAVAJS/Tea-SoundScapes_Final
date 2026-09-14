import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

// The color to replace is A80505 with FFE838
// The rgba for A80505 is 168,5,5. The rgba for FFE838 is 255,232,56.

code = code.replace(/#A80505/g, '#FFE838/[.88]');
code = code.replace(/#8b0404/g, '#FFE838'); // The hover color
code = code.replace(/rgba\(168,5,5,/g, 'rgba(255,232,56,');

// However, text-[#FFE838/[.88]] is invalid tailwind if it's text-[#FFE838]/[.88] 
// Actually, it's text-[#FFE838]/[.88]. Let's fix that.
code = code.replace(/text-\[\#FFE838\/\[\.88\]\]/g, 'text-[#FFE838]/[.88]');
code = code.replace(/bg-\[\#FFE838\/\[\.88\]\]/g, 'bg-[#FFE838]/[.88]');
code = code.replace(/border-\[\#FFE838\/\[\.88\]\]/g, 'border-[#FFE838]/[.88]');
code = code.replace(/ring-\[\#FFE838\/\[\.88\]\]/g, 'ring-[#FFE838]/[.88]');
code = code.replace(/accent-\[\#FFE838\/\[\.88\]\]/g, 'accent-[#FFE838]/[.88]');

// Also fix the opacities that were already appended, e.g., bg-[#A80505]/20 became bg-[#FFE838/[.88]]/20
code = code.replace(/\[\#FFE838\/\[\.88\]\]\/20/g, '[#FFE838]/20');
code = code.replace(/\[\#FFE838\/\[\.88\]\]\/50/g, '[#FFE838]/50');

// Fix text-white on the bright yellow background for better contrast
// Where we have bg-[#FFE838]/[.88] text-white, we should probably change it to text-black
code = code.replace(/bg-\[\#FFE838\/\[\.88\]\] text-white/g, 'bg-[#FFE838]/[.88] text-black');
code = code.replace(/bg-\[\#FFE838\/\[\.88\]\] border border-\[\#FFE838\/\[\.88\]\] text-white/g, 'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black');

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Success");
