const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

content = content.replace(
  /<div ref=\{pdfContainerRef\} className="absolute left-\[-9999px\] top-\[-9999px\]">/,
  '<div ref={pdfContainerRef} className="absolute top-0 left-0 -z-50 w-[800px]" style={{ visibility: "visible" }}>'
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed pdfContainerRef visibility');
