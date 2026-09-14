const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const relatoriosView = `
function RelatoriosView({ isDinoTheme, isSpaceTheme, isCarsTheme }: { isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'old' | 'month' | 'year'>('recent');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('currentUserEmail') || 'guest';
      const data = await getReportsByUser(email);
      setReports(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDownload = (report: Report) => {
    const a = document.createElement('a');
    a.href = report.dataUrl;
    a.download = report.filename;
    a.click();
  };

  const handleShare = async (report: Report) => {
    try {
      const res = await fetch(report.dataUrl);
      const blob = await res.blob();
      const file = new File([blob], report.filename, { type: 'application/pdf' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: report.filename,
          text: 'Confira o relatório do diário.'
        });
      } else {
        alert('Compartilhamento nativo não suportado neste dispositivo. Use a opção de baixar.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao tentar compartilhar o arquivo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      await deleteReport(id);
      loadReports();
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (filter === 'recent') return b.timestamp - a.timestamp;
    if (filter === 'old') return a.timestamp - b.timestamp;
    if (filter === 'month' || filter === 'year') {
      // Just sort by recent for month/year unless we group, keeping it simple
      return b.timestamp - a.timestamp;
    }
    return b.timestamp - a.timestamp;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
        <h2 className="text-gray-200 font-medium px-2">Meus Relatórios</h2>
        <div className="relative group">
          <button className="bg-white/10 text-xs px-3 py-1.5 rounded-lg text-white flex items-center gap-2 border border-white/10">
            <Filter className="w-3 h-3" /> 
            {filter === 'recent' && 'Mais Recentes'}
            {filter === 'old' && 'Mais Antigos'}
            {filter === 'month' && 'Por Mês'}
            {filter === 'year' && 'Por Ano'}
          </button>
          <div className="absolute right-0 top-full mt-2 w-40 bg-[#111827] border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl">
            <button onClick={() => setFilter('recent')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Mais Recentes</button>
            <button onClick={() => setFilter('old')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Mais Antigos</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="text-center py-12 px-6 glass-card rounded-2xl">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-sm">Nenhum relatório salvo ainda.</p>
          <p className="text-gray-500 text-xs mt-2">Gere novos PDFs na aba de Análises.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-32">
          {sortedReports.map(report => (
            <div key={report.id} className="glass-card p-4 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30 text-accent-blue">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{report.filename}</h3>
                    <p className="text-xs text-gray-400">{report.date}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(report.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleDownload(report)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Baixar
                </button>
                <button onClick={() => handleShare(report)} className="flex-1 py-2 bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/50 text-accent-blue rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Compartilhar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
`;

code += "\n" + relatoriosView;

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Relatorios View');
