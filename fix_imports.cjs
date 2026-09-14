const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Fix 1: update allMixerSounds
const oldAllMixer = "...importedSounds.map(s => ({ id: s.id, label: s.name, icon: Activity }))";
const newAllMixer = "...importedSounds.map(s => ({ id: s.id, label: s.name, icon: getIconComponentForName(s.name) }))";
if (code.includes(oldAllMixer)) {
    code = code.replace(oldAllMixer, newAllMixer);
    console.log("Fixed allMixerSounds");
}

// Fix 2: update rendering in the UI
const oldRenderStart = `{importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          return (`;
const newRenderStart = `{importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          const IconComponent = getIconComponentForName(sound.name);
          return (`;
if (code.includes(oldRenderStart)) {
    code = code.replace(oldRenderStart, newRenderStart);
    console.log("Fixed map start");
}

const oldRenderIcon = `<Activity className={\`w-8 h-8 shrink-0 \${isActive`;
const newRenderIcon = `<IconComponent className={\`w-8 h-8 shrink-0 \${isActive`;
if (code.includes(oldRenderIcon)) {
    code = code.replace(oldRenderIcon, newRenderIcon);
    console.log("Fixed icon tag");
}

fs.writeFileSync('src/views/HomeView.tsx', code);
