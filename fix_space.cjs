const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(/isSpaceTheme \? '([^']*)' :/g, (match, p1) => {
    let newStr = p1.replace(/#FFE838/g, '#38bdf8');
    newStr = newStr.replace(/bg-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'bg-accent-blue/$1');
    newStr = newStr.replace(/bg-\[#FFE838\]/g, 'bg-accent-blue');
    newStr = newStr.replace(/border-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'border-accent-blue/$1');
    newStr = newStr.replace(/text-\[#FFE838\]/g, 'text-accent-blue');
    newStr = newStr.replace(/ring-\[#FFE838\]\/(\d+|\[\.[0-9]+\])/g, 'ring-accent-blue/$1');
    return `isSpaceTheme ? '${newStr}' :`;
});

code = code.replace(/isSpaceTheme \? "#FFE838" :/g, 'isSpaceTheme ? "#38bdf8" :');

fs.writeFileSync('src/views/DiaryView.tsx', code);
