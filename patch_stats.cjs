const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  `const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };`,
  `const avgMoodId = recentRecords.length === 0 ? null : (MOODS.find(m => avgIntensity >= m.min && avgIntensity <= m.max)?.id);
  const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend, moodId: avgMoodId };`
);

const searchStatsRender = `{ v: stats.mood, l: 'Humor Médio', color: 'text-2xl' },`;
const replaceStatsRender = `{ v: isSpaceTheme && stats.moodId ? <AstronautMood mood={stats.moodId} /> : stats.mood, l: 'Humor Médio', color: 'text-2xl flex items-center justify-center' },`;

code = code.replace(searchStatsRender, replaceStatsRender);

fs.writeFileSync('src/views/DiaryView.tsx', code);
