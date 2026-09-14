const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// 1. Ensure toggleGlobalPause is imported
const importEngineRegex = /import { setVolume, setEQ, preloadSounds([^}]*)} from '\.\.\/lib\/audioEngine';/;
if (code.match(importEngineRegex)) {
  code = code.replace(importEngineRegex, "import { setVolume, setEQ, preloadSounds, toggleGlobalPause$1 } from '../lib/audioEngine';");
} else {
  // if already imported, or generic fallback
  if (!code.includes('toggleGlobalPause')) {
     code = code.replace(/import { setVolume, setEQ, preloadSounds } from '\.\.\/lib\/audioEngine';/, "import { setVolume, setEQ, preloadSounds, toggleGlobalPause } from '../lib/audioEngine';");
  }
}

// 2. We need a useEffect to watch isGlobalPause
if (!code.includes('useEffect(() => { toggleGlobalPause')) {
  code = code.replace(/const \[isGlobalPause, setIsGlobalPause\] = useState\(false\);/, "const [isGlobalPause, setIsGlobalPause] = useState(false);\n  useEffect(() => { toggleGlobalPause && toggleGlobalPause(isGlobalPause); }, [isGlobalPause]);");
}

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Global pause synced.");
