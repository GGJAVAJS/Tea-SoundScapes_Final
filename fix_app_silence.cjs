const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClose=\{\(\) => \{\s*setIsRefugeOpen\(false\);\s*if \(themeMode === 'child' && childAutonomyFilter\) \{\s*setIsPostCrisisDiaryOpen\(true\);\s*\}\s*\}\}/,
  `onClose={() => {
            setIsRefugeOpen(false);
            if (themeMode === 'child' && childAutonomyFilter) {
              setIsPostCrisisDiaryOpen(true);
            } else if (themeMode === 'child' && !childAutonomyFilter) {
              // Silently register pending crisis
              try {
                const email = localStorage.getItem('currentUserEmail');
                const data = localStorage.getItem(\`diaryRecords_\${email}\`);
                const records = data ? JSON.parse(data) : [];
                records.push({
                  intensity: 50,
                  moodId: 'pending',
                  triggers: ['Uso do Refúgio (Pendente)'],
                  estrategiaUsadaString: 'Som Refúgio',
                  observacao: 'Registro automático (Aguardando preenchimento)',
                  date: Date.now()
                });
                localStorage.setItem(\`diaryRecords_\${email}\`, JSON.stringify(records));
                window.dispatchEvent(new Event('diary-updated'));
              } catch(e) {}
            }
          }}`
);

fs.writeFileSync('src/App.tsx', code);
