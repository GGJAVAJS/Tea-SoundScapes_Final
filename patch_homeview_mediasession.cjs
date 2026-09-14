const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

code = code.replace(
  "import { setVolume, setEQ, preloadSounds, toggleGlobalPause  } from '../lib/audioEngine';",
  "import { setVolume, setEQ, preloadSounds, toggleGlobalPause, updateMediaSession } from '../lib/audioEngine';"
);

const hookCode = `
  useEffect(() => {
    updateMediaSession(dominantLabel || 'TEA SoundScapes');
  }, [dominantLabel, activeSoundIds]);

  useEffect(() => {
    const onPlay = () => setIsGlobalPause(false);
    const onPause = () => setIsGlobalPause(true);
    const onStop = () => {
      // Clear sounds? Or just let state update naturally?
      // Since audioEngine stopped everything, activeSoundIds might be out of sync.
      // But we can just set global pause to true for now.
      setIsGlobalPause(true);
    };

    window.addEventListener('mediaSessionPlay', onPlay);
    window.addEventListener('mediaSessionPause', onPause);
    window.addEventListener('mediaSessionStop', onStop);

    return () => {
      window.removeEventListener('mediaSessionPlay', onPlay);
      window.removeEventListener('mediaSessionPause', onPause);
      window.removeEventListener('mediaSessionStop', onStop);
    };
  }, []);
`;

const insertPos = code.indexOf('const [isGlobalPause, setIsGlobalPause] = useState(false);');
if (insertPos !== -1) {
  // Insert hookCode after this line
  const endOfLine = code.indexOf('\n', insertPos);
  code = code.substring(0, endOfLine + 1) + hookCode + code.substring(endOfLine + 1);
}

fs.writeFileSync('src/views/HomeView.tsx', code);
