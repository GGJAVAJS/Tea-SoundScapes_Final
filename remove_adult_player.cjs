const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// Remove MoreVertical button in Adult mode entirely
const moreVerticalRegex = /\{themeMode !== 'child' && \(\s*<button\s*onClick=\{\(\) => setIsMixerOpen\(true\)\}\s*aria-label="Abrir Mixer"[\s\S]*?<MoreVertical className="w-6 h-6" \/>\s*<\/button>\s*\)\}/;
code = code.replace(moreVerticalRegex, '');

// Disable Mixagem Ativa bar click in Adult mode
code = code.replace(
  'onClick={() => setIsMixerOpen(true)}',
  'onClick={() => { if (themeMode === \'child\') setIsMixerOpen(true); }}'
);

// We also need to hide the MixerOverlay component entirely for Adult Mode just in case
code = code.replace(
  '{isMixerOpen && (',
  '{isMixerOpen && themeMode === \'child\' && ('
);

fs.writeFileSync('src/views/HomeView.tsx', code);
