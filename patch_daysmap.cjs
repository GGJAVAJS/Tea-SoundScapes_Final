const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  `const daysMap: Record<string, { date: number, crises: number, emojis: string[] }> = {};`,
  `const daysMap: Record<string, { date: number, crises: number, emojis: string[], moodIds: string[], dateStr: string }> = {};`
);

code = code.replace(
  `if (!daysMap[dStr]) daysMap[dStr] = { date: r.date, crises: 0, emojis: [] };`,
  `if (!daysMap[dStr]) daysMap[dStr] = { date: r.date, crises: 0, emojis: [], moodIds: [], dateStr: dStr };`
);

code = code.replace(
  `daysMap[dStr].emojis.push(MOODS.find(m => m.id === r.moodId)?.emoji || '😐');`,
  `daysMap[dStr].emojis.push(MOODS.find(m => m.id === r.moodId)?.emoji || '😐');
    daysMap[dStr].moodIds.push(r.moodId);`
);

code = code.replace(
  `<span className="text-sm">{d.emojis.slice(-1)[0]}</span>`,
  `<span className="text-sm">{isSpaceTheme && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} /> : d.emojis.slice(-1)[0]}</span>`
);

code = code.replace(
  `<span className="text-sm">{d.emojis.slice(-1)[0]}</span>`,
  `<span className="text-sm">{isSpaceTheme && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} /> : d.emojis.slice(-1)[0]}</span>`
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
