import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const regex = /playSound\('natureza'\);\s+playSound\('vento'\);/;
const cleanupRegex = /stopSound\('natureza'\);\s+stopSound\('vento'\);/;

if (code.match(regex) && code.match(cleanupRegex)) {
  code = code.replace(
    regex,
    `if (isCarsTheme) {
      playSound('chuva');
      playSound('ruido_rosa');
    } else {
      playSound('natureza');
      playSound('vento');
    }`
  );
  
  code = code.replace(
    cleanupRegex,
    `if (isCarsTheme) {
        stopSound('chuva');
        stopSound('ruido_rosa');
      } else {
        stopSound('natureza');
        stopSound('vento');
      }`
  );
  
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not matched");
}
