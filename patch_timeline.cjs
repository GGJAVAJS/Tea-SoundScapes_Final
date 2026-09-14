const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const oldTimelineEmoji = `<span className={\`font-semibold flex items-center gap-1 \${isSpaceTheme ? 'text-[#602EC9]' : 'text-accent-blue'}\`}>{emoji} {dateStr}</span>`;
const newTimelineEmoji = `<span className={\`font-semibold flex items-center gap-1 \${isSpaceTheme ? 'text-[#602EC9]' : 'text-accent-blue'}\`}>
                            {isSpaceTheme ? <AstronautMood mood={r.moodId} /> : emoji} {dateStr}
                          </span>`;

code = code.replace(oldTimelineEmoji, newTimelineEmoji);

fs.writeFileSync('src/views/DiaryView.tsx', code);
