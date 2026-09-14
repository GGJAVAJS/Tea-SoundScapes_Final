const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const regex = /function RegistroView\(\{[\s\S]*?\}\) \{[\s\S]*?<motion.div initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} exit=\{\{ opacity: 0 \}\} className="flex flex-col gap-8">[\s\S]*?<\/motion.div>\s*\n\s*\);\s*\}/;

const registryViewCode = `function RegistroView({ onSave, isDinoTheme, isSpaceTheme, isCarsTheme, isChildAutonomyMode }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean, isChildAutonomyMode?: boolean }) {
  const [intensity, setIntensity] = useState(10);
  const selectedMood = MOODS.find(m => intensity >= m.min && intensity <= m.max)?.id || 'great';
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };
  
  const handleMoodClick = (id: string) => {
    const mood = MOODS.find(m => m.id === id);
    if(mood) {
       setIntensity(mood.max - 10);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
      {/* Mood */}
      <div>
        <h2 className="text-xl text-gray-200 mb-6">Como você está agora?</h2>
        {isCarsTheme ? (
          <CarsFuelTank intensity={intensity} setIntensity={setIntensity} />
        ) : (
          <div className="flex justify-between items-center px-2">
            {MOODS.map(mood => (
            <button 
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={\`transition-all \${isDinoTheme ? 'dinosaur-humor-container' : 'text-4xl'} \${selectedMood === mood.id ? 'scale-125' : 'scale-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110'}\`}
            >
              {selectedMood === mood.id ? (
                <div className="relative">
                  <div className={\`absolute inset-0 rounded-full blur-md scale-150 \${isCarsTheme ? 'bg-[#FFE838]/[.88]' : isSpaceTheme ? 'bg-[#602EC9]/40' : isDinoTheme ? 'bg-[#80F356]/40' : 'bg-accent-blue/40'}\`} />
                  <span className={\`relative z-10 flex items-center justify-center rounded-full border-2 p-1 \${isDinoTheme ? 'dinosaur-humor-container' : 'w-12 h-12'} \${isCarsTheme ? 'border-[#FFE838]/[.88] shadow-[0_0_15px_rgba(255,232,56,0.79)]' : isSpaceTheme ? 'border-[#602EC9]/79 shadow-[0_0_15px_rgba(56,189,248,0.79)]' : isDinoTheme ? 'border-[#80F356]/79 shadow-[0_0_15px_rgba(128,243,86,0.79)]' : 'border-accent-blue/79 shadow-[0_0_15px_rgba(56,189,248,0.5)]'}\`}>
                    {isSpaceTheme ? (
                      <AstronautMood mood={mood.id} />
                    ) : isDinoTheme ? (
                      <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                    ) : (
                      mood.emoji
                    )}
                  </span>
                </div>
              ) : (
                <span className={\`flex items-center justify-center p-1 rounded-full hover:border transition-all \${isDinoTheme ? 'dinosaur-humor-container' : 'w-12 h-12'} \${isCarsTheme ? 'text-[#FFE838]/[.88]' : isSpaceTheme ? 'hover:border-[#602EC9]/79 hover:shadow-[0_0_10px_rgba(56,189,248,0.6)]' : isDinoTheme ? 'hover:border-[#80F356]/79 hover:shadow-[0_0_10px_rgba(128,243,86,0.6)]' : 'hover:border-accent-blue/79 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]'}\`}>
                  {isSpaceTheme ? (
                    <AstronautMood mood={mood.id} />
                  ) : isDinoTheme ? (
                    <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className="dinosaur-humor-image" />
                  ) : (
                    mood.emoji
                  )}
                </span>
              )}
            </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Intensity Slider */}
      {!isCarsTheme && (
      <div className="mt-4">
        <input 
          type="range" 
          min="0" max="100" 
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className={\`w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer transition-colors \${isCarsTheme ? 'accent-[#FFE838]/[.88] hover:border hover:border-[#FFE838]/[.88]/79' : isSpaceTheme ? 'accent-[#602EC9] hover:border hover:border-[#602EC9]/79' : isDinoTheme ? 'accent-[#80F356] hover:border hover:border-[#80F356]/79' : 'accent-accent-blue hover:border hover:border-accent-blue/79'}\`}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-3">
          <span className={\`transition-colors cursor-pointer \${isCarsTheme ? 'text-[#FFE838]/[.88]' : isSpaceTheme ? 'hover:text-[#602EC9]/79' : isDinoTheme ? 'hover:text-[#80F356]/79' : 'hover:text-accent-blue/79'}\`} onClick={() => setIntensity(0)}>Calmo</span>
          <span className={\`transition-colors cursor-pointer \${isCarsTheme ? 'text-[#FFE838]/[.88]' : isSpaceTheme ? 'hover:text-[#602EC9]/79' : isDinoTheme ? 'hover:text-[#80F356]/79' : 'hover:text-accent-blue/79'}\`} onClick={() => setIntensity(100)}>Estressado</span>
        </div>
      </div>
      )}

      {!isChildAutonomyMode && (
      <>
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
      </>
      )}

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

code = code.replace(regex, registryViewCode);
fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('patched diary registry view manually');
