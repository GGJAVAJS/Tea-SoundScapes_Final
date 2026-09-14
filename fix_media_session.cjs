const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const hookRegex = /  useEffect\(\(\) => \{\n    updateMediaSession\(dominantLabel \|\| 'TEA SoundScapes'\);\n  \}, \[dominantLabel, activeSoundIds\]\);\n\n  useEffect\(\(\) => \{\n    const onPlay = \(\) => setIsGlobalPause\(false\);\n    const onPause = \(\) => setIsGlobalPause\(true\);\n    const onStop = \(\) => \{\n      \/\/ Clear sounds\? Or just let state update naturally\?\n      \/\/ Since audioEngine stopped everything, activeSoundIds might be out of sync\.\n      \/\/ But we can just set global pause to true for now\.\n      setIsGlobalPause\(true\);\n    \};\n\n    window\.addEventListener\('mediaSessionPlay', onPlay\);\n    window\.addEventListener\('mediaSessionPause', onPause\);\n    window\.addEventListener\('mediaSessionStop', onStop\);\n\n    return \(\) => \{\n      window\.removeEventListener\('mediaSessionPlay', onPlay\);\n      window\.removeEventListener\('mediaSessionPause', onPause\);\n      window\.removeEventListener\('mediaSessionStop', onStop\);\n    \};\n  \}, \[\]\);\n/m;

const match = code.match(hookRegex);
if (match) {
  code = code.replace(match[0], '');
  const insertTarget = "const dominantLabel = dominantSoundId ? allMixerSounds.find(s => s.id === dominantSoundId)?.label : 'Silêncio';";
  code = code.replace(insertTarget, insertTarget + '\n' + match[0]);
  fs.writeFileSync('src/views/HomeView.tsx', code);
}
