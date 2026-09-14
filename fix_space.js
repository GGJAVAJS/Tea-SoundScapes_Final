const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// The typical pattern is: isSpaceTheme ? 'something_yellow' : isDinoTheme ? 'something_green' : 'something_blue'
// Or sometimes isCarsTheme ? '...' : isSpaceTheme ? '...' : isDinoTheme ? '...' : '...'
// I want to just replace `isSpaceTheme ? '...' : ` with nothing, so it just skips space theme.
// But we need to be careful with nested templates.
// Actually, it's easier to just string replace '#FFE838' to '#38bdf8' when it's next to isSpaceTheme.

code = code.replace(/isSpaceTheme \? '([^']*)' :/g, (match, p1) => {
    // If it has #FFE838, replace with accent-blue equivalents
    let newStr = p1.replace(/#FFE838/g, '#38bdf8');
    // also replace bg-[#FFE838]/... with bg-accent-blue/...
    newStr = newStr.replace(/bg-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'bg-accent-blue/$1');
    newStr = newStr.replace(/border-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'border-accent-blue/$1');
    newStr = newStr.replace(/text-\[#FFE838\]/g, 'text-accent-blue');
    newStr = newStr.replace(/ring-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'ring-accent-blue/$1');
    return `isSpaceTheme ? '${newStr}' :`;
});

// For stopColor inside SVG:
code = code.replace(/isSpaceTheme \? "#FFE838" :/g, 'isSpaceTheme ? "#38bdf8" :');

fs.writeFileSync('src/views/DiaryView.tsx', code);
