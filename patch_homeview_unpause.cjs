const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// Add handleToggleSound if it doesn't exist
if (!code.includes('const handleToggleSound')) {
   const insertionPoint = code.indexOf('const [isGlobalPause, setIsGlobalPause] = useState(false);');
   if (insertionPoint !== -1) {
       const wrapper = `
  const handleToggleSound = (id: string, url?: string) => {
    if (isGlobalPause) setIsGlobalPause(false);
    toggleSound(id, url);
  };
`;
       // insert after isGlobalPause declaration
       const insertIndex = code.indexOf('\n', insertionPoint) + 1;
       code = code.substring(0, insertIndex) + wrapper + code.substring(insertIndex);
       
       // replace onClick={() => toggleSound(...) with onClick={() => handleToggleSound(...)
       // Be careful not to replace it inside handleToggleSound itself or props passing.
       code = code.replace(/onClick=\{\(\) => toggleSound\((.*?)\)\}/g, 'onClick={() => handleToggleSound($1)}');
       code = code.replace(/if \(activeSounds\[sound\.id\]\) toggleSound\(sound\.id\)/g, 'if (activeSounds[sound.id]) handleToggleSound(sound.id)');
       
       fs.writeFileSync('src/views/HomeView.tsx', code);
       console.log("Patched handleToggleSound");
   }
}
