const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

// replace import
code = code.replace("import { playSound, stopSound } from '../lib/audioEngine';", "import { playSound, stopSound, setVolume } from '../lib/audioEngine';");

code = code.replace(
    /if \(isCarsTheme\) \{[\s\S]*?\} else if \(isSpaceTheme\) \{[\s\S]*?\} else \{[\s\S]*?playSound\('vento'\);\n\s*\}/,
    `if (isCarsTheme) {
      playSound('chuva');
      playSound('ruido_rosa');
    } else if (isSpaceTheme) {
      playSound('delta_suaves').then(() => setVolume('delta_suaves', 0.45));
      playSound('vento').then(() => setVolume('vento', 0.50));
    } else {
      playSound('natureza');
      playSound('vento');
    }`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
