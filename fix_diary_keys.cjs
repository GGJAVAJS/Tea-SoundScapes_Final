const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  /{activeTab === 'registro' \? <RegistroView onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isChildAutonomyMode={isChildAutonomyMode} \/> : <AnalisesView isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} \/>}/,
  `{activeTab === 'registro' ? <RegistroView key="registro" onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isChildAutonomyMode={isChildAutonomyMode} /> : <AnalisesView key="analises" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />}`
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
