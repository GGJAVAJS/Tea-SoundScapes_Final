const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const replacement = `
        <div className="flex justify-between items-end mb-6 hide-on-print">
          <div>
            <h2 className="text-xl font-medium text-white mb-1">Últimos 30 dias</h2>
            <p className="text-sm text-gray-400">{records.length} registros no período</p>
          </div>
          <button 
            onClick={handleExportPDF} 
            disabled={isExporting}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: isDinoTheme ? '#553100' : (isSpaceTheme ? '#602EC9' : (isCarsTheme ? '#FFE838' : undefined)), color: isCarsTheme ? '#000' : '#fff' }}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* User AI Insight Card */}
        {aiInsights.userInsight && !isLoadingInsights && (
          <div className="mb-6 p-4 rounded-2xl border border-white/10 hide-on-print relative overflow-hidden flex items-start gap-4"
               style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)', backdropFilter: 'blur(10px)' }}>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Card de Insight</h3>
              <p className="text-sm text-gray-200 line-clamp-2 leading-tight">
                {aiInsights.userInsight}
              </p>
            </div>
          </div>
        )}

        {/* Therapist Summary (Only visible in PDF export) */}
        <div className="hidden print:block print:mb-8 print:p-6 print:border print:border-gray-300 print:rounded-2xl">
          <h2 className="text-xl font-bold text-black mb-3">Resumo Analítico da IA</h2>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {aiInsights.therapistSummary || "Dados insuficientes para gerar relatório analítico neste período."}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
`;

code = code.replace(
  /<div className="flex justify-between items-end mb-6 hide-on-print">[\s\S]*?<div className="grid grid-cols-4 gap-3 mb-6">/,
  replacement
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success');
