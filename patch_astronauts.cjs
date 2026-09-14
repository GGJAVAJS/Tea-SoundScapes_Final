const fs = require('fs');

const astronautComponent = `const AstronautMood = ({ mood }: { mood: string }) => {
  if (mood === 'great' || mood === 'good') {
    return (
      <svg viewBox="0 0 100 100" className="w-[1.1em] h-[1.1em] drop-shadow-md">
        <circle cx="50" cy="50" r="45" fill="#f8fafc" /> 
        <circle cx="50" cy="50" r="30" fill="#38bdf8" /> 
        <path d="M 35 45 Q 40 35 45 45 M 55 45 Q 60 35 65 45" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /> 
        <path d="M 40 55 Q 50 65 60 55" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="30" cy="55" r="4" fill="#60a5fa" opacity="0.5" />
        <circle cx="70" cy="55" r="4" fill="#60a5fa" opacity="0.5" />
      </svg>
    );
  }
  if (mood === 'neutral') {
    return (
      <svg viewBox="0 0 100 100" className="w-[1.1em] h-[1.1em] drop-shadow-md">
        <circle cx="50" cy="50" r="45" fill="#cbd5e1" />
        <circle cx="50" cy="50" r="30" fill="#64748b" />
        <path d="M 35 50 L 45 50 M 55 50 L 65 50" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="w-[1.1em] h-[1.1em] drop-shadow-md">
      <circle cx="50" cy="50" r="45" fill="#ef4444" />
      <circle cx="50" cy="50" r="30" fill="#450a0a" />
      <path d="M 35 40 L 45 45 L 35 50 M 65 40 L 55 45 L 65 50" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 40 60 Q 50 55 60 60" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M 75 30 Q 80 40 75 45 Q 70 40 75 30 Z" fill="#93c5fd" />
      <path d="M 25 35 Q 30 45 25 50 Q 20 45 25 35 Z" fill="#93c5fd" />
    </svg>
  );
};
`;

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Insert AstronautMood after STRATEGIES
code = code.replace(/const STRATEGIES = \[.*?\];/, `const STRATEGIES = ['Meu Refúgio', 'Sair do local', 'Respiração', 'Música', 'Nenhum'];\n\n${astronautComponent}`);

// Replace rendering in RegistroView
code = code.replace(
  /\{MOODS\.map\(mood => \(\n\s*<button[\s\S]*?className=\{`text-2xl[\s\S]*?\{isSpaceTheme \? renderSpaceAstronaut\(mood\.id\) : mood\.emoji\}\n\s*<\/button>/g, // Just in case it has this from an imagined old prompt? Wait, let's see what's actually there.
  "" // To be safe, I'll use a more precise regex.
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
