const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const opacities = {
  'focus:ring-[#FFE838]/[.88]': 'focus:ring-[rgba(255,232,56,0.88)]',
  'hover:border-[rgba(255,232,56,0.88)]/50': 'hover:border-[rgba(255,232,56,0.5)]',
  'focus:ring-[#602EC9]/79': 'focus:ring-[rgba(96,46,201,0.79)]',
  'focus:ring-[#80F356]/79': 'focus:ring-[rgba(128,243,86,0.79)]',
  'focus:ring-accent-blue/79': 'focus:ring-[rgba(56,189,248,0.79)]',
  'via-white/10': 'via-[rgba(255,255,255,0.1)]',
  'bg-black/40': 'bg-[rgba(0,0,0,0.4)]',
  'hover:border-[#FFE838]/[.88]/79': 'hover:border-[rgba(255,232,56,0.79)]'
};

Object.keys(opacities).forEach(key => {
  let parts = content.split(key);
  content = parts.join(opacities[key]);
});

fs.writeFileSync(file, content);
console.log('Opacity classes fixed 2');
