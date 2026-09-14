const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const spaceCondition1 = `{isSpaceTheme ? (
                      <AstronautMood mood={mood.id} />
                    ) : isDinoTheme ? (
                      <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                    ) : (
                      mood.emoji
                    )}`;
                    
const search1 = `{isDinoTheme ? (
                      <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                    ) : (
                      mood.emoji
                    )}`;

const search2 = `{isDinoTheme ? (
                    <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                  ) : (
                    mood.emoji
                  )}`;

const spaceCondition2 = `{isSpaceTheme ? (
                    <AstronautMood mood={mood.id} />
                  ) : isDinoTheme ? (
                    <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                  ) : (
                    mood.emoji
                  )}`;

// replace both occurrences
code = code.replace(search1, spaceCondition1);
code = code.replace(search2, spaceCondition2);

fs.writeFileSync('src/views/DiaryView.tsx', code);
