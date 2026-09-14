import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// There are duplicates, let's remove the ones at the bottom
const duplicateRegex = /\s+const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';\s+const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';\s+const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';\s+const isChildTheme = isSpaceTheme \|\| isDinoTheme \|\| isCarsTheme;/g;

const matches = code.match(duplicateRegex);

if (matches && matches.length > 1) {
  // Replace the last occurrence
  const lastMatch = matches[matches.length - 1];
  const lastIndex = code.lastIndexOf(lastMatch);
  code = code.substring(0, lastIndex) + code.substring(lastIndex + lastMatch.length);
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find multiple occurrences");
}

