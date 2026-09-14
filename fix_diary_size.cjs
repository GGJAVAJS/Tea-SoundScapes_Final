const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// replace the button className
code = code.replace(/className=\{`text-5xl transition-all/g, "className={`transition-all ${isDinoTheme ? 'text-5xl' : 'text-4xl'}");

// replace w-16 h-16 for the span (2 occurrences)
code = code.replace(/w-16 h-16/g, "${isDinoTheme ? 'w-16 h-16' : 'w-12 h-12'}");

fs.writeFileSync('src/views/DiaryView.tsx', code);
