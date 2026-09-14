const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// Find the useEffect block
const useEffectRegex = /  useEffect\(\(\) => \{\n    updateMediaSession\(dominantLabel \|\| 'TEA SoundScapes'\);\n  \}, \[dominantLabel, activeSoundIds\]\);\n\n  useEffect\(\(\) => \{\n    const onPlay[\s\S]*?\}, \[\]\);\n/;
const match = code.match(useEffectRegex);
if (match) {
  // Remove it from current position
  code = code.replace(match[0], '');
  // Insert it right before "return ("
  const returnIdx = code.indexOf('return (\n    <>');
  if (returnIdx !== -1) {
    code = code.substring(0, returnIdx) + match[0] + code.substring(returnIdx);
  } else {
      const returnIdx2 = code.indexOf('return (');
      code = code.substring(0, returnIdx2) + match[0] + code.substring(returnIdx2);
  }
}

fs.writeFileSync('src/views/HomeView.tsx', code);
