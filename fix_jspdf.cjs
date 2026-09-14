const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const oldJsPDF = `const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);`;

const newJsPDF = `const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(297, pdfHeight)], // ensure at least A4 height
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);`;

content = content.replace(oldJsPDF, newJsPDF);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed jsPDF pagination/height');
