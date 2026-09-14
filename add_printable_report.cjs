const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const printableComponent = `
function PrintableClinicalReport({ 
  records, isSpaceTheme, isCarsTheme, isDinoTheme, 
  stats, chartData, topStrategies, heatmapData, 
  diasComCrises, diasSemCrises, timelineRecords, aiInsights 
}: any) {
  const locationKeywords = ['escola', 'shopping', 'transporte', 'rua', 'festa', 'faculdade', 'trabalho', 'onibus', 'ônibus', 'carro'];
  const triggerCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  
  records.forEach((r: any) => {
    if (r.intensity >= 60) {
      r.triggers.forEach((t: string) => {
        const isLoc = locationKeywords.some(k => t.toLowerCase().includes(k));
        if (isLoc) {
          locationCounts[t] = (locationCounts[t] || 0) + 1;
        } else {
          triggerCounts[t] = (triggerCounts[t] || 0) + 1;
        }
      });
    }
  });

  const locs = Object.keys(locationCounts).sort((a, b) => locationCounts[b] - locationCounts[a]).slice(0, 5).map(t => ({ label: t, count: locationCounts[t] }));
  const trigs = Object.keys(triggerCounts).sort((a, b) => triggerCounts[b] - triggerCounts[a]).slice(0, 5).map(t => ({ label: t, count: triggerCounts[t] }));

  const dateStr = new Date().toLocaleDateString('pt-BR');
  const themeColor = isSpaceTheme ? '#602EC9' : '#38bdf8';

  return (
    <div id="pdf-report-container" className="absolute top-[-9999px] left-0 w-[800px] bg-[#060b13] p-8 text-[#f3f4f6] flex flex-col gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="text-center mb-2 border-b border-[rgba(255,255,255,0.1)] pb-6">
         <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Relatório Clínico</h1>
         <p className="text-[#9ca3af] text-sm font-medium">Documento gerado em: {dateStr}</p>
      </div>
      
      {/* Resumo Analítico da IA */}
      <div className="bg-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.3)] p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#38bdf8]" /> Resumo Analítico da IA
        </h3>
        {aiInsights?.userInsight ? (
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-medium text-[#9ca3af] mb-1">Análise Comportamental:</h4>
              <p className="text-sm text-[#e5e7eb] leading-relaxed">{aiInsights.userInsight}</p>
            </div>
            {aiInsights?.therapistSummary && (
              <div className="pt-3 border-t border-[rgba(255,255,255,0.1)]">
                <h4 className="text-sm font-medium text-[#38bdf8] mb-1">Nota para o Terapeuta:</h4>
                <p className="text-sm text-[#d1d5db] leading-relaxed italic">{aiInsights.therapistSummary}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#9ca3af]">Dados insuficientes para gerar análise.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* Evolução do Humor */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
            <h3 className="text-sm font-medium text-white mb-4">Evolução do Humor</h3>
            {chartData.length > 0 ? (
              <div className="w-full text-xs">
                <AreaChart width={330} height={180} data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorMoodPrint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                  <YAxis ticks={[1, 3, 5]} domain={[0, 5]} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tickFormatter={(val) => {
                    if(val === 1) return 'Baixo';
                    if(val === 3) return 'Médio';
                    if(val === 5) return 'Alto';
                    return '';
                  }} />
                  <Area type="monotone" dataKey="mood" stroke={themeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorMoodPrint)" activeDot={{ r: 6, fill: '#fff', stroke: themeColor, strokeWidth: 2 }} dot={{ r: 4, fill: '#fff', stroke: themeColor, strokeWidth: 2 }} />
                </AreaChart>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-[#6b7280] text-sm">Nenhum dado</div>
            )}
         </div>
         
         {/* Mapa de Calor */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
            <h3 className="text-sm font-medium text-white mb-4">Mapa de Calor (Horários de Crise)</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-12"></div>
                <div className="flex-1 grid grid-cols-7 gap-1 mb-1">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                    <div key={i} className="text-[10px] text-center text-[#9ca3af]">{d}</div>
                  ))}
                </div>
              </div>
              {heatmapData.map((row: any, rIdx: number) => (
                <div key={rIdx} className="flex gap-2 items-center">
                  <div className="w-12 text-[10px] text-[#9ca3af] font-medium">
                    {['Madru', 'Manhã', 'Tarde', 'Noite'][rIdx]}
                  </div>
                  <div className="flex-1 grid grid-cols-7 gap-1">
                    {row.map((val: number, cIdx: number) => (
                      <div key={cIdx} className="h-6 rounded bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: val > 0 ? \`rgba(244, 63, 94, \${Math.min(val * 0.3 + 0.2, 1)})\` : undefined, color: val > 0 ? '#fff' : 'transparent' }}>
                        {val > 0 ? val : ''}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
         {/* Locais de Risco */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
           <h3 className="text-sm font-medium text-white mb-4">Locais de Risco</h3>
           {locs.length > 0 ? (
             <div className="flex flex-col gap-3">
               {locs.map((l, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                    <span className="text-sm font-semibold text-[#e5e7eb]">{l.label}</span>
                    <div className="text-white bg-[#f43f5e] px-2.5 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap">
                      {l.count} {l.count === 1 ? 'crise' : 'crises'}
                    </div>
                  </div>
               ))}
             </div>
           ) : <p className="text-[#6b7280] text-sm">Nenhum local de risco identificado.</p>}
         </div>
         
         {/* Principais Gatilhos */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
           <h3 className="text-sm font-medium text-white mb-4">Principais Gatilhos Identificados</h3>
           {trigs.length > 0 ? (
             <div className="flex flex-col gap-3">
               {trigs.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                    <span className="text-sm font-semibold text-[#e5e7eb]">{t.label}</span>
                    <div className="text-white bg-[#f43f5e] px-2.5 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap">
                      {t.count} {t.count === 1 ? 'crise' : 'crises'}
                    </div>
                  </div>
               ))}
             </div>
           ) : <p className="text-[#6b7280] text-sm">Nenhum gatilho identificado.</p>}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* Relação Humor / Crises */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
           <h3 className="text-sm font-medium text-white mb-4">Relação entre Humor e Crises</h3>
           
           <div className="bg-[rgba(244,63,94,0.05)] rounded-xl border border-[rgba(244,63,94,0.2)] p-3 mb-3">
              <h4 className="text-xs text-center font-semibold text-[#f43f5e] mb-2 border-b border-[rgba(244,63,94,0.2)] pb-2">Dias com Crises</h4>
              {diasComCrises.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {diasComCrises.slice(0, 5).map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-[#e5e7eb]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{d.emojis.slice(-1)[0]}</span>
                        <span className="text-white bg-[#f43f5e] px-2 py-0.5 rounded font-medium">{d.crises} crise(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>}
           </div>
           
           <div className="bg-[rgba(34,197,94,0.05)] rounded-xl border border-[rgba(34,197,94,0.2)] p-3">
              <h4 className="text-xs text-center font-semibold text-[#4ade80] mb-2 border-b border-[rgba(34,197,94,0.2)] pb-2">Dias sem Crises</h4>
              {diasSemCrises.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {diasSemCrises.slice(0, 5).map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-center text-[#9ca3af]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{d.emojis.slice(-1)[0]}</span>
                        <span className="text-[#4ade80] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded font-medium">✓ Sem crises</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>}
           </div>
         </div>
         
         {/* Ranking de Estratégias */}
         <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl">
           <h3 className="text-sm font-medium text-white mb-4">Ranking de Estratégias</h3>
           {topStrategies.length > 0 ? (
             <div className="flex flex-col gap-3">
               {topStrategies.map((s: any, i: number) => {
                 const percent = (s.count / Math.max(1, topStrategies[0]?.count || 1)) * 100;
                 return (
                   <div key={i} className="bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden relative p-3 flex justify-between items-center">
                     <div className="absolute top-0 left-0 bottom-0 bg-[rgba(56,189,248,0.1)]" style={{ width: \`\${percent}%\`, backgroundColor: \`\${themeColor}33\` }} />
                     <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#38bdf8]" style={{ backgroundColor: themeColor }} />
                     
                     <div className="flex items-center gap-3 relative z-10">
                       <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-[rgba(56,189,248,0.5)]" style={{ backgroundColor: \`\${themeColor}33\`, color: themeColor, borderColor: \`\${themeColor}80\` }}>
                         {i + 1}
                       </div>
                       <span className="text-sm text-[#f3f4f6] font-medium">{s.label}</span>
                     </div>
                     <div className="relative z-10 bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded-md">
                       <span className="text-xs font-mono font-medium" style={{ color: themeColor }}>{s.count} vezes</span>
                     </div>
                   </div>
                 );
               })}
             </div>
           ) : <p className="text-[#6b7280] text-sm">Nenhuma estratégia salva ainda.</p>}
         </div>
      </div>

      {/* Linha do Tempo */}
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 rounded-2xl mb-8">
        <h3 className="text-sm font-medium text-white mb-4">Linha do Tempo do Progresso (Últimas observações)</h3>
        {timelineRecords.length > 0 ? (
          <div className="border-l-2 border-[rgba(255,255,255,0.1)] ml-2 pl-4 flex flex-col gap-4">
            {timelineRecords.slice(0, 5).map((r: any, i: number) => {
              const dateStr = new Date(r.date).toLocaleDateString('pt-BR');
              // We won't try to find emoji from MOODS array to avoid complex dependencies here, just simple representation.
              return (
                <div key={i} className="relative">
                   <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-[#09090b] shadow-[0_0_8px_#38bdf8]" style={{ backgroundColor: themeColor, boxShadow: \`0 0 8px \${themeColor}\` }} />
                   <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-3">
                     <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold" style={{ color: themeColor }}>{dateStr}</span>
                     </div>
                     <p className="text-xs text-[#d1d5db] italic">"{r.observacao}"</p>
                   </div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-[#6b7280] text-sm text-center">Nenhuma observação registrada.</p>}
      </div>

    </div>
  );
}
`;

// Insert PrintableClinicalReport right before AnalisesView
content = content.replace('function AnalisesView', printableComponent + '\nfunction AnalisesView');

// In AnalisesView, render PrintableClinicalReport right after <div ref={printRef} ...>
content = content.replace(
  'const printRef = useRef<HTMLDivElement>(null);',
  'const printRef = useRef<HTMLDivElement>(null);\n  const pdfContainerRef = useRef<HTMLDivElement>(null);'
);

content = content.replace(
  /const canvas = await html2canvas\(printRef\.current, \{/g,
  `const canvas = await html2canvas(pdfContainerRef.current!, {`
);

// We need to render the PrintableClinicalReport component.
// We'll place it inside a wrapper at the top of the return block of AnalisesView.
// But it needs to have pdfContainerRef.
content = content.replace(
  '<motion.div',
  `<div ref={pdfContainerRef} className="absolute left-[-9999px] top-[-9999px]">
      <PrintableClinicalReport 
        records={records} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isDinoTheme={isDinoTheme}
        stats={stats} chartData={chartData} topStrategies={topStrategies} heatmapData={heatmapData}
        diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} aiInsights={aiInsights}
      />
    </div>\n    <motion.div`
);

// Change the button text
content = content.replace(
  '{isExporting ? "Gerando..." : "Exportar e Salvar PDF"}',
  '{isExporting ? "Gerando..." : "Salvar PDF"}'
);

fs.writeFileSync(file, content);
console.log('Added PrintableClinicalReport');
