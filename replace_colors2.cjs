const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const map = {
  'text-emerald-400': 'text-[#34d399]',
  'bg-amber-400': 'bg-[#fbbf24]',
  'text-rose-500': 'text-[#f43f5e]',
  'bg-rose-500': 'bg-[#f43f5e]'
};

Object.keys(map).forEach(key => {
  const regex = new RegExp(key + '(?![a-zA-Z0-9_-])', 'g');
  content = content.replace(regex, map[key]);
});

fs.writeFileSync(file, content);
console.log('Colors replaced in DiaryView.tsx (pass 2)');
