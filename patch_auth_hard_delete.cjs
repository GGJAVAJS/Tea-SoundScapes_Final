const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// I can see that I wiped `</>` at some point but it didn't get restored
const findMissingFragmentClose = `      </div>
      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}`;

const fixMissingFragmentClose = `      </div>
      </>)}
      {isChildAutonomyMode && (
      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}
         className={\`py-4 w-full text-center font-medium text-lg mt-12 mb-32 rounded-2xl relative overflow-hidden active:scale-95 transition-all \${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black hover:bg-[#FFE838] border border-[#FFE838]/[.88] shadow-[0_0_18px_rgba(255,232,56,0.4)]' : isSpaceTheme ? 'text-white bg-[#602EC9]/20 hover:bg-[#602EC9]/30 border border-[#602EC9]/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]' : isDinoTheme ? 'text-white bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)]' : 'text-white bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]'}\`}
      >
        <span className="relative z-10 font-semibold">Concluir</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </button>
      )}
      {!isChildAutonomyMode && (
      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}`;

code = code.replace(findMissingFragmentClose, fixMissingFragmentClose);

fs.writeFileSync('src/views/DiaryView.tsx', code);
