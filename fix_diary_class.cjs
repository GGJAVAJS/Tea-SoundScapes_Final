const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// The button className had text-5xl or text-4xl
code = code.replace(/className=\{`transition-all \$\{isDinoTheme \? 'text-5xl' : 'text-4xl'\} /g, "className={`transition-all ${isDinoTheme ? 'dinosaur-humor-container' : 'text-4xl'} ");

// The container w-16 h-16 or w-12 h-12
code = code.replace(/\$\{isDinoTheme \? 'w-16 h-16' : 'w-12 h-12'\}/g, "${isDinoTheme ? 'dinosaur-humor-container' : 'w-12 h-12'}");

// The img className: className="w-14 h-14 object-contain drop-shadow-md" -> dinosaur-humor-image
code = code.replace(/className="w-14 h-14 object-contain drop-shadow-md"/g, 'className="dinosaur-humor-image"');
code = code.replace(/className="w-14 h-14 object-contain"/g, 'className="dinosaur-humor-image"');

fs.writeFileSync('src/views/DiaryView.tsx', code);
