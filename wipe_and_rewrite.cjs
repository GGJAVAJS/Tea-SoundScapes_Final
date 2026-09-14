const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const findTarget = `      {!isChildAutonomyMode && (<>
      {/* Triggers */}`;

const replaceWith = `      </>)}
      {!isChildAutonomyMode && (
      <>
      {/* Triggers */}`;

code = code.replace(findTarget, replaceWith);

fs.writeFileSync('src/views/DiaryView.tsx', code);
