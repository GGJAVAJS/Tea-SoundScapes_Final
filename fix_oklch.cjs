const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const startIndex = content.indexOf('function PrintableClinicalReport(');
const endIndex = content.indexOf('function AnalisesView(');

let printableComponent = content.slice(startIndex, endIndex);

const colorMap = {
  'bg-white': 'bg-[#ffffff]',
  'text-black': 'text-[#000000]',
  'bg-slate-800': 'bg-[#1e293b]',
  'bg-slate-600': 'bg-[#475569]',
  'bg-slate-400': 'bg-[#94a3b8]',
  'bg-slate-300': 'bg-[#cbd5e1]',
  'bg-slate-200': 'bg-[#e2e8f0]',
  'text-slate-900': 'text-[#0f172a]',
  'text-slate-800': 'text-[#1e293b]',
  'text-slate-700': 'text-[#334155]',
  'text-slate-600': 'text-[#475569]',
  'border-slate-800': 'border-[#1e293b]',
  'border-slate-700': 'border-[#334155]',
  'border-slate-400': 'border-[#94a3b8]',
  'border-slate-300': 'border-[#cbd5e1]',
  'border-white': 'border-[#ffffff]',
  'bg-blue-600': 'bg-[#2563eb]',
  'bg-blue-500': 'bg-[#3b82f6]',
  'bg-blue-400': 'bg-[#60a5fa]',
  'text-blue-600': 'text-[#2563eb]',
  'from-slate-300': 'from-[#cbd5e1]',
  'to-red-500': 'to-[#ef4444]'
};

for (const [key, value] of Object.entries(colorMap)) {
  const regex = new RegExp(`\\b${key}\\b`, 'g');
  printableComponent = printableComponent.replace(regex, value);
}

content = content.slice(0, startIndex) + printableComponent + content.slice(endIndex);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Replaced all tailwind colors with hex in PrintableClinicalReport to avoid html2canvas oklch error.');
