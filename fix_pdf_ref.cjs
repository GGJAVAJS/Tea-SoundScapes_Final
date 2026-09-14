const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Revert the wrong replacement:
content = content.replace(
  /<div ref=\{pdfContainerRef\} className="absolute left-\[-9999px\] top-\[-9999px\]">\s*<PrintableClinicalReport[\s\S]*?\/>\s*<\/div>\s*<motion\.div/,
  '<motion.div'
);

// We want to insert it in AnalisesView. Let's find AnalisesView's `<motion.div`
// It looks like:
// function AnalisesView(...) {
//   ...
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
//       <div ref={printRef} ...

content = content.replace(
  /<div ref=\{printRef\} className="flex flex-col gap-4">/,
  `<div ref={pdfContainerRef} className="absolute left-[-9999px] top-[-9999px]">
      <PrintableClinicalReport 
        records={records} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isDinoTheme={isDinoTheme}
        stats={stats} chartData={chartData} topStrategies={topStrategies} heatmapData={heatmapData}
        diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} aiInsights={aiInsights}
      />
    </div>
    <div ref={printRef} className="flex flex-col gap-4">`
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed pdfContainerRef placement');
