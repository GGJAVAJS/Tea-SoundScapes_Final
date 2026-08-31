import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ChevronRight, ChevronLeft, SlidersHorizontal, Plus } from 'lucide-react';
import { SOUND_CONFIGS } from './HomeView';
import { MixRecipe } from '../data/mockRecipes';

export const PUBLISHED_MIXES_KEY = 'user_published_mixes';

interface PublishMixOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  volumes: Record<string, number>;
  eq: Record<string, { bass: number, mid: number, treble: number }>;
  activeSounds: string[];
  onVolumeChange: (soundId: string, value: number) => void;
  onEQChange: (soundId: string, band: 'bass' | 'mid' | 'treble', value: number) => void;
  toggleSound: (soundId: string) => void;
}

function getIconForTitle(title: string) {
  const t = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (t.includes('cabeca') || t.includes('cerebro') || t.includes('mente') || t.includes('pensamento') || t.includes('acalmar')) return 'Brain';
  if (t.includes('foco') || t.includes('estudar') || t.includes('trabalho') || t.includes('produtividade')) return 'Grid3x3';
  if (t.includes('dormir') || t.includes('sono') || t.includes('noite') || t.includes('descanso')) return 'Moon';
  if (t.includes('relaxar') || t.includes('calma') || t.includes('paz') || t.includes('zen')) return 'Wind';
  if (t.includes('chuva') || t.includes('agua') || t.includes('tempestade')) return 'Droplets';
  if (t.includes('natureza') || t.includes('floresta') || t.includes('arvore')) return 'Trees';
  if (t.includes('viagem') || t.includes('onibus') || t.includes('carro') || t.includes('aviao')) return 'Bus';
  if (t.includes('bebe') || t.includes('crianca') || t.includes('infantil')) return 'Baby';
  if (t.includes('leitura') || t.includes('livro') || t.includes('estudo')) return 'BookOpen';
  if (t.includes('coracao') || t.includes('amor')) return 'Heart';
  
  return 'Activity'; // default
}

const CATEGORIES = [
  { id: 'foco', title: 'Foco' },
  { id: 'sono', title: 'Relaxamento' },
  { id: 'infantil', title: 'Infantil' },
  { id: 'transporte', title: 'Transporte' }
];

const COLORS = ['#38bdf8', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export function PublishMixOverlay({ isOpen, onClose, volumes, eq, activeSounds, onVolumeChange, onEQChange, toggleSound }: PublishMixOverlayProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('foco');
  const [color, setColor] = useState(COLORS[0]);

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Dê um nome para a sua mixagem.');
      return;
    }

    const recipe = {
      id: `mix-user-${Date.now()}`,
      title,
      creator: 'Você',
      category,
      likes: 0,
      color,
      iconName: getIconForTitle(title),
      config: {
        volumes: activeSounds.reduce((acc, sound) => ({ ...acc, [sound]: volumes[sound] ?? 1 }), {}),
        eq: activeSounds.reduce((acc, sound) => ({ ...acc, [sound]: eq[sound] ?? { bass: 0.5, mid: 0.5, treble: 0.5 } }), {})
      },
      tags: activeSounds.map(sound => ({
        icon: '✨',
        name: sound,
        pct: (volumes[sound] ?? 1) * 100
      }))
    };

    try {
      const existing = localStorage.getItem(PUBLISHED_MIXES_KEY);
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem(PUBLISHED_MIXES_KEY, JSON.stringify([recipe, ...parsed]));
      alert('Mixagem publicada com sucesso na aba Comunidade!');
      setStep(1);
      setTitle('');
      onClose();
    } catch (e) {
      alert('Erro ao publicar.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#060b13] border border-white/10 rounded-[2rem] p-6 shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            <button onClick={() => { setStep(1); onClose(); }} className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10 z-10">
              <X className="w-4 h-4 text-white" />
            </button>
            
            {step === 1 ? (
              <>
                <div className="flex flex-col mb-4">
                  <h2 className="text-xl font-poppins font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent-blue" />
                    Ajustar Mixagem
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Ajuste os volumes e equalizações finais antes de publicar.
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 mb-6">
                  {SOUND_CONFIGS.map(sound => {
                    const isActive = activeSounds.includes(sound.id);
                    return (
                      <div key={`pub-${sound.id}`} className={`flex flex-col gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 transition-all ${!isActive ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white font-medium">
                            <sound.icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'text-gray-500'}`} />
                            {sound.label} {!isActive && <span className="text-xs text-gray-500 font-normal ml-1">(Desligado)</span>}
                          </div>
                          <button 
                            onClick={() => toggleSound(sound.id)}
                            className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-accent-blue' : 'bg-gray-600'}`}
                          >
                            <motion.div 
                              className="w-4 h-4 rounded-full bg-white absolute top-1 left-1 shadow-sm"
                              animate={{ x: isActive ? 16 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                        
                        {/* Volume */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-gray-400">Volume</span>
                            <span className="text-accent-blue font-mono text-xs">{Math.round((volumes[sound.id] || 1) * 100)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0" max="1" step="0.01"
                            disabled={!isActive}
                            value={volumes[sound.id] || 1}
                            onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
                            className="w-full appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue"
                          />
                        </div>

                        {/* EQ */}
                        <div className="flex flex-col gap-3">
                          {/* Bass */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Graves</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              disabled={!isActive}
                              value={eq[sound.id]?.bass ?? 0.5}
                              onChange={(e) => onEQChange(sound.id, 'bass', parseFloat(e.target.value))}
                              className="w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                            />
                          </div>
                          {/* Mid */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Médios</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              disabled={!isActive}
                              value={eq[sound.id]?.mid ?? 0.5}
                              onChange={(e) => onEQChange(sound.id, 'mid', parseFloat(e.target.value))}
                              className="w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400"
                            />
                          </div>
                          {/* Treble */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Agudos</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              disabled={!isActive}
                              value={eq[sound.id]?.treble ?? 0.5}
                              onChange={(e) => onEQChange(sound.id, 'treble', parseFloat(e.target.value))}
                              className="w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => {
                    if (activeSounds.length === 0) {
                      alert('Ative pelo menos um som para publicar.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full bg-accent-blue text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-transform hover:scale-105"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6 mt-2">
                  <button onClick={() => setStep(1)} className="mr-3 p-1 rounded-full hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <h2 className="text-xl font-poppins font-bold text-white">Detalhes do Mixer</h2>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Nome</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Foco Absoluto"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue transition-colors"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`py-2 rounded-xl border text-sm transition-colors ${category === cat.id ? 'border-accent-blue bg-accent-blue/10 text-accent-blue font-medium' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                          {cat.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Cor de Destaque</label>
                    <div className="flex gap-3">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: c }}
                        >
                          {color === c && <Check className="w-5 h-5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePublish}
                  className="w-full mt-8 bg-accent-blue text-white font-bold py-4 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-transform hover:scale-105"
                >
                  Publicar na Comunidade
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
