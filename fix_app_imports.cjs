const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const imports = `
import { FloatingDinoBackground } from './components/FloatingDinoBackground';
import { FloatingCarsBackground } from './components/FloatingCarsBackground';
import { FloatingSpaceBackground } from './components/FloatingSpaceBackground';
`;

code = code.replace("import { AnimatePresence } from 'motion/react';", "import { AnimatePresence } from 'motion/react';\n" + imports);

fs.writeFileSync('src/App.tsx', code);
