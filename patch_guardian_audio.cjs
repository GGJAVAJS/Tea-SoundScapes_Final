const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

const regex = /\/\/ Audio triggering on alert[\s\S]*?\/\/ Cleanup on unmount/m;

code = code.replace(regex, `// Audio triggering on alert removed as requested
  // Cleanup on unmount`);

fs.writeFileSync('src/views/GuardianView.tsx', code);
