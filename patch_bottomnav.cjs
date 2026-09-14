const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf-8');

code = code.replace(
  "const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';",
  "const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';\n  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';"
);

code = code.replace(
  /: 'bg-\[#FFE838\]\/20'/g,
  ": isCarsTheme ? 'bg-[#FFE838]/20' : 'bg-accent-blue/20'"
);

code = code.replace(
  /: 'text-\[#FFE838\]'/g,
  ": isCarsTheme ? 'text-[#FFE838]' : 'text-accent-blue'"
);

code = code.replace(
  /: isActive\s+\? \{ color: '#FFE838' \}\s+: undefined/g,
  ": isActive && isCarsTheme ? { color: '#FFE838' } : isActive ? { color: '#38bdf8' } : undefined"
);

fs.writeFileSync('src/components/BottomNav.tsx', code);
