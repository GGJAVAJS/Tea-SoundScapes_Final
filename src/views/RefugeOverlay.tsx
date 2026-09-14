import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Play, Pause, Volume, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { setVolume } from '../lib/audioEngine';
import { MOCK_RECIPES, getAllRecipes } from '../data/mockRecipes';

interface RefugeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeRefuge: string | null;
  onToggleRefuge: (id: string) => void;
  themeMode?: 'adult'|'child';
  kidsTheme?: 'dino'|'space'|'cars'|null;
}

const REFUGE_SOUNDS = [
  { id: 'som-a', label: 'Ondas Delta Suaves' },
  { id: 'som-b', label: 'Brisa Celestial' },
  { id: 'som-c', label: 'Ressonância Profunda' }
];

export function RefugeOverlay({ isOpen, onClose, activeRefuge, onToggleRefuge, themeMode, kidsTheme }: RefugeOverlayProps) {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [savedMixes, setSavedMixes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('saved_community_mixes');
        if (saved) setSavedMixes(JSON.parse(saved));
      } catch(e) {}
    }
  }, [isOpen]);

  const displayMixes = getAllRecipes().filter(r => savedMixes.includes(r.id));

  const isChild = themeMode === 'child';
  const primaryBg = isChild ? 'bg-[#ff5c00]' : 'bg-accent-blue';
  const primaryText = isChild ? 'text-[#ff5c00]' : 'text-accent-blue';
  const primaryShadow = isChild ? 'shadow-[0_0_20px_rgba(255,92,0,0.15)]' : 'shadow-[0_0_20px_rgba(56,189,248,0.15)]';
  const buttonShadow = isChild ? 'shadow-[0_0_15px_rgba(255,92,0,0.3)]' : 'shadow-[0_0_15px_rgba(56,189,248,0.3)]';
  const primaryAccent = isChild ? 'accent-[#ff5c00]' : '${primaryAccent}';


  const handleVolumeChange = (id: string, val: number) => {
    setVolumes(prev => ({ ...prev, [id]: val }));
    setVolume(id, val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-[#060b13] flex flex-col p-6 pt-12 pb-24 overflow-y-auto"
        >
          {/* Background Ambient Glow */}

          <header className="flex items-center mb-10 text-white relative z-10">
            <button onClick={onClose} className="absolute left-0 p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-full text-center">
              <h1 className="text-3xl font-light tracking-wide">Seu Refúgio</h1>
            </div>
          </header>

          <p className="text-center text-gray-400 mb-12 -mt-4 text-sm leading-relaxed z-10">
            Qual frequência é mais<br/>confortável para você?
          </p>

          <div className="flex flex-col gap-4 z-10">
            {REFUGE_SOUNDS.map((sound) => {
              const isActive = activeRefuge === sound.id;
              const vol = volumes[sound.id] ?? 1;
              
              return (
                <div key={sound.id} className={`p-5 flex flex-col gap-3 relative transition-colors duration-300 ${isActive ? `glass-card-active ${primaryShadow}` : "glass-card"}`}>
                  <div className="flex justify-between items-start text-white font-medium mb-2">
                    <span>{sound.label}</span>
                    {isActive && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Volume className={`w-3.5 h-3.5 ${primaryText}`} />
                          <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={vol}
                            onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer ${primaryAccent}"
                          />
                          <Volume2 className={`w-3.5 h-3.5 ${primaryText}`} />
                        </div>
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0"
                        >
                          <Check className={`w-4 h-4 ${primaryText}`} strokeWidth={3} />
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Visualizer */}
                    <div className="flex-1 h-12 flex items-center justify-center gap-1 opacity-60">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <motion.div 
                          key={bar}
                          animate={isActive ? { height: ['20%', '80%', '40%', '100%', '30%'] } : { height: '10%' }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1 + Math.random(), 
                            ease: "easeInOut",
                            repeatType: "mirror"
                          }}
                          className={`w-1.5 ${primaryBg} rounded-full`} 
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => onToggleRefuge(sound.id)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        isActive 
                          ? 'border-accent-blue/50 bg-accent-blue/20 text-accent-blue shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                          : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                    </button>
                  </div>
                </div>
              );
            })}

            {displayMixes.length > 0 && (
              <div className="mt-4 mb-2">
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest pl-2">Mixes Salvos</p>
              </div>
            )}
            
            {displayMixes.map((mix) => {
              const isActive = activeRefuge === mix.id;
              
              return (
                <div key={mix.id} className={`p-5 flex flex-col gap-3 relative transition-colors duration-300 ${isActive ? `glass-card-active ${primaryShadow}` : "glass-card"}`}>
                  <div className="flex justify-between items-start text-white font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <mix.icon className="w-4 h-4" style={{ color: mix.color }} />
                      <span>{mix.title}</span>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Volume className="w-3.5 h-3.5" style={{ color: mix.color }} />
                          <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={volumes[mix.id] ?? 1}
                            onChange={(e) => handleVolumeChange(mix.id, Number(e.target.value))}
                            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          />
                          <Volume2 className="w-3.5 h-3.5" style={{ color: mix.color }} />
                        </div>
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0"
                        >
                          <Check className={`w-4 h-4 ${primaryText}`} strokeWidth={3} />
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-12 flex items-center justify-center gap-1 opacity-60">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <motion.div 
                          key={bar}
                          animate={isActive ? { height: ['20%', '80%', '40%', '100%', '30%'] } : { height: '10%' }}
                          transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut", repeatType: "mirror" }}
                          className="w-1.5 rounded-full" 
                          style={{ backgroundColor: mix.color }}
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => onToggleRefuge(mix.id)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        isActive 
                          ? 'border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                          : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                      }`}
                      style={isActive ? { borderColor: mix.color, backgroundColor: `${mix.color}33`, color: mix.color, boxShadow: `0 0 15px ${mix.color}40` } : {}}
                    >
                      {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
