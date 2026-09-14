const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Remove isCarsTheme condition for Moods
code = code.replace(
  /{isCarsTheme \? \([\s\S]*?<CarsFuelTank intensity={intensity} setIntensity={setIntensity} \/>[\s\S]*?\) : \([\s\S]*?<div className="flex justify-between items-center px-2">/,
  '<div className="flex justify-between items-center px-2">'
);

// Remove the closing parenthesis of the ternary
code = code.replace(
  /<\/button>\s*}\)\s*}\s*<\/div>\s*\)\s*}/,
  '</button>\n            ))}\n          </div>'
);

// Remove isCarsTheme condition for the Slider
code = code.replace(
  /{!isCarsTheme && \(\s*<div className="mt-4">/,
  '<div className="mt-4">'
);

code = code.replace(
  /<\/div>\s*\)\s*}/,
  '</div>'
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Registro Cars');
