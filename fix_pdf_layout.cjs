const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Replace PrintableClinicalReport completely
const reportRegex = /function PrintableClinicalReport\([\s\S]*?\)\s*\{\s*(const locationKeywords[\s\S]*?|)return \([\s\S]*?\n\s*\);\s*\}/;

const newPrintableComponent = `function PrintableClinicalReport({ 
  records, isSpaceTheme, isCarsTheme, isDinoTheme, 
  stats, chartData, topStrategies, heatmapData, 
  diasComCrises, diasSemCrises, timelineRecords, aiInsights 
}: any) {
  
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  let maxHeat = 0;
  heatmapData.forEach((row: number[]) => row.forEach(v => { if (v > maxHeat) maxHeat = v; }));
  if (maxHeat === 0) maxHeat = 1;

  const maxStrategyCount = topStrategies.length > 0 ? Math.max(...topStrategies.map((s:any) => s.count)) : 1;

  return (
    <div className="bg-white text-black p-10 w-[800px] font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="flex gap-1 items-end h-8">
             <div className="w-1.5 h-4 bg-slate-800"></div>
             <div className="w-1.5 h-6 bg-slate-600"></div>
             <div className="w-1.5 h-8 bg-blue-500"></div>
             <div className="w-1.5 h-5 bg-slate-400"></div>
             <div className="w-1.5 h-7 bg-blue-400"></div>
           </div>
           <div className="flex flex-col ml-2 leading-none">
             <span className="text-2xl font-bold text-slate-800 tracking-wider">TEA</span>
             <span className="text-sm font-semibold text-blue-600">SoundScapes</span>
           </div>
        </div>
        <div className="w-full h-0.5 bg-slate-300 mt-2"></div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6 text-slate-900">Relatório Clínico - [cite: Nome do Paciente]</h1>

      {/* Table */}
      <table className="w-full border-collapse border border-slate-400 mb-6 text-sm">
        <tbody>
          <tr>
            <td className="border border-slate-400 bg-slate-200 font-bold p-2 w-1/4 text-slate-800">Pacient ID</td>
            <td className="border border-slate-400 p-2 w-1/4">57878900</td>
            <td className="border border-slate-400 bg-slate-200 font-bold p-2 w-1/4 text-slate-800">Dotaigrilo</td>
            <td className="border border-slate-400 p-2 w-1/4">1</td>
          </tr>
          <tr>
            <td className="border border-slate-400 bg-slate-200 font-bold p-2 text-slate-800">Periodo</td>
            <td className="border border-slate-400 p-2" colSpan={3}>June 1-15, 2026</td>
          </tr>
          <tr>
            <td className="border border-slate-400 bg-slate-200 font-bold p-2 text-slate-800">Terapeuta</td>
            <td className="border border-slate-400 p-2" colSpan={3}>Dr. Silva</td>
          </tr>
        </tbody>
      </table>

      {/* AI Summary */}
      <div className="border border-slate-400 mb-8 rounded shadow-sm">
        <div className="bg-slate-300 font-bold text-lg p-2 border-b border-slate-400 text-slate-900">
          Resumo Analítico da IA (Para o Terapeuta)
        </div>
        <div className="p-4 text-sm text-slate-800 leading-relaxed">
          <span className="font-bold">Padrão identificado:</span> 80% dos eventos de humor baixo (escore 1-2) ocorreram pela manhã (6h-12h), fortemente atrelados ao gatilho 'Transporte Publico'. Recomenda-se a exploração de estratégias de regulação acústica antes do embarque.
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-10 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-slate-900 text-center">Mapa de Calor de Horários (Heatmap)</h2>
        <div className="flex items-start gap-4">
          
          <div className="flex flex-col">
            <div className="flex">
              <div className="w-16"></div>
              {['Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.', 'Dom.'].map((d, i) => (
                <div key={i} className="w-12 text-center text-xs text-slate-700 mb-1">{d}</div>
              ))}
            </div>
            
            <div className="flex">
               <div className="flex flex-col justify-around text-xs text-slate-700 pr-2 relative w-16">
                 <span className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold tracking-widest">Hora</span>
                 <div className="h-12 flex items-center justify-end">Madruga</div>
                 <div className="h-12 flex items-center justify-end">Manhã</div>
                 <div className="h-12 flex items-center justify-end">Tarde</div>
                 <div className="h-12 flex items-center justify-end">Noite</div>
               </div>
               
               <div className="flex flex-col gap-0.5 relative">
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold tracking-widest text-slate-700">Dia</div>
                 {heatmapData.map((row: number[], rIdx: number) => (
                   <div key={rIdx} className="flex gap-0.5">
                     {row.map((val: number, cIdx: number) => {
                        const intensity = val / maxHeat;
                        const bgColor = val === 0 ? '#cbd5e1' : \`rgba(239, 68, 68, \${Math.max(0.3, intensity)})\`;
                        return (
                          <div 
                            key={cIdx} 
                            className="w-12 h-12 flex items-center justify-center text-slate-800 text-xs border border-white"
                            style={{ backgroundColor: bgColor }}
                          >
                            {val > 0 ? val : ''}
                          </div>
                        )
                     })}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-6 ml-4 relative">
            <span className="text-[10px] text-slate-700 mb-1">Frequência crisis</span>
            <div className="flex items-center">
               <div className="w-3 h-32 bg-gradient-to-t from-slate-300 to-red-500 border border-slate-300"></div>
               <div className="flex flex-col justify-between h-32 ml-1 text-[10px] text-slate-600">
                  <span>{maxHeat}</span>
                  <span>{Math.ceil(maxHeat * 0.8)}</span>
                  <span>{Math.ceil(maxHeat * 0.6)}</span>
                  <span>{Math.ceil(maxHeat * 0.4)}</span>
                  <span>{Math.ceil(maxHeat * 0.2)}</span>
                  <span>0</span>
               </div>
            </div>
            <span className="text-[10px] text-slate-700 mt-2 -rotate-90 absolute right-[-30px] top-1/2">Frequência de crisis</span>
          </div>
        </div>
      </div>

      {/* Strategies Ranking */}
      <div className="flex flex-col items-center mt-4">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 text-center">Ranking de Estratégias</h2>
        <div className="w-full max-w-md flex flex-col gap-3 border-l-2 border-b-2 border-slate-700 pl-2 pb-2 relative">
           {topStrategies.length > 0 ? topStrategies.map((s: any, i: number) => {
             const widthPercent = (s.count / maxStrategyCount) * 100;
             return (
               <div key={i} className="flex items-center gap-3">
                 <div className="w-32 text-right text-sm text-slate-800 font-medium truncate">{s.label}</div>
                 <div className="flex-1 flex items-center gap-2">
                   <div 
                     className="h-6 bg-[#3b6b8b] border border-slate-800"
                     style={{ width: \`\${Math.max(widthPercent, 5)}%\` }}
                   ></div>
                   <span className="text-xs text-slate-800">[ cite: {s.count} ]</span>
                 </div>
               </div>
             )
           }) : (
             <div className="flex items-center gap-3">
                <div className="w-32 text-right text-sm text-slate-800 font-medium">Meu Refúgio</div>
                <div className="flex-1 flex items-center gap-2"><div className="h-6 bg-[#3b6b8b] border border-slate-800" style={{ width: '90%' }}></div><span className="text-xs text-slate-800">[ cite: 12 ]</span></div>
             </div>
           )}
           
           <div className="flex justify-between text-xs text-slate-600 px-1 pt-1 mt-1" style={{ marginLeft: '136px' }}>
              <span>0</span>
              <span>{Math.ceil(maxStrategyCount / 2)}</span>
              <span>{maxStrategyCount}</span>
           </div>
        </div>
      </div>

    </div>
  );
}`;

content = content.replace(reportRegex, newPrintableComponent);

// Now fix the DOM placement of pdfContainerRef
const oldContainerRegex = /<div ref=\{pdfContainerRef\}[\s\S]*?<PrintableClinicalReport[\s\S]*?\/>\s*<\/div>/;
const newContainer = `<div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden' }}>
      <div ref={pdfContainerRef}>
        <PrintableClinicalReport 
          records={records} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isDinoTheme={isDinoTheme}
          stats={stats} chartData={chartData} topStrategies={topStrategies} heatmapData={heatmapData}
          diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} aiInsights={aiInsights}
        />
      </div>
    </div>`;
content = content.replace(oldContainerRegex, newContainer);

// Fix the handler function
const handleExportRegex = /const handleExportPDF = async \(\) => \{[\s\S]*?const date = new Date\(\);/m;
const newHandleExport = `const handleExportPDF = async () => {
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
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      if (imgData === 'data:,' || !imgData.startsWith('data:image/png;base64,')) {
        throw new Error('Erro: O motor do PDF gerou uma imagem inválida ou vazia.');
      }
      
      const pdfWidth = 210;
      const validWidth = canvas.width > 0 ? canvas.width : 800;
      const pdfHeight = (canvas.height * pdfWidth) / validWidth;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, Math.max(297, pdfHeight)],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const date = new Date();`;

content = content.replace(handleExportRegex, newHandleExport);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('PDF layout and capture method updated successfully.');
