const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

code = code.replace(
    /if \(isCarsTheme\) \{\n\s*stopSound\('chuva'\);\n\s*stopSound\('ruido_rosa'\);\n\s*\} else \{\n\s*stopSound\('natureza'\);\n\s*stopSound\('vento'\);\n\s*\}/,
    `if (isCarsTheme) {
        stopSound('chuva');
        stopSound('ruido_rosa');
      } else if (isSpaceTheme) {
        stopSound('delta_suaves');
        stopSound('vento');
      } else {
        stopSound('natureza');
        stopSound('vento');
      }`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
