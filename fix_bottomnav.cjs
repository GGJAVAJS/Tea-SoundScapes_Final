const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

// Blur background
code = code.replace(/isSpaceTheme\s*\n\s*\?\s*'bg-\[#FFE838\]\/25'/g, "isSpaceTheme\n                      ? 'bg-[#602EC9]/40'");

// Icon color classes
code = code.replace(/isSpaceTheme \? 'text-\[#38bdf8\]'/g, "isSpaceTheme ? 'text-[#602EC9]'");

// Icon style override
code = code.replace(/isActive && isSpaceTheme \? \{ color: '#38bdf8' \}/g, "isActive && isSpaceTheme ? { color: '#602EC9' }");

fs.writeFileSync('src/components/BottomNav.tsx', code);
