const fs = require('fs');

const file = 'src/views/DiaryView.tsx';
let content = fs.readFileSync(file, 'utf8');

const aiSummarySection = `
        {/* Resumo Analitico da IA */}
        <div className="glass-card p-5 mb-4 border-[rgba(56,189,248,0.3)] bg-gradient-to-br from-[rgba(56,189,248,0.05)] to-transparent">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#38bdf8]" />
            Resumo Analítico da IA
          </h3>
          {isLoadingInsights ? (
             <div className="animate-pulse flex flex-col gap-2">
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-3/4"></div>
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-full"></div>
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-5/6"></div>
             </div>
          ) : aiInsights.userInsight ? (
             <div className="flex flex-col gap-4">
               <div>
                 <h4 className="text-xs font-medium text-[#9ca3af] mb-1">Para Você:</h4>
                 <p className="text-sm text-[#e5e7eb] leading-relaxed">{aiInsights.userInsight}</p>
               </div>
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
`;

// Let's place it right before the "Relação entre Humor e Crises" section.
content = content.replace(
  /<div className="flex flex-col gap-4">\s*<div className="glass-card p-4">\s*<h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">Relação entre Humor e Crises<\/h3>/,
  aiSummarySection + '\n        <div className="flex flex-col gap-4">\n          <div className="glass-card p-4">\n             <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">Relação entre Humor e Crises</h3>'
);

fs.writeFileSync(file, content);
console.log('AI Summary added successfully.');
