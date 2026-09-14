import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, SlidersHorizontal, Volume2, RotateCcw, Bookmark, Check } from 'lucide-react';

interface SoundItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AdultMixerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  allMixerSounds: SoundItem[];
  activeSounds: Record<string, boolean>;
  toggleSound: (id: string, url?: string) => void;
  volumes: Record<string, number>;
  onVolumeChange: (id: string, value: number) => void;
  eq: Record<string, { bass: number; mid: number; treble: number }>;
  onEQChange: (id: string, band: 'bass' | 'mid' | 'treble', value: number) => void;
  onFavorite?: (mix: any) => void;
}

export function AdultMixerOverlay({
  isOpen,
  onClose,
  allMixerSounds,
  activeSounds,
  toggleSound,
  volumes,
  onVolumeChange,
  eq,
  onEQChange,
  onFavorite
}: AdultMixerOverlayProps) {
  const activeIds = Object.keys(activeSounds).filter(id => activeSounds[id]);
  const [filterTab, setFilterTab] = useState<'todos' | 'ativos'>('todos');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const displayedSounds = filterTab === 'ativos'
    ? allMixerSounds.filter(s => activeSounds[s.id])
    : allMixerSounds;

  const handleSaveFavorite = () => {
    if (onFavorite && activeIds.length > 0) {
      onFavorite({
        id: 'fav_' + Date.now().toString(),
        name: 'Mix Personalizado ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeSoundIds: activeIds,
        volumes,
        eq,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-[#0B1121] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-full bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-poppins font-bold text-white tracking-tight">
                  Ajustes do Mixer
                </h2>
                <p className="text-xs text-gray-400">
                  Ajuste com o cursor o volume, graves, médios e agudos de cada som.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar ajustes"
              className="w-10 h-10 shrink-0 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 my-4 shrink-0">
            <button
              onClick={() => setFilterTab('todos')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterTab === 'todos'
                  ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Todos os Sons ({allMixerSounds.length})
            </button>
            <button
              onClick={() => setFilterTab('ativos')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterTab === 'ativos'
                  ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeIds.length > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              Sons Ativos ({activeIds.length})
            </button>
          </div>

          {/* Sounds List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {displayedSounds.length === 0 ? (
              <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-3">
                <Volume2 className="w-8 h-8 opacity-40" />
                <p className="text-sm">Nenhum som ativo no momento.</p>
                <button
                  onClick={() => setFilterTab('todos')}
                  className="text-xs text-accent-blue hover:underline font-semibold"
                >
                  Ver todos os sons para ligar e ajustar
                </button>
              </div>
            ) : (
              displayedSounds.map((sound) => {
                const isActive = !!activeSounds[sound.id];
                const currentVol = volumes[sound.id] !== undefined ? volumes[sound.id] : 1;
                const currentEq = eq[sound.id] || { bass: 0.5, mid: 0.5, treble: 0.5 };
                const Icon = sound.icon;

                return (
                  <div
                    key={sound.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-white/[0.05] border-accent-blue/40 shadow-[0_0_15px_rgba(56,189,248,0.06)]'
                        : 'bg-white/[0.02] border-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Sound Top Row: Icon + Name + Toggle */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-accent-blue/20 text-accent-blue'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            {sound.label}
                            {isActive ? (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Tocando
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                                Desligado
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>

                      {/* On/Off Switch */}
                      <button
                        onClick={() => toggleSound(sound.id)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                          isActive ? 'bg-accent-blue' : 'bg-white/10 hover:bg-white/20'
                        }`}
                        aria-label={`Ligar/Desligar ${sound.label}`}
                      >
                        <motion.div
                          animate={{ x: isActive ? 22 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-5 h-5 rounded-full bg-white shadow-md"
                        />
                      </button>
                    </div>

                    {/* Sliders Container */}
                    <div className="mt-3.5 space-y-3.5">
                      {/* Volume Slider */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs text-gray-400">Volume</span>
                          <span className="text-accent-blue font-mono text-xs">
                            {Math.round(currentVol * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={currentVol}
                          onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
                          disabled={!isActive}
                          className="w-full appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                        />
                      </div>

                      {/* EQ Sliders */}
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                            Equalização (Frequências)
                          </span>
                          <button
                            onClick={() => {
                              onEQChange(sound.id, 'bass', 0.5);
                              onEQChange(sound.id, 'mid', 0.5);
                              onEQChange(sound.id, 'treble', 0.5);
                            }}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                            title="Resetar equalização para 50%"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Padrão
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Graves */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-amber-300 mb-1">
                              <span>Graves</span>
                              <span className="font-mono">{Math.round(currentEq.bass * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={currentEq.bass}
                              onChange={(e) => onEQChange(sound.id, 'bass', parseFloat(e.target.value))}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer accent-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                            />
                          </div>

                          {/* Médios */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-purple-300 mb-1">
                              <span>Médios</span>
                              <span className="font-mono">{Math.round(currentEq.mid * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={currentEq.mid}
                              onChange={(e) => onEQChange(sound.id, 'mid', parseFloat(e.target.value))}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer accent-purple-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                            />
                          </div>

                          {/* Agudos */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-cyan-300 mb-1">
                              <span>Agudos</span>
                              <span className="font-mono">{Math.round(currentEq.treble * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={currentEq.treble}
                              onChange={(e) => onEQChange(sound.id, 'treble', parseFloat(e.target.value))}
                              className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer accent-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between shrink-0">
            {activeIds.length > 0 && onFavorite ? (
              <button
                onClick={handleSaveFavorite}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Salvo nos Favoritos!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-accent-blue" />
                    Salvar Mix
                  </>
                )}
              </button>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-accent-blue text-white font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Concluir
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
