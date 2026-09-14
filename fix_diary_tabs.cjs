const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const relatorioBtn = `        <button 
          onClick={() => setActiveTab('relatorios')}
          className={\`flex-1 py-2 text-sm font-medium rounded-full transition-all \${activeTab === 'relatorios' ? (isCarsTheme ? 'bg-[#FFE838]/[.88] text-black border border-[#FFE838]/[.88] shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_15px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[#80F356]/25 text-[#80F356] border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isCarsTheme ? 'text-gray-400 hover:text-white hover:bg-[#FFE838]/[.88]' : isSpaceTheme ? 'text-gray-400 hover:text-[#602EC9] hover:bg-[#602EC9]/10' : isDinoTheme ? 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'text-gray-400 hover:text-accent-blue hover:bg-accent-blue/10')}\`}
        >
          Relatórios
        </button>`;

code = code.replace(
  "        </button>\n      </div>\n      )}\n      <AnimatePresence mode=\"wait\">",
  "        </button>\n" + relatorioBtn + "\n      </div>\n      )}\n      <AnimatePresence mode=\"wait\">"
);

const views = `{activeTab === 'registro' ? <RegistroView key="registro" onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isChildAutonomyMode={isChildAutonomyMode} /> : activeTab === 'analises' ? <AnalisesView key="analises" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} /> : <RelatoriosView key="relatorios" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} />}`;

code = code.replace(
  /{activeTab === 'registro' \? <RegistroView key="registro"[\s\S]*? \/>}/,
  views
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success DiaryView tabs');
