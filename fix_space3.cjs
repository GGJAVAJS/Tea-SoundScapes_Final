const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

code = code.replace(/isSpaceTheme \? '([^']*)' :/g, (match, p1) => {
    let newStr = p1.replace(/#FFE838/g, '#38bdf8');
    newStr = newStr.replace(/rgba\(255,232,56/g, 'rgba(56,189,248');
    return `isSpaceTheme ? '${newStr}' :`;
});

code = code.replace(/isSpaceTheme\s*\n?\s*\?\s*\{\s*color:\s*'#FFE838'\s*\}/g, "isSpaceTheme ? { color: '#38bdf8' }");

fs.writeFileSync('src/components/BottomNav.tsx', code);
