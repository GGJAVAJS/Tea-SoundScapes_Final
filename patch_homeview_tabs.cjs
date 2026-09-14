const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetState = '  const [favoriteMixes, setFavoriteMixes] = useState<any[]>([]);';
const replState = `  const [favoriteMixes, setFavoriteMixes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'todos' | 'favoritos'>('todos');`;

code = code.replace(targetState, replState);

const targetGrid = '<div className="grid grid-cols-2 gap-4 flex-1 content-start mb-8">';
const replGrid = `{favoriteMixes.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('todos')}
            className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${activeTab === 'todos' ? 'bg-white text-black' : 'glass-card text-white hover:bg-white/10'}\`}
          >
            Todos os Sons
          </button>
          <button 
            onClick={() => setActiveTab('favoritos')}
            className={\`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 \${activeTab === 'favoritos' ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'glass-card text-white hover:bg-white/10'}\`}
          >
            <Bookmark className="w-4 h-4" /> Favoritos
          </button>
        </div>
      )}
      
      {activeTab === 'favoritos' && favoriteMixes.length > 0 ? (
        <div className="flex flex-col gap-4 flex-1 content-start mb-8">
          {favoriteMixes.map((mix) => {
            const mixIcon = allMixerSounds.find(s => s.id === mix.dominantSoundId)?.icon || Activity;
            const MixIconComp = mixIcon;
            return (
              <div key={mix.id} className="glass-card p-4 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MixIconComp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{mix.name}</h3>
                    <p className="text-xs text-white/50">{mix.activeSoundIds.length} sons combinados</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      // Stop all current sounds
                      allMixerSounds.forEach(s => {
                        if (activeSounds[s.id]) {
                          handleToggleSound(s.id);
                        }
                      });
                      // Start mix sounds
                      setTimeout(() => {
                        mix.activeSoundIds.forEach(id => {
                          const url = importedSounds.find(s => s.id === id)?.url;
                          handleToggleSound(id, url);
                          
                          // Restore volumes and EQ
                          if (mix.volumes && mix.volumes[id]) {
                            handleVolumeChange(id, mix.volumes[id]);
                          }
                          if (mix.eq && mix.eq[id]) {
                            handleEQChange(id, 'bass', mix.eq[id].bass);
                            handleEQChange(id, 'mid', mix.eq[id].mid);
                            handleEQChange(id, 'treble', mix.eq[id].treble);
                          }
                        });
                      }, 100);
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                  >
                    <Play className="w-4 h-4 ml-1" />
                  </button>
                  <button 
                    onClick={() => {
                      const updated = favoriteMixes.filter(m => m.id !== mix.id);
                      setFavoriteMixes(updated);
                      localStorage.setItem('user_favorite_mixes_local', JSON.stringify(updated));
                      if (updated.length === 0) setActiveTab('todos');
                    }}
                    className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-all text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-4 flex-1 content-start mb-8">`;

code = code.replace(targetGrid, replGrid);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched tabs');
