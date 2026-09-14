const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /diaryStartView\?: 'registro'\|'analises'}/g,
  "diaryStartView?: 'registro'|'analises'|'relatorios'}"
);
code = code.replace(
  /diaryStartView, setDiaryStartView\] = useState\<'registro'\|'analises'\>\('registro'\)/g,
  "diaryStartView, setDiaryStartView] = useState<'registro'|'analises'|'relatorios'>('registro')"
);
code = code.replace(
  /diaryStart\?: 'registro'\|'analises'\) => \{/g,
  "diaryStart?: 'registro'|'analises'|'relatorios') => {"
);
code = code.replace(
  /diaryStart: 'registro'\|'analises' = 'registro'/g,
  "diaryStart: 'registro'|'analises'|'relatorios' = 'registro'"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Success App types');
