const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const newExport = `  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#060b13',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const filename = \`Relatorio_\${dd}-\${mm}-\${yyyy}.pdf\`;
      
      const dataUri = pdf.output('datauristring');
      
      const userEmail = localStorage.getItem('currentUserEmail') || 'guest';
      await saveReport({
        id: Date.now().toString(),
        userEmail,
        date: \`\${dd}/\${mm}/\${yyyy}\`,
        timestamp: Date.now(),
        filename,
        dataUrl: dataUri
      });
      
      alert('Relatório salvo com sucesso na aba "Meus Relatórios".');
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };`;

code = code.replace(
  /const handleExportPDF = async \(\) => \{[\s\S]*?setIsExporting\(false\);\n    \}\n  \};/,
  newExport
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success export PDF');
