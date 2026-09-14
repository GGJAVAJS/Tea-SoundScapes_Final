const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

content = content.replace(
  /<div ref=\{pdfContainerRef\} className="absolute top-0 left-0 -z-50 w-\[800px\]" style=\{\{ visibility: "visible" \}\}>/,
  '<div ref={pdfContainerRef} className="absolute top-0 left-[-9999px] w-[800px]">'
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed pdfContainerRef visibility 2');
