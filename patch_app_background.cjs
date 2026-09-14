const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('FloatingDinoBackground')) {
  code = code.replace(
    "import { OnboardingView } from './views/OnboardingView';",
    "import { OnboardingView } from './views/OnboardingView';\nimport { FloatingDinoBackground } from './components/FloatingDinoBackground';\nimport { FloatingCarsBackground } from './components/FloatingCarsBackground';\nimport { FloatingSpaceBackground } from './components/FloatingSpaceBackground';"
  );
}

const renderHook = `<main className="h-full w-full relative">`;
const newRenderHook = `<main className="h-full w-full relative">
        {themeMode === 'child' && kidsTheme === 'space' && <FloatingSpaceBackground />}
        {themeMode === 'child' && kidsTheme === 'dino' && <FloatingDinoBackground />}
        {themeMode === 'child' && kidsTheme === 'cars' && <FloatingCarsBackground />}`;

if (!code.includes('<FloatingDinoBackground />')) {
  code = code.replace(renderHook, newRenderHook);
}

fs.writeFileSync('src/App.tsx', code);
