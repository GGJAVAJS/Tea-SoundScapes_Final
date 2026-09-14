const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

// Update SOUND_CONFIGS map onClick
code = code.replace(
  "onClick={() => handleToggleSound(sound.id)}",
  "onClick={() => { handleToggleSound(sound.id); if (themeMode === 'child') { setIsMixerOpen(true); } }}"
);

// Update importedSounds map onClick
code = code.replace(
  "onClick={() => handleToggleSound(sound.id, sound.url)}",
  "onClick={() => { handleToggleSound(sound.id, sound.url); if (themeMode === 'child') { setIsMixerOpen(true); } }}"
);

fs.writeFileSync('src/views/HomeView.tsx', code);
