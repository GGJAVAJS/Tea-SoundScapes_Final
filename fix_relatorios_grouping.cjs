const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const newRender = `
  const sortedReports = [...reports].sort((a, b) => {
    if (filter === 'old') return a.timestamp - b.timestamp;
    return b.timestamp - a.timestamp;
  });

  const renderGroupedReports = () => {
    if (filter === 'recent' || filter === 'old') {
      return (
        <div className="flex flex-col gap-3 mb-32">
          {sortedReports.map(report => <ReportCard key={report.id} report={report} onDelete={handleDelete} onDownload={handleDownload} onShare={handleShare} />)}
        </div>
      );
    }
    
    // Grouping
    const groups: Record<string, Report[]> = {};
    sortedReports.forEach(report => {
      const d = new Date(report.timestamp);
      let key = '';
      if (filter === 'month') {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        key = \`\${mm}/\${yyyy}\`;
      } else {
        key = \`\${d.getFullYear()}\`;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(report);
    });

    return (
      <div className="flex flex-col gap-6 mb-32">
        {Object.entries(groups).map(([groupKey, groupReports]) => (
          <div key={groupKey}>
            <h3 className="text-gray-400 font-medium text-sm mb-3 ml-1">{groupKey}</h3>
            <div className="flex flex-col gap-3">
              {groupReports.map(report => <ReportCard key={report.id} report={report} onDelete={handleDelete} onDownload={handleDownload} onShare={handleShare} />)}
            </div>
          </div>
        ))}
      </div>
    );
  };
`;

code = code.replace(
  /const sortedReports = \[\.\.\.reports\]\.sort\([\s\S]*?\}\);/,
  newRender
);

code = code.replace(
  /<div className="flex flex-col gap-3 mb-32">[\s\S]*?<\/div>\n      \)}/,
  "{renderGroupedReports()}\n      )}"
);

code = code.replace(
  /function RelatoriosView/,
  `function ReportCard({ report, onDelete, onDownload, onShare }: { report: Report, onDelete: (id: string) => void, onDownload: (r: Report) => void, onShare: (r: Report) => void }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-4">
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
        <button onClick={() => onDelete(report.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => onDownload(report)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Download className="w-3.5 h-3.5" /> Baixar
        </button>
        <button onClick={() => onShare(report)} className="flex-1 py-2 bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/50 text-accent-blue rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Compartilhar
        </button>
      </div>
    </div>
  );
}

function RelatoriosView`
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Grouping');
