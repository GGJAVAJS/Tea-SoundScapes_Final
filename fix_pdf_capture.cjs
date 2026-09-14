const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const oldHandleExportPDF = `const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(pdfContainerRef.current!, {
        scale: 2,
        backgroundColor: '#060b13',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(297, pdfHeight)], // ensure at least A4 height
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);`;

const newHandleExportPDF = `const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfContainerRef.current;
      const originalCss = el.style.cssText;
      el.style.position = 'fixed';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.zIndex = '-9999';
      
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#060b13',
        useCORS: true,
      });
      
      el.style.cssText = originalCss;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Fallback check para PNG invalido ou canvas vazio
      if (imgData === 'data:,' || !imgData.startsWith('data:image/png;base64,')) {
        throw new Error('Erro: O motor do PDF gerou uma imagem inválida ou vazia.');
      }
      
      const pdfWidth = 210;
      // Handle division by zero
      const validWidth = canvas.width > 0 ? canvas.width : 800;
      const pdfHeight = (canvas.height * pdfWidth) / validWidth;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(297, pdfHeight)], // ensure at least A4 height
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);`;

content = content.replace(oldHandleExportPDF, newHandleExportPDF);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed PDF capture flow.');
