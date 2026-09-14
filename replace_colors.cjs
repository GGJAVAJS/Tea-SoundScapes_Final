const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const map = {
  'text-gray-100': 'text-[#f3f4f6]',
  'text-gray-200': 'text-[#e5e7eb]',
  'text-gray-300': 'text-[#d1d5db]',
  'text-gray-400': 'text-[#9ca3af]',
  'text-gray-500': 'text-[#6b7280]',
  'bg-gray-400': 'bg-[#9ca3af]',
  'bg-gray-500': 'bg-[#6b7280]',
  'text-amber-500': 'text-[#f59e0b]',
  'text-amber-400': 'text-[#fbbf24]',
  'text-amber-200': 'text-[#fde68a]',
  'bg-amber-500': 'bg-[#f59e0b]',
  'border-amber-500': 'border-[#f59e0b]',
  'bg-emerald-500': 'bg-[#10b981]',
  'text-emerald-500': 'text-[#10b981]',
  'text-green-400': 'text-[#4ade80]',
  'bg-green-500': 'bg-[#22c55e]',
  'border-green-500': 'border-[#22c55e]',
  'text-red-400': 'text-[#f87171]',
  'bg-red-400': 'bg-[#f87171]',
  'bg-blue-500': 'bg-[#3b82f6]',
  'text-blue-500': 'text-[#3b82f6]'
};

Object.keys(map).forEach(key => {
  // Replace using regex to match exact class names
  const regex = new RegExp(key + '(?![a-zA-Z0-9_-])', 'g');
  content = content.replace(regex, map[key]);
});

fs.writeFileSync(file, content);
console.log('Colors replaced in DiaryView.tsx');
