const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to avoid pushing the default 100-intensity panic record if autonomy is on,
// so the kid can record it themselves. If autonomy is off, we leave the auto-record.
const targetPanicRecord = `    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(\`diaryRecords_\${email}\`);
      const records = data ? JSON.parse(data) : [];
      records.push({
        intensity: 100,
        moodId: 'panic',
        triggers: ['SOS Pânico automático'],
        date: Date.now()
      });
      localStorage.setItem(\`diaryRecords_\${email}\`, JSON.stringify(records));
      window.dispatchEvent(new Event('diary-updated'));
    } catch(e) {}`;

const replPanicRecord = `    if (!childAutonomyFilter || themeMode === 'adult') {
      try {
        const email = localStorage.getItem('currentUserEmail');
        const data = localStorage.getItem(\`diaryRecords_\${email}\`);
        const records = data ? JSON.parse(data) : [];
        records.push({
          intensity: 100,
          moodId: 'panic',
          triggers: ['SOS Pânico automático'],
          date: Date.now()
        });
        localStorage.setItem(\`diaryRecords_\${email}\`, JSON.stringify(records));
        window.dispatchEvent(new Event('diary-updated'));
      } catch(e) {}
    }`;

code = code.replace(targetPanicRecord, replPanicRecord);

fs.writeFileSync('src/App.tsx', code);
console.log('patched panic auto record');
