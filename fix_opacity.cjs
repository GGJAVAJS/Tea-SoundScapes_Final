const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const opacities = {
  'bg-white/5': 'bg-[rgba(255,255,255,0.05)]',
  'bg-white/10': 'bg-[rgba(255,255,255,0.1)]',
  'bg-white/20': 'bg-[rgba(255,255,255,0.2)]',
  'border-white/5': 'border-[rgba(255,255,255,0.05)]',
  'border-white/10': 'border-[rgba(255,255,255,0.1)]',
  'border-white/20': 'border-[rgba(255,255,255,0.2)]',
  
  'bg-black/20': 'bg-[rgba(0,0,0,0.2)]',
  'bg-black/30': 'bg-[rgba(0,0,0,0.3)]',
  'bg-black/50': 'bg-[rgba(0,0,0,0.5)]',
  
  // Custom colors with opacity
  'bg-accent-blue/5': 'bg-[rgba(56,189,248,0.05)]',
  'bg-accent-blue/10': 'bg-[rgba(56,189,248,0.1)]',
  'bg-accent-blue/20': 'bg-[rgba(56,189,248,0.2)]',
  'bg-accent-blue/30': 'bg-[rgba(56,189,248,0.3)]',
  'bg-accent-blue/50': 'bg-[rgba(56,189,248,0.5)]',
  'border-accent-blue/20': 'border-[rgba(56,189,248,0.2)]',
  'border-accent-blue/30': 'border-[rgba(56,189,248,0.3)]',
  'border-accent-blue/50': 'border-[rgba(56,189,248,0.5)]',
  'border-accent-blue/79': 'border-[rgba(56,189,248,0.79)]',
  'ring-accent-blue/50': 'ring-[rgba(56,189,248,0.5)]',
  'text-accent-blue/79': 'text-[rgba(56,189,248,0.79)]',
  'bg-accent-blue/40': 'bg-[rgba(56,189,248,0.4)]',
  'border-accent-blue/79': 'border-[rgba(56,189,248,0.79)]',
  
  'bg-[#f59e0b]/10': 'bg-[rgba(245,158,11,0.1)]',
  
  'bg-[#22c55e]/5': 'bg-[rgba(34,197,94,0.05)]',
  'bg-[#22c55e]/10': 'bg-[rgba(34,197,94,0.1)]',
  'border-[#22c55e]/20': 'border-[rgba(34,197,94,0.2)]',
  
  'bg-danger-panic/5': 'bg-[rgba(244,63,94,0.05)]',
  'border-danger-panic/20': 'border-[rgba(244,63,94,0.2)]',
  
  // Theme colors
  'bg-[#602EC9]/10': 'bg-[rgba(96,46,201,0.1)]',
  'bg-[#602EC9]/20': 'bg-[rgba(96,46,201,0.2)]',
  'bg-[#602EC9]/30': 'bg-[rgba(96,46,201,0.3)]',
  'bg-[#602EC9]/40': 'bg-[rgba(96,46,201,0.4)]',
  'bg-[#602EC9]/50': 'bg-[rgba(96,46,201,0.5)]',
  'border-[#602EC9]/79': 'border-[rgba(96,46,201,0.79)]',
  'border-[#602EC9]/50': 'border-[rgba(96,46,201,0.5)]',
  'text-[#602EC9]/79': 'text-[rgba(96,46,201,0.79)]',
  'ring-[#602EC9]/50': 'ring-[rgba(96,46,201,0.5)]',
  
  'bg-[#80F356]/10': 'bg-[rgba(128,243,86,0.1)]',
  'bg-[#80F356]/20': 'bg-[rgba(128,243,86,0.2)]',
  'bg-[#80F356]/25': 'bg-[rgba(128,243,86,0.25)]',
  'bg-[#80F356]/30': 'bg-[rgba(128,243,86,0.3)]',
  'bg-[#80F356]/40': 'bg-[rgba(128,243,86,0.4)]',
  'bg-[#80F356]/50': 'bg-[rgba(128,243,86,0.5)]',
  'border-[#80F356]/50': 'border-[rgba(128,243,86,0.5)]',
  'border-[#80F356]/79': 'border-[rgba(128,243,86,0.79)]',
  'text-[#80F356]/79': 'text-[rgba(128,243,86,0.79)]',
  
  'bg-[#FFE838]/[.88]': 'bg-[rgba(255,232,56,0.88)]',
  'border-[#FFE838]/[.88]': 'border-[rgba(255,232,56,0.88)]',
  'text-[#FFE838]/[.88]': 'text-[rgba(255,232,56,0.88)]',
  
  'text-amber-200/90': 'text-[rgba(253,230,138,0.9)]',
  'text-[#fde68a]/90': 'text-[rgba(253,230,138,0.9)]'
};

Object.keys(opacities).forEach(key => {
  // Be careful with escape characters for regex. I'll use simple string replace in a loop
  let parts = content.split(key);
  content = parts.join(opacities[key]);
});

fs.writeFileSync(file, content);
console.log('Opacity classes fixed');
