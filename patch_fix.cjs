const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

const regex = /\/\/ Audio triggering on alert removed as requested[\s\S]*?\}, \[isAlert, isChildTheme, interventionActive\]\);/m;

code = code.replace(regex, `// Audio triggering logic removed as requested.`);

fs.writeFileSync('src/views/GuardianView.tsx', code);
