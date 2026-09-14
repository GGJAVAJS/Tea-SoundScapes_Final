const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Replace the gradient
content = content.replace(
  'className="w-3 h-32 bg-gradient-to-t from-[#cbd5e1] to-[#ef4444] border border-[#cbd5e1]"',
  'className="w-3 h-32 border border-[#cbd5e1]" style={{ background: "linear-gradient(to top, #cbd5e1, #ef4444)" }}'
);

// Replace shadow-sm
content = content.replace(
  'className="border border-[#94a3b8] mb-8 rounded shadow-sm"',
  'className="border border-[#94a3b8] mb-8 rounded"'
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed gradient and shadow');
