const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Fix the container
const oldContainer = `<div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden' }}>
      <div ref={pdfContainerRef}>`;
const newContainer = `<div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
      <div ref={pdfContainerRef}>`;

content = content.replace(oldContainer, newContainer);

// Fix the handler
const oldHandler = `const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfContainerRef.current;
      
      // Delay so React has time to ensure everything is painted
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });`;

const newHandler = `const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfContainerRef.current;
      const parent = el.parentElement;
      const originalCss = parent.style.cssText;
      parent.style.position = 'fixed';
      parent.style.left = '0px';
      parent.style.top = '0px';
      parent.style.zIndex = '-9999';
      
      // Delay so React has time to ensure everything is painted
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      
      parent.style.cssText = originalCss;`;

content = content.replace(oldHandler, newHandler);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed PDF capture logic');
