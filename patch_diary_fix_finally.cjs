const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const targetDup = `      {!isChildAutonomyMode && (<>
      {/* Triggers */}`;
const replDup = `      {!isChildAutonomyMode && (<>
      {/* Triggers */}`;

// Let's just fix the whole section between Triggers and button to remove any nesting problems
const targetReplace = `      {!isChildAutonomyMode && (<>
      {/* Triggers */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">O que aconteceu?</h2>
        <div className="flex flex-wrap gap-3">
          {TRIGGERS.map(trigger => {
            const isSelected = selectedTriggers.includes(trigger);
            return (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden \${isSelected ? (isCarsTheme ? 'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9]/20 border border-[#602EC9]/79 text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-gray-400 hover:text-white hover:bg-[#FFE838]/[.88]' : isSpaceTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#602EC9]/79 hover:text-[#602EC9] hover:bg-[#602EC9]/10' : isDinoTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'bg-white/5 text-gray-300 border border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10')}\`}
              >
                {isSelected && <Check className={\`w-4 h-4 \${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}\`} />}
                {trigger}
              </button>
            );
          })}
        </div>
      </div>
      {/* Strategies */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">O que ajudou você a se acalmar?</h2>
        <div className="flex flex-wrap gap-3">
          {STRATEGIES.map(s => {
            const isSelected = strategy === s;
            return (
              <button
                key={s}
                onClick={() => setStrategy(isSelected ? '' : s)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden \${isSelected ? (isCarsTheme ? 'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9]/20 border border-[#602EC9]/79 text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-gray-400 hover:text-white hover:bg-[#FFE838]/[.88]' : isSpaceTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#602EC9]/79 hover:text-[#602EC9] hover:bg-[#602EC9]/10' : isDinoTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'bg-white/5 text-gray-300 border border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10')}\`}
              >
                {isSelected && <Check className={\`w-4 h-4 \${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}\`} />}
                {s}
              </button>
            );
          })}
        </div>
      </div>
      {/* Observation */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">Observação / Diário</h2>
        <textarea
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          placeholder="Descreva o que aconteceu de importante..."
          className={\`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none transition-colors \${isCarsTheme ? 'focus:border-[#FFE838]/[.88] focus:ring-1 focus:ring-[#FFE838]/[.88] hover:border-[#FFE838]/[.88]/50' : isSpaceTheme ? 'focus:border-[#602EC9]/79 focus:ring-1 focus:ring-[#602EC9]/79 hover:border-[#602EC9]/50' : isDinoTheme ? 'focus:border-[#80F356]/79 focus:ring-1 focus:ring-[#80F356]/79 hover:border-[#80F356]/50' : 'focus:border-accent-blue/79 focus:ring-1 focus:ring-accent-blue/79 hover:border-accent-blue/50'}\`}
          rows={3}
        />
      </div>
      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}
         className={\`py-4 w-full text-center font-medium text-lg mt-12 mb-32 rounded-2xl relative overflow-hidden active:scale-95 transition-all \${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black hover:bg-[#FFE838] border border-[#FFE838]/[.88] shadow-[0_0_18px_rgba(255,232,56,0.4)]' : isSpaceTheme ? 'text-white bg-[#602EC9]/20 hover:bg-[#602EC9]/30 border border-[#602EC9]/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]' : isDinoTheme ? 'text-white bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)]' : 'text-white bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]'}\`}
      >
        <span className="relative z-10 font-semibold">Salvar Registro</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </button>
    </motion.div>
  );
}`;

const replFinal = `      {!isChildAutonomyMode && (<>
      {/* Triggers */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">O que aconteceu?</h2>
        <div className="flex flex-wrap gap-3">
          {TRIGGERS.map(trigger => {
            const isSelected = selectedTriggers.includes(trigger);
            return (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden \${isSelected ? (isCarsTheme ? 'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9]/20 border border-[#602EC9]/79 text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-gray-400 hover:text-white hover:bg-[#FFE838]/[.88]' : isSpaceTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#602EC9]/79 hover:text-[#602EC9] hover:bg-[#602EC9]/10' : isDinoTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'bg-white/5 text-gray-300 border border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10')}\`}
              >
                {isSelected && <Check className={\`w-4 h-4 \${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}\`} />}
                {trigger}
              </button>
            );
          })}
        </div>
      </div>
      {/* Strategies */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">O que ajudou você a se acalmar?</h2>
        <div className="flex flex-wrap gap-3">
          {STRATEGIES.map(s => {
            const isSelected = strategy === s;
            return (
              <button
                key={s}
                onClick={() => setStrategy(isSelected ? '' : s)}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden \${isSelected ? (isCarsTheme ? 'bg-[#FFE838]/[.88] border border-[#FFE838]/[.88] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9]/20 border border-[#602EC9]/79 text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-gray-400 hover:text-white hover:bg-[#FFE838]/[.88]' : isSpaceTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#602EC9]/79 hover:text-[#602EC9] hover:bg-[#602EC9]/10' : isDinoTheme ? 'bg-white/5 text-gray-300 border border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'bg-white/5 text-gray-300 border border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10')}\`}
              >
                {isSelected && <Check className={\`w-4 h-4 \${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}\`} />}
                {s}
              </button>
            );
          })}
        </div>
      </div>
      {/* Observation */}
      <div>
        <h2 className="text-lg text-gray-200 mb-4 font-medium">Observação / Diário</h2>
        <textarea
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          placeholder="Descreva o que aconteceu de importante..."
          className={\`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none transition-colors \${isCarsTheme ? 'focus:border-[#FFE838]/[.88] focus:ring-1 focus:ring-[#FFE838]/[.88] hover:border-[#FFE838]/[.88]/50' : isSpaceTheme ? 'focus:border-[#602EC9]/79 focus:ring-1 focus:ring-[#602EC9]/79 hover:border-[#602EC9]/50' : isDinoTheme ? 'focus:border-[#80F356]/79 focus:ring-1 focus:ring-[#80F356]/79 hover:border-[#80F356]/50' : 'focus:border-accent-blue/79 focus:ring-1 focus:ring-accent-blue/79 hover:border-accent-blue/50'}\`}
          rows={3}
        />
      </div>
      </>)}
      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}
         className={\`py-4 w-full text-center font-medium text-lg mt-12 mb-32 rounded-2xl relative overflow-hidden active:scale-95 transition-all \${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black hover:bg-[#FFE838] border border-[#FFE838]/[.88] shadow-[0_0_18px_rgba(255,232,56,0.4)]' : isSpaceTheme ? 'text-white bg-[#602EC9]/20 hover:bg-[#602EC9]/30 border border-[#602EC9]/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]' : isDinoTheme ? 'text-white bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)]' : 'text-white bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]'}\`}
      >
        <span className="relative z-10 font-semibold">{isChildAutonomyMode ? 'Concluir' : 'Salvar Registro'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </button>
    </motion.div>
  );
}`;

code = code.replace(targetReplace, replFinal);

fs.writeFileSync('src/views/DiaryView.tsx', code);
