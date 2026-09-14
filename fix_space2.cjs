const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(/isSpaceTheme \? '([^']*)' :/g, (match, p1) => {
    let newStr = p1.replace(/rgba\(255,232,56/g, 'rgba(56,189,248');
    return `isSpaceTheme ? '${newStr}' :`;
});

fs.writeFileSync('src/views/DiaryView.tsx', code);
