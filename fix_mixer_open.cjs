const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /\{isMixerOpen \{isMixerOpen && themeMode === 'child' && \(\{isMixerOpen && themeMode === 'child' && \( \(/;
code = code.replace(regex, "{isMixerOpen && (");

fs.writeFileSync('src/views/HomeView.tsx', code);
