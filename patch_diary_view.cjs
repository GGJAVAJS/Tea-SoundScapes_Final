const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

// Update AnalisesView props to include themeMode
code = code.replace(
  'function AnalisesView({ isDinoTheme, isSpaceTheme, isCarsTheme,',
  'function AnalisesView({ isDinoTheme, isSpaceTheme, isCarsTheme, themeMode,'
);

code = code.replace(
  'records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {',
  'records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean, themeMode?: string }) {'
);

// Pass themeMode in fetch
code = code.replace(
  'body: JSON.stringify({ records })',
  'body: JSON.stringify({ records, themeMode })'
);

// Pass themeMode from DiaryView to AnalisesView
code = code.replace(
  '<AnalisesView key="analises" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />',
  '<AnalisesView key="analises" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} themeMode={themeMode} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />'
);

// Fix background color of the cards in AnalisesView (PDF container)
code = code.replace(
  /className="bg-\[rgba\(255,255,255,0\.05\)\] rounded-xl border border-\[rgba\(255,255,255,0\.05\)\] overflow-hidden relative"/g,
  'className="glass-card-active rounded-xl overflow-hidden relative"'
);

// Fix background color of the cards in AnalisesView (Visual container)
code = code.replace(
  /className="bg-\[rgba\(255,255,255,0\.05\)\] rounded-xl border border-\[rgba\(255,255,255,0\.05\)\] overflow-hidden relative transition-all duration-300"/g,
  'className="glass-card-active rounded-xl overflow-hidden relative transition-all duration-300"'
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
