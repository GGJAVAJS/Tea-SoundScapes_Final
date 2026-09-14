const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /\{activeSoundIds\.length > 0 && !isMixerOpen && themeMode === 'child' && \(\s*<motion\.div\s*initial=\{\{ opacity: 0, y: 20 \}\}/;
code = code.replace(regex, "{activeSoundIds.length > 0 && (\n            <motion.div \n                  initial={{ opacity: 0, y: 20 }}");

fs.writeFileSync('src/views/HomeView.tsx', code);
