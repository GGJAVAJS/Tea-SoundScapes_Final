const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// 1. Fix the container style
const oldContainerRegex = /<div style=\{\{ position: 'absolute', top: '-9999px', left: '-9999px' \}\}>\s*<div ref=\{pdfContainerRef\}>/g;
content = content.replace(oldContainerRegex, `<div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, zIndex: -9999, pointerEvents: 'none' }}>
      <div ref={pdfContainerRef}>`);

// 2. Fix handleExportPDF
const oldHandlerRegex = /const handleExportPDF = async \(\) => \{[\s\S]*?const canvas = await html2canvas\(el, \{/m;
const newHandlerPart = `const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfContainerRef.current;
      
      // Delay so React has time to ensure everything is painted
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(el, {`;
content = content.replace(oldHandlerRegex, newHandlerPart);
content = content.replace('parent.style.cssText = originalCss;', '');
content = content.replace("backgroundColor: '#ffffff',", "backgroundColor: '#090e17',");

// 3. Rebuild PrintableClinicalReport
const startIndex = content.indexOf('function PrintableClinicalReport(');
const endIndex = content.indexOf('function AnalisesView(');

const newPrintable = `function PrintableClinicalReport({ 
  records, isSpaceTheme, isCarsTheme, isDinoTheme, 
  stats, chartData, topStrategies, heatmapData, topTriggers = [],
  diasComCrises, diasSemCrises, timelineRecords, aiInsights 
}: any) {
  
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div className="flex flex-col gap-6 p-10 w-[800px] bg-[#090e17] text-[#e5e7eb] font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Relatório Clínico</h1>
        <div className="flex items-center gap-2 mb-2">
           <div className="flex gap-1 items-end h-8">
             <div className="w-1.5 h-4 bg-[#1e293b]"></div>
             <div className="w-1.5 h-6 bg-[#475569]"></div>
             <div className="w-1.5 h-8 bg-[#38bdf8]"></div>
             <div className="w-1.5 h-5 bg-[#94a3b8]"></div>
             <div className="w-1.5 h-7 bg-[#0ea5e9]"></div>
           </div>
           <div className="flex flex-col ml-2 leading-none">
             <span className="text-2xl font-bold text-[#e5e7eb] tracking-wider">TEA</span>
             <span className="text-sm font-semibold text-[#38bdf8]">SoundScapes</span>
           </div>
        </div>
        <p className="text-sm text-[#9ca3af]">Gerado em: {dateStr}</p>
        <div className="w-full h-[1px] bg-[rgba(255,255,255,0.1)] mt-4"></div>
      </div>

      <div className="grid grid-cols-4 gap-3">
          {[
            { v: isSpaceTheme && stats.moodId ? <AstronautMood mood={stats.moodId} /> : stats.mood, l: 'Humor Médio', color: 'text-2xl flex items-center justify-center' },
            { v: stats.crises, l: 'Total de Crises', color: 'text-[#f43f5e] text-2xl font-semibold' },
            { v: stats.goodDays, l: 'Dias Bons', color: 'text-[#4ade80] text-2xl font-semibold' },
            { v: stats.trend, l: 'Tendência', color: stats.trend === '↓' ? 'text-[#f43f5e] text-2xl font-bold' : (stats.trend === '↑' ? 'text-[#4ade80] text-2xl font-bold' : 'text-[#d1d5db] text-2xl font-bold') }
          ].map((stat, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className={\`mb-1 \${stat.color}\`}>{stat.v}</span>
              <span className="text-[10px] text-[#d1d5db] leading-tight">{stat.l}</span>
            </div>
          ))}
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 pb-2">
          <h3 className="text-sm font-medium text-white mb-4">Evolução do Humor</h3>
          {chartData.length > 0 ? (
            <div className="h-40 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorMoodPrint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0}/>
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
                  <Area type="monotone" dataKey="mood" isAnimationActive={false} stroke={isSpaceTheme ? "#602EC9" : "#38bdf8"} strokeWidth={3} fillOpacity={1} fill="url(#colorMoodPrint)" activeDot={{ r: 6, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} dot={{ r: 4, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#6b7280] text-sm">
              Nenhum dado registrado ainda
            </div>
          )}
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
          <h3 className="text-sm font-medium text-white mb-4">Mapa de Calor (Horários de Crise)</h3>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="w-10"></div>
              <div className="flex-1 grid grid-cols-7 gap-1 mb-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] text-center text-[#9ca3af]">{d}</div>
                ))}
              </div>
            </div>
            {heatmapData.map((row: number[], rIdx: number) => (
              <div key={rIdx} className="flex gap-2">
                <div className="w-10 text-[10px] text-[#9ca3af] flex items-center justify-start">
                  {['Madru', 'Manhã', 'Tarde', 'Noite'][rIdx]}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {row.map((val: number, cIdx: number) => {
                    let bg = "bg-[rgba(255,255,255,0.05)]";
                    if (val >= 1 && val <= 2) bg = "bg-[#ff9c85]";
                    else if (val >= 3) bg = "bg-[#ff5a36]";
                    return <div key={\`\${rIdx}-\${cIdx}\`} className={\`aspect-square rounded-sm \${bg}\`} />
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 text-[10px] text-[#9ca3af]">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[rgba(255,255,255,0.05)] inline-block" /> 0 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff9c85] inline-block" /> 1-2 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff5a36] inline-block" /> 3+ crises</div>
          </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
          <h3 className="text-sm font-medium text-white mb-4">Principais Gatilhos (Locais e Fatores)</h3>
          {topTriggers && topTriggers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topTriggers.map((t: any, i: number) => {
                let medal = '';
                if (i === 0) medal = '🥇';
                else if (i === 1) medal = '🥈';
                else if (i === 2) medal = '🥉';
                
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">{medal}</div>
                      <span className="text-sm font-semibold text-[#e5e7eb]">{t.label}</span>
                    </div>
                    <div className="text-white bg-[#f43f5e] px-2.5 py-1 rounded-md text-xs font-bold">
                      {t.count} {t.count === 1 ? 'crise' : 'crises'}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-[#6b7280] text-sm py-4 text-center">Nenhum dado registrado</div>
          )}
      </div>

      <div className="bg-[rgba(56,189,248,0.05)] rounded-2xl p-5 mb-4 border border-[rgba(56,189,248,0.3)]">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#38bdf8]" />
            Resumo Analítico da IA
          </h3>
          {aiInsights?.userInsight || aiInsights?.therapistSummary ? (
             <div className="flex flex-col gap-4">
               {aiInsights.userInsight && (
                 <div>
                   <h4 className="text-xs font-medium text-[#9ca3af] mb-1">Para o Paciente:</h4>
                   <p className="text-sm text-[#e5e7eb] leading-relaxed">{aiInsights.userInsight}</p>
                 </div>
               )}
               {aiInsights.therapistSummary && (
                 <div className="pt-3 border-t border-[rgba(255,255,255,0.1)]">
                   <h4 className="text-xs font-medium text-[#38bdf8] mb-1">Nota para o Terapeuta:</h4>
                   <p className="text-xs text-[#d1d5db] leading-relaxed italic">{aiInsights.therapistSummary}</p>
                 </div>
               )}
             </div>
          ) : (
             <p className="text-sm text-[#9ca3af]">A IA precisa de mais registros para gerar um resumo analítico.</p>
          )}
      </div>
      
      <div className="flex flex-col gap-4">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
             <h3 className="text-sm font-medium text-white mb-4">Relação entre Humor e Crises</h3>
             <div className="bg-[rgba(244,63,94,0.05)] rounded-xl border border-[rgba(244,63,94,0.2)] p-3 mb-3">
                <h4 className="text-xs text-center font-semibold text-[#f43f5e] mb-3 border-b border-[rgba(244,63,94,0.2)] pb-2">Dias com Crises</h4>
                {diasComCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasComCrises.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[#e5e7eb]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{isSpaceTheme && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} /> : d.emojis.slice(-1)[0]}</span>
                          <span className="text-white bg-[#f43f5e] px-2 py-0.5 rounded font-medium">{d.crises} crise(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>

             <div className="bg-[rgba(34,197,94,0.05)] rounded-xl border border-[rgba(34,197,94,0.2)] p-3">
                <h4 className="text-xs text-center font-semibold text-[#4ade80] mb-3 border-b border-[rgba(34,197,94,0.2)] pb-2">Dias sem Crises</h4>
                {diasSemCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasSemCrises.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-center text-[#9ca3af]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{isSpaceTheme && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} /> : d.emojis.slice(-1)[0]}</span>
                          <span className="text-[#4ade80] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded font-medium">✓ Sem crises</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>
          </div>
      </div>
      
      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-white mb-4">Linha do Tempo do Progresso</h3>
        {timelineRecords.length > 0 ? (
          <div className="border-l-2 border-[rgba(255,255,255,0.1)] ml-2 pl-4 flex flex-col gap-4">
            {timelineRecords.map((rec: any, i: number) => {
              const isCrisis = rec.crises > 0;
              return (
                <div key={i} className="relative">
                  <div className={\`absolute -left-[23px] top-1 w-3 h-3 rounded-full \${isCrisis ? 'bg-[#f43f5e] border-2 border-[#121214]' : 'bg-[#38bdf8] border-2 border-[#121214]'}\`} />
                  <div className="text-xs text-[#9ca3af] mb-1">{new Date(rec.date).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 text-sm text-[#e5e7eb]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{isSpaceTheme && rec.moodId ? <AstronautMood mood={rec.moodId} /> : rec.emoji}</span>
                      {isCrisis && <span className="text-[10px] font-bold text-[#f43f5e] uppercase tracking-wider px-1.5 py-0.5 bg-[rgba(244,63,94,0.1)] rounded">Crise Registrada</span>}
                    </div>
                    {rec.texto ? <p className="leading-relaxed">{rec.texto}</p> : <p className="text-[#6b7280] italic">Sem anotação de texto.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-[#6b7280] text-sm">
            Nenhuma observação registrada.
          </div>
        )}
      </div>

    </div>
  );
}
`;

content = content.slice(0, startIndex) + newPrintable + content.slice(endIndex);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Fixed PDF issues');
