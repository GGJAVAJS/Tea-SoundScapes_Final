const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /records\.push\(\{[\s\S]*?intensity: 100,[\s\S]*?moodId: 'panic',[\s\S]*?triggers: \['SOS Pânico automático'\],[\s\S]*?date: Date\.now\(\)[\s\S]*?\}\);/,
  `records.push({
        intensity: 100,
        moodId: 'panic',
        triggers: ['SOS Pânico automático'],
        estrategiaUsadaString: 'Botão de Pânico',
        observacao: themeMode === 'child' && !childAutonomyFilter ? 'Registro automático (Aguardando preenchimento)' : '',
        date: Date.now()
      });`
);

fs.writeFileSync('src/App.tsx', code);
