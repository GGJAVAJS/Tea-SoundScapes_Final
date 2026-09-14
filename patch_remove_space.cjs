const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /const FloatingSpaceBackground = React\.memo\(\(\) => \{[\s\S]*?\}\);\n/;
code = code.replace(regex, '');

fs.writeFileSync('src/views/HomeView.tsx', code);
