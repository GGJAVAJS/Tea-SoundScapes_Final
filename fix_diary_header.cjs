const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const regex = /<header className="mb-6">[\s\S]*?<\/header>/;
const match = code.match(regex);
if (match) {
  code = code.replace(
    regex,
    `{!isChildAutonomyMode && (
      <header className="mb-6">
        <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold text-gray-100 tracking-tight">Diário Terapêutico</h1>
      </header>
      )}`
  );
  fs.writeFileSync('src/views/DiaryView.tsx', code);
  console.log('Success DiaryView');
} else {
  console.log('Not found header');
}
