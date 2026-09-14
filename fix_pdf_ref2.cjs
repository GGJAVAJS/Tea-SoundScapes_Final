const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Replace correctly
content = content.replace(
  /<div ref=\{printRef\} className="flex flex-col gap-6 p-1">/,
  `<div ref={pdfContainerRef} className="absolute left-[-9999px] top-[-9999px]">
      <PrintableClinicalReport 
        records={records} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isDinoTheme={isDinoTheme}
        stats={stats} chartData={chartData} topStrategies={topStrategies} heatmapData={heatmapData}
        diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} aiInsights={aiInsights}
      />
    </div>
    <div ref={printRef} className="flex flex-col gap-6 p-1">`
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed pdfContainerRef placement');
