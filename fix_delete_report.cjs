const fs = require('fs');

let content = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// We need to modify ReportCard to handle inline confirmation.
const oldReportCard = `function ReportCard({ report, onDelete, onDownload, onShare }: { report: Report, onDelete: (id: string) => void, onDownload: (r: Report) => void, onShare: (r: Report) => void }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.2)] flex items-center justify-center border border-[rgba(56,189,248,0.3)] text-accent-blue">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{report.filename}</h3>
            <p className="text-xs text-[#9ca3af]">{report.date}</p>
          </div>
        </div>
        <button onClick={() => onDelete(report.id)} className="text-[#6b7280] hover:text-[#f87171] p-1 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => onDownload(report)} className="flex-1 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Download className="w-3.5 h-3.5" /> Baixar
        </button>
        <button onClick={() => onShare(report)} className="flex-1 py-2 bg-[rgba(56,189,248,0.2)] hover:bg-[rgba(56,189,248,0.3)] border border-[rgba(56,189,248,0.5)] text-accent-blue rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Compartilhar
        </button>
      </div>
    </div>
  );
}`;

const newReportCard = `function ReportCard({ report, onDelete, onDownload, onShare }: { report: Report, onDelete: (id: string) => void, onDownload: (r: Report) => void, onShare: (r: Report) => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="glass-card p-4 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.2)] flex items-center justify-center border border-[rgba(56,189,248,0.3)] text-[#38bdf8]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{report.filename}</h3>
            <p className="text-xs text-[#9ca3af]">{report.date}</p>
          </div>
        </div>
        {!confirming && (
          <button onClick={() => setConfirming(true)} className="text-[#6b7280] hover:text-[#f87171] p-1 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => onDownload(report)} className="flex-1 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Download className="w-3.5 h-3.5" /> Baixar
        </button>
        <button onClick={() => onShare(report)} className="flex-1 py-2 bg-[rgba(56,189,248,0.2)] hover:bg-[rgba(56,189,248,0.3)] border border-[rgba(56,189,248,0.5)] text-[#38bdf8] rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Compartilhar
        </button>
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-[#060b13]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10"
          >
            <p className="text-sm font-medium text-white mb-3 text-center">Excluir este relatório permanentemente?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] text-white text-xs font-semibold">
                Cancelar
              </button>
              <button onClick={() => onDelete(report.id)} className="flex-1 py-2 rounded-lg bg-[#f43f5e] text-white text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                Excluir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`;

content = content.replace(oldReportCard, newReportCard);

// Modify handleDelete in RelatoriosView
content = content.replace(
  /const handleDelete = async \(id: string\) => \{\s*if \(confirm\('Tem certeza que deseja excluir este relatório\?'\)\) \{\s*await deleteReport\(id\);\s*loadReports\(\);\s*\}\s*\};/,
  `const handleDelete = async (id: string) => {
    await deleteReport(id);
    loadReports();
  };`
);

// We need to make sure we don't use alert in handleShare too
content = content.replace(
  /alert\('Compartilhamento nativo não suportado neste dispositivo\. Use a opção de baixar\.'\);/g,
  `console.log('Compartilhamento nativo não suportado neste dispositivo. Use a opção de baixar.');`
);

content = content.replace(
  /alert\('Erro ao tentar compartilhar o arquivo\.'\);/g,
  `console.error('Erro ao tentar compartilhar o arquivo.');`
);

fs.writeFileSync('src/views/DiaryView.tsx', content);
console.log('Replaced confirm modal with inline UI.');
