const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const regexAstronaut = /const AstronautMood = \(\{ mood \}: \{ mood: string \}\) => \{[\s\S]*?^\};\n/m;

const newAstronaut = `const AstronautMood = ({ mood }: { mood: string }) => {
  let imgSrc = '';
  switch (mood) {
    case 'great':
      imgSrc = '/happy-astronaut.png';
      break;
    case 'good':
      imgSrc = '/astronaut-calm.png';
      break;
    case 'neutral':
      imgSrc = '/alien_neutral.png';
      break;
    case 'bad':
      imgSrc = '/alien_sad.png';
      break;
    case 'terrible':
      imgSrc = '/alien_rage.png';
      break;
    default:
      imgSrc = '/alien_neutral.png';
  }
  return <img src={imgSrc} alt={mood} className="w-[1.2em] h-[1.2em] object-contain drop-shadow-md" />;
};
`;

code = code.replace(regexAstronaut, newAstronaut);

fs.writeFileSync('src/views/DiaryView.tsx', code);
