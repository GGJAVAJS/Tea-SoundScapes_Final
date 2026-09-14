const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const oldSoundButton = `className={\`flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] \${
                isActive ? 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]' : 'glass-card hover:bg-white/10 hover:border-white/20'
              }\`}`;

const newSoundButton = `className={\`flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] \${
                isActive 
                  ? (isDinoTheme 
                    ? 'bg-[#553100]/80 shadow-[0_0_15px_rgba(85,49,0,0.5)] border border-[#80F356]/30' 
                    : isSpaceTheme 
                    ? 'bg-[#602EC9]/40 shadow-[0_0_15px_rgba(96,46,201,0.5)] border border-white/20'
                    : isCarsTheme 
                    ? 'bg-[#FACC15]/20 shadow-[0_0_15px_rgba(250,204,21,0.4)] border border-[#FACC15]/40'
                    : 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]')
                  : (isDinoTheme
                    ? 'bg-[#553100]/30 border-white/10 hover:bg-[#553100]/50'
                    : 'glass-card hover:bg-white/10 hover:border-white/20')
              }\`}`;

const oldIcon = `<sound.icon className={\`w-8 h-8 \${isActive ? 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'text-gray-400'}\`} />`;
const newIcon = `<sound.icon className={\`w-8 h-8 \${isActive 
                ? (isDinoTheme ? 'text-[#80F356] drop-shadow-[0_0_8px_rgba(128,243,86,0.6)]' 
                  : isSpaceTheme ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : isCarsTheme ? 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                  : 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]') 
                : 'text-gray-400'}\`} />`;

if (code.includes(oldSoundButton)) {
  code = code.replace(oldSoundButton, newSoundButton);
}
if (code.includes(oldIcon)) {
  code = code.replace(oldIcon, newIcon);
}

const oldImportedButton = `className={\`w-full flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 \${
                  isActive ? 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'glass-card hover:bg-white/5'
                }\`}`;

const newImportedButton = `className={\`w-full flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 \${
                  isActive 
                  ? (isDinoTheme 
                    ? 'bg-[#553100]/80 shadow-[0_0_15px_rgba(85,49,0,0.5)] border border-[#80F356]/30' 
                    : isSpaceTheme 
                    ? 'bg-[#602EC9]/40 shadow-[0_0_15px_rgba(96,46,201,0.5)] border border-white/20'
                    : isCarsTheme 
                    ? 'bg-[#FACC15]/20 shadow-[0_0_15px_rgba(250,204,21,0.4)] border border-[#FACC15]/40'
                    : 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)]')
                  : (isDinoTheme
                    ? 'bg-[#553100]/30 border-white/10 hover:bg-[#553100]/50'
                    : 'glass-card hover:bg-white/5')
                }\`}`;

const oldImportedIcon = `<Activity className={\`w-8 h-8 shrink-0 \${isActive ? 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'text-gray-400'}\`} />`;
const newImportedIcon = `<Activity className={\`w-8 h-8 shrink-0 \${isActive 
                ? (isDinoTheme ? 'text-[#80F356] drop-shadow-[0_0_8px_rgba(128,243,86,0.6)]' 
                  : isSpaceTheme ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : isCarsTheme ? 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                  : 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]') 
                : 'text-gray-400'}\`} />`;

if (code.includes(oldImportedButton)) {
  code = code.replace(oldImportedButton, newImportedButton);
}
if (code.includes(oldImportedIcon)) {
  code = code.replace(oldImportedIcon, newImportedIcon);
}

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Patched HomeView");
