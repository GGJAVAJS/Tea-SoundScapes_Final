const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

code = code.replace(
  /{themeMode === 'child' && kidsTheme === 'space' && <FloatingSpaceBackground \/>}/g,
  ''
);
code = code.replace(
  /{themeMode === 'child' && kidsTheme === 'dino' && <FloatingDinoBackground \/>}/g,
  ''
);
code = code.replace(
  /{themeMode === 'child' && kidsTheme === 'cars' && <FloatingCarsBackground \/>}/g,
  ''
);

fs.writeFileSync('src/views/HomeView.tsx', code);
