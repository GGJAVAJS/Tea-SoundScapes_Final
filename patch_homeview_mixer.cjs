const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetArgs = 'function MixerOverlay({ dominantSoundId, dominantLabel, DominantIcon, activeSoundIds, allMixerSounds, volumes, handleVolumeChange, setIsMixerOpen, isGlobalPause, setIsGlobalPause, eq, handleEQChange, themeMode, kidsTheme }) {';
const replArgs = 'function MixerOverlay({ dominantSoundId, dominantLabel, DominantIcon, activeSoundIds, allMixerSounds, volumes, handleVolumeChange, setIsMixerOpen, isGlobalPause, setIsGlobalPause, eq, handleEQChange, themeMode, kidsTheme, onFavorite }) {';

code = code.replace(targetArgs, replArgs);

const targetBtn = '<Bookmark className="w-6 h-6" />';
const replBtn = `<Bookmark className="w-6 h-6" onClick={(e) => { 
  e.stopPropagation(); 
  if (activeSoundIds.length > 0) {
    onFavorite({ 
      id: 'fav_' + Date.now().toString(), 
      name: 'Meu Mix ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      activeSoundIds, 
      volumes, 
      eq,
      dominantSoundId
    });
    alert('Mix Favoritado!');
  } else {
    alert('Selecione pelo menos um som para favoritar!');
  }
}} />`;

code = code.replace(targetBtn, replBtn);

const targetInst = '<MixerOverlay \n               dominantSoundId={dominantSoundId}';
const replInst = `<MixerOverlay \n               onFavorite={saveFavorite}\n               dominantSoundId={dominantSoundId}`;
code = code.replace(targetInst, replInst);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched mixeroverlay');
