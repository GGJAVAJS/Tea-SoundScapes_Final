const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

if (!code.includes("import { playSound, stopSound }")) {
    code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", 
      "import { motion, AnimatePresence } from 'framer-motion';\nimport { playSound, stopSound } from '../lib/audioEngine';");
}

const effectMatch = `  useEffect(() => {
    if (!isOpen) {
      return;
    }`;
const newEffect = `  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    // Play background sounds
    playSound('natureza');
    playSound('vento');
`;

code = code.replace(effectMatch, newEffect);

const cleanupMatch = `    return () => { 
      cleanup = true; 
    };`;
const newCleanup = `    return () => { 
      cleanup = true; 
      stopSound('natureza');
      stopSound('vento');
    };`;

code = code.replace(cleanupMatch, newCleanup);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
