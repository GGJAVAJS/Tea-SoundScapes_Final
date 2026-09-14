const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  '<Download className="w-5 h-5" /> {isExporting ? "Gerando..." : "Exportar PDF"}',
  '<Download className="w-5 h-5" /> {isExporting ? "Gerando..." : "Exportar e Salvar PDF"}'
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Export Btn');
