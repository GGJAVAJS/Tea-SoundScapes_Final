const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const targetTag = "<RegistroView onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} />";
const replTag = "<RegistroView onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isChildAutonomyMode={isChildAutonomyMode} />";
code = code.replace(targetTag, replTag);

const targetDecl = "function RegistroView({ onSave, isDinoTheme, isSpaceTheme, isCarsTheme }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {";
const replDecl = "function RegistroView({ onSave, isDinoTheme, isSpaceTheme, isCarsTheme, isChildAutonomyMode }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean, isChildAutonomyMode?: boolean }) {";
code = code.replace(targetDecl, replDecl);

const targetTriggers = "{/* Triggers */}";
const replTriggers = "{!isChildAutonomyMode && (<>\n      {/* Triggers */}";
code = code.replace(targetTriggers, replTriggers);

const targetButton = `<button 
        onClick={() => onSave(intensity, selectedMood, selectedTriggers, selectedStrategy, observacao)}
        className={\`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl \${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black shadow-[0_0_20px_rgba(255,232,56,0.6)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_20px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[#80F356]/90 text-[#553100] shadow-[0_0_20px_rgba(128,243,86,0.6)]' : 'bg-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'}\`}
      >
        <Check className="w-6 h-6" />
        Salvar Registro
      </button>`;
const replButton = `</>)}\n      <button 
        onClick={() => onSave(intensity, selectedMood, selectedTriggers, selectedStrategy, observacao)}
        className={\`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl \${isCarsTheme ? 'bg-[#FFE838]/[.88] text-black shadow-[0_0_20px_rgba(255,232,56,0.6)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_20px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[#80F356]/90 text-[#553100] shadow-[0_0_20px_rgba(128,243,86,0.6)]' : 'bg-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'}\`}
      >
        <Check className="w-6 h-6" />
        {isChildAutonomyMode ? 'Concluir' : 'Salvar Registro'}
      </button>`;
code = code.replace(targetButton, replButton);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('patched registro autonomy');
