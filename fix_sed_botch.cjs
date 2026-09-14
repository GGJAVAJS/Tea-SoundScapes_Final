const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /\{activeSoundIds\.length > 0.*?isMixerOpen.*?child.*?\( \(/g;
code = code.replace(regex, "{activeSoundIds.length > 0 && !isMixerOpen && themeMode === 'child' && (");

// Actually, let's just find the AnimatePresence and replace everything until the motion.div
const fullRegex = /<AnimatePresence>[\s\S]*?<motion\.div/;
const fixed = `<AnimatePresence>
          {activeSoundIds.length > 0 && !isMixerOpen && themeMode === 'child' && (
            <motion.div`;

code = code.replace(fullRegex, fixed);

fs.writeFileSync('src/views/HomeView.tsx', code);
