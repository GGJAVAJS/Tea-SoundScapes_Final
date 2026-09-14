import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<GuardianView \s*monitorActive=\{guardianMonitorActive\}/,
  `<GuardianView 
                onPanic={handlePanicStart}
                monitorActive={guardianMonitorActive}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Success");
