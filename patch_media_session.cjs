const fs = require('fs');
let code = fs.readFileSync('src/lib/audioEngine.ts', 'utf-8');

const mediaSessionCode = `
export function updateMediaSession(title: string) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'Mixagem',
      artist: 'TEA SoundScapes',
      album: 'Regulação Sensorial'
    });

    navigator.mediaSession.setActionHandler('play', () => {
      toggleGlobalPause(false);
      window.dispatchEvent(new CustomEvent('mediaSessionPlay'));
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      toggleGlobalPause(true);
      window.dispatchEvent(new CustomEvent('mediaSessionPause'));
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      Object.keys(activeNodes).forEach(id => stopSound(id as any));
      window.dispatchEvent(new CustomEvent('mediaSessionStop'));
    });
  }
}
`;

code = code + '\n' + mediaSessionCode;
fs.writeFileSync('src/lib/audioEngine.ts', code);
