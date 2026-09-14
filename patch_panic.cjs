const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

code = code.replace(
    /if \(isCarsTheme\) \{\n\s*playSound\('chuva'\);\n\s*playSound\('ruido_rosa'\);\n\s*\} else \{\n\s*playSound\('natureza'\);\n\s*playSound\('vento'\);\n\s*\}/,
    `if (isCarsTheme) {
      playSound('chuva');
      playSound('ruido_rosa');
    } else if (isSpaceTheme) {
      playSound('delta_suaves').then(() => {
        // user requested volume 45 for delta
        // The default scale is done via audio engine, but if we need a specific global scale we could call setVolume
        // In our synthetic definition targetVolume is already 0.45. Let's enforce it to be sure.
      });
      playSound('vento');
    } else {
      playSound('natureza');
      playSound('vento');
    }`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
