import { PublishMixOverlay } from "./PublishMixOverlay";
import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { setVolume, setEQ, preloadSounds } from '../lib/audioEngine';

interface HomeViewProps {
  onPanic: () => void;
  onRefugeToggle: () => void;
  isRefugeActive: boolean;
  activeSounds: Record<string, boolean>;
  toggleSound: (soundId: string, url?: string) => void;
  importedSounds: {id: string, name: string, url: string}[];
  setImportedSounds: React.Dispatch<React.SetStateAction<{id: string, name: string, url: string}[]>>;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;
}

export const SOUND_CONFIGS = [
  { id: 'chuva', label: 'Chuva', icon: CloudRain },
  { id: 'branco', label: 'Ruído Branco', icon: Activity },
  { id: 'vento', label: 'Vento', icon: Wind },
  { id: 'rosa', label: 'Ruído Rosa', icon: Activity },
  { id: 'marrom', label: 'Ruído Marrom', icon: Activity },
  { id: 'lareira', label: 'Lareira', icon: Flame },
  { id: 'agua', label: 'Água', icon: Droplets },
  { id: 'passaros', label: 'Pássaros', icon: Bird },
  { id: 'natureza', label: 'Natureza', icon: Trees },
];

const FloatingDinoBackground = React.memo(() => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'
      }}
    >
      <div className="absolute inset-0 w-full max-w-md mx-auto">
        {/* Clouds */}
        <motion.img src="/cloud.png" className="absolute -top-4 -left-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" className="absolute -top-2 left-[20%] w-32 opacity-90" animate={{ y: [0, -8, 0], x: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" className="absolute top-0 left-[40%] w-32 opacity-90" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" className="absolute -top-2 right-[15%] w-32 opacity-90" animate={{ y: [0, -7, 0], x: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} style={{ willChange: 'transform' }} />
        <motion.img src="/cloud.png" className="absolute -top-4 -right-4 w-32 opacity-90" animate={{ y: [0, -5, 0], x: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ willChange: 'transform' }} />

        {/* Fossils */}
        <motion.img src="/fossil.png" className="absolute top-24 left-4 w-24 opacity-90" animate={{ y: [0, -10, 0], rotate: [-20, -15, -20] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/fossil_rex.png" className="absolute top-[35%] right-2 w-28 opacity-90" animate={{ y: [0, -15, 0], rotate: [10, 15, 10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />

        {/* Characters */}
        <motion.img src="/dino_fofo.png" className="absolute bottom-24 left-[-10px] w-32 z-10" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform' }} />
        <motion.img src="/dino_alto.png" className="absolute bottom-16 left-[20%] w-64 z-0" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ willChange: 'transform' }} />
        <motion.img src="/fantasia_dino.png" className="absolute bottom-28 right-[-10px] w-32 z-10" animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform' }} />

        {/* Bottom Foliage */}
        <motion.img src="/arvore.png" className="absolute bottom-[-10px] left-[-30px] w-56 opacity-100 z-20" animate={{ rotate: [0, 2, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
        <motion.img src="/floresta.png" className="absolute bottom-[-20px] right-[-40px] w-72 opacity-100 z-20" animate={{ rotate: [0, -2, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
        <motion.img src="/palmeiras.png" className="absolute bottom-8 left-16 w-32 z-30" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
        <motion.img src="/palmeiras.png" className="absolute bottom-12 right-16 w-24 z-30" animate={{ rotate: [2, -2, 2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ willChange: 'transform', transformOrigin: 'bottom center' }} />
      </div>
    </div>
  );
});

const FloatingSpaceBackground = React.memo(() => {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden" 
      style={{ width: '100vw', height: '100vh' }}
    >
      <motion.div 
        className="absolute top-[30%] left-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/2 opacity-30 blur-3xl rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'conic-gradient(from 0deg, var(--color-aurora-cyan), var(--color-aurora-teal), transparent, var(--color-aurora-cyan))',
          willChange: 'transform'
        }}
      />
      
      {/* Floating 2D Space Images */}
      <div className="absolute inset-0 w-full max-w-md mx-auto">
        {/* Satellite */}
        <motion.img 
          src="/satellite.png" 
          alt=""
          className="absolute top-[10%] -right-8 w-28 opacity-70"
          animate={{ y: [0, -15, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
        />
        
        {/* Planet */}
        <motion.img 
          src="/planet.png" 
          alt=""
          className="absolute top-[30%] -left-12 w-40 opacity-60"
          animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />
        
        {/* Planet 2 */}
        <motion.img 
          src="/planet2.png" 
          alt=""
          className="absolute bottom-[20%] -right-6 w-32 opacity-50"
          animate={{ y: [0, -20, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: 'transform' }}
        />
        
        {/* Moon */}
        <motion.img 
          src="/moon.png" 
          alt=""
          className="absolute top-[45%] -right-10 w-20 opacity-80"
          animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ willChange: 'transform' }}
        />

        {/* Meteor */}
        <motion.img 
          src="/meteor.png" 
          alt=""
          className="absolute top-[5%] left-4 w-24 opacity-75"
          animate={{ y: [0, -30, 0], x: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ willChange: 'transform' }}
        />
        
        {/* Rocket */}
        <motion.img 
          src="/rocekt.png" 
          alt=""
          className="absolute bottom-[10%] -left-8 w-28 opacity-80"
          animate={{ y: [0, -25, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          style={{ willChange: 'transform' }}
        />

        {/* Estrela Cadente */}
        <motion.img 
          src="/estrela_cadente.png" 
          alt=""
          className="absolute top-[20%] right-[10%] w-32 opacity-80"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0], 
            rotate: [0, 10, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  );
});

export function HomeView({ onPanic, onRefugeToggle, isRefugeActive, activeSounds, toggleSound, importedSounds, setImportedSounds, themeMode, kidsTheme }: HomeViewProps) {
  useEffect(() => {
    preloadSounds();
  }, []);

  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isPublishOverlayOpen, setIsPublishOverlayOpen] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({
    chuva: 1, branco: 1, vento: 1, rosa: 1, marrom: 1, lareira: 1, agua: 1, passaros: 1, natureza: 1
  });
  const [eq, setEq] = useState<Record<string, { bass: number, mid: number, treble: number }>>({
    chuva: {bass: 0.5, mid: 0.5, treble: 0.5},
    branco: {bass: 0.5, mid: 0.5, treble: 0.5},
    vento: {bass: 0.5, mid: 0.5, treble: 0.5},
    rosa: {bass: 0.5, mid: 0.5, treble: 0.5},
    marrom: {bass: 0.5, mid: 0.5, treble: 0.5},
    lareira: {bass: 0.5, mid: 0.5, treble: 0.5},
    agua: {bass: 0.5, mid: 0.5, treble: 0.5},
    passaros: {bass: 0.5, mid: 0.5, treble: 0.5},
    natureza: {bass: 0.5, mid: 0.5, treble: 0.5}
  });

  const handleVolumeChange = (soundId: string, value: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: value }));
    setVolume(soundId, value);
  };

  const handleEQChange = (soundId: string, band: 'bass' | 'mid' | 'treble', value: number) => {
    setEq(prev => ({ 
      ...prev, 
      [soundId]: { 
        ...(prev[soundId] || {bass: 0.5, mid: 0.5, treble: 0.5}), 
        [band]: value 
      } 
    }));
    setEQ(soundId, band, value);
  };

  const handleImportAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newSound = { id: `imported-${Date.now()}`, name: file.name, url };
    setImportedSounds(prev => [...prev, newSound]);
    setVolumes(prev => ({ ...prev, [newSound.id]: 1 }));
    setEq(prev => ({ ...prev, [newSound.id]: { bass: 0.5, mid: 0.5, treble: 0.5 } }));
  };

  const allMixerSounds = [
    ...SOUND_CONFIGS,
    ...importedSounds.map(s => ({ id: s.id, label: s.name, icon: Activity }))
  ];

  return (
    <>
      {themeMode === 'child' && kidsTheme === 'space' && <FloatingSpaceBackground />}
      {themeMode === 'child' && kidsTheme === 'dino' && <FloatingDinoBackground />}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative z-10 p-6 pt-16 flex flex-col h-full max-w-md mx-auto overflow-y-auto pb-32"
      >
      <header className="mb-8 shrink-0 flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
          <h1 className="text-3xl font-poppins font-bold tracking-tight text-white">Mixer Principal</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPublishOverlayOpen(true)} 
            className="px-4 py-2 bg-accent-blue text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 transition-all"
          >
            Publicar
          </button>
          <button onClick={() => setIsMixerOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/10 transition-colors">
            <MoreVertical className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 flex-1 content-start mb-8">
        {SOUND_CONFIGS.map((sound) => {
          const isActive = activeSounds[sound.id];
          return (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 ${
                isActive ? 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'glass-card hover:bg-white/5'
              }`}
            >
              <sound.icon className={`w-8 h-8 ${isActive ? 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'text-gray-400'}`} />
              {!isActive && <span className="text-xs text-gray-500 font-medium tracking-wider">OFF</span>}
              <span className={`text-sm mt-1 z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {sound.label}
              </span>
            </button>
          );
        })}
        
        {importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          return (
            <div key={sound.id} className="relative">
              <button
                onClick={() => toggleSound(sound.id, sound.url)}
                className={`w-full flex flex-col items-center justify-center p-6 gap-3 transition-all duration-300 ${
                  isActive ? 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'glass-card hover:bg-white/5'
                }`}
              >
                <Activity className={`w-8 h-8 shrink-0 ${isActive ? 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'text-gray-400'}`} />
                {!isActive && <span className="text-xs text-gray-500 font-medium tracking-wider">OFF</span>}
                <span className={`text-sm mt-1 z-10 w-full truncate text-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {sound.name}
                </span>
              </button>
              <button 
                 onClick={(e) => {
                    e.stopPropagation();
                    if (activeSounds[sound.id]) toggleSound(sound.id);
                    setImportedSounds(prev => prev.filter(s => s.id !== sound.id));
                 }}
                 className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/40 text-gray-400 hover:text-white hover:bg-white/10"
              >
                 <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        
        {/* Import Audio Card */}
        <button 
          onClick={() => document.getElementById('import-audio-input')?.click()}
          className="import-audio-btn flex flex-col items-center justify-center p-6 gap-3 rounded-2xl border border-dashed border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors active:scale-95"
        >
          <div className="w-8 h-8 rounded-full border border-accent-blue/50 flex items-center justify-center bg-accent-blue/10">
            <span className="text-accent-blue font-light text-xl">+</span>
          </div>
          <span className="text-sm text-accent-blue font-medium text-center leading-tight">Importar<br/>Áudio</span>
          <input type="file" id="import-audio-input" onChange={handleImportAudio} className="hidden" accept="audio/*" />
        </button>
      </div>

      <div className="flex gap-4 mt-auto shrink-0 mb-4">
        <button
          onClick={onRefugeToggle}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full transition-all duration-300 font-medium ${
            isRefugeActive 
              ? 'bg-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]' 
              : 'glass-card text-accent-blue hover:bg-white/10'
          }`}
        >
          <ShieldAlert className="w-5 h-5 fill-current" />
          Meu Refúgio
        </button>
        
        <button
          onClick={onPanic}
          className="sos-btn w-24 h-24 rounded-full border border-danger-panic text-danger-panic flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="font-bold text-sm tracking-wider text-danger-panic">SOS</span>
          <span className="text-xs font-semibold text-danger-panic">PÂNICO</span>
        </button>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <>
        <AnimatePresence>
          {isMixerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMixerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-[#060b13]/95 backdrop-blur-xl border-t border-accent-blue/20 rounded-t-3xl pt-6 pb-10 px-6 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-6 h-6 text-accent-blue" />
                    <h2 className="text-xl font-poppins font-bold text-white">Mixer</h2>
                  </div>
                  <button onClick={() => setIsMixerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/10 text-gray-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
                  {allMixerSounds.map(sound => {
                    const isActive = activeSounds[sound.id];
                    return (
                      <div key={`mix-${sound.id}`} className={`flex flex-col gap-4 ${!isActive ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex items-center gap-3 text-white font-medium mb-1">
                          <sound.icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'text-gray-500'}`} />
                          {sound.label} {!isActive && <span className="text-xs text-gray-500 font-normal ml-2">(Desligado)</span>}
                        </div>
                        
                        {/* Volume Control */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-gray-400">Volume</span>
                            <span className="text-accent-blue font-mono text-xs">{Math.round((volumes[sound.id] || 1) * 100)}%</span>
                          </div>
                          {(() => {
                            const vol = volumes[sound.id] || 1;
                            if (themeMode === 'child') {
                              let thumbEmoji = '🟢';
                              let trackClass = 'bg-white/10 h-3';
                              
                              if (kidsTheme === 'space') {
                                return (
                                  <input 
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={vol}
                                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                    disabled={!isActive}
                                    className="w-full appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[url('/rocekt.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rotate-90 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-[url('/rocekt.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rotate-90"
                                  />
                                );
                              }

                              if (kidsTheme === 'dino') { thumbEmoji = '☄️'; }
                              
                              else if (kidsTheme === 'cars') { thumbEmoji = '🚗'; trackClass = 'bg-gray-600 h-4 border-y border-dashed border-yellow-400/50'; }
                              else if (kidsTheme === 'animals') { thumbEmoji = '🐾'; }
                              else if (kidsTheme === 'magic') { thumbEmoji = '✨'; }

                              return (
                                <div className="relative w-full h-8 flex items-center group">
                                  <div className={`absolute left-0 right-0 rounded-full ${trackClass}`} />
                                  <div 
                                    className="absolute h-full flex items-center justify-center text-2xl transition-transform" 
                                    style={{ left: `calc(${vol * 100}% - 16px)`, transform: vol > 0.5 ? 'scale(1.2)' : 'scale(1)', pointerEvents: 'none' }}
                                  >
                                    {thumbEmoji}
                                  </div>
                                  <input 
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={vol}
                                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                    disabled={!isActive}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                  />
                                </div>
                              );
                            }

                            return (
                              <input 
                                type="range"
                                min="0" max="1" step="0.01"
                                value={vol}
                                onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                disabled={!isActive}
                                className="w-full appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                              />
                            );
                          })()}
                        </div>
                        
                        {/* EQ Controls */}
                        <div className="flex flex-col gap-3">
                          {/* Bass Control */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Graves</span>
                              <span className="text-purple-400 font-mono text-[10px]">{Math.round(((eq[sound.id]?.bass ?? 0.5) - 0.5) * 30)}dB</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              value={eq[sound.id]?.bass ?? 0.5}
                              onChange={(e) => handleEQChange(sound.id, 'bass', parseFloat(e.target.value))}
                              disabled={!isActive}
                              className={themeMode === 'child' && (kidsTheme === 'space' || kidsTheme === 'dino') 
                                ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/et.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[url('/et.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                : "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(192,132,252,0.8)]"
                              }
                            />
                          </div>

                          {/* Mid Control */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Médios</span>
                              <span className="text-emerald-400 font-mono text-[10px]">{Math.round(((eq[sound.id]?.mid ?? 0.5) - 0.5) * 30)}dB</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              value={eq[sound.id]?.mid ?? 0.5}
                              onChange={(e) => handleEQChange(sound.id, 'mid', parseFloat(e.target.value))}
                              disabled={!isActive}
                              className={themeMode === 'child' && (kidsTheme === 'space' || kidsTheme === 'dino') 
                                ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/et.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[url('/et.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                : "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                              }
                            />
                          </div>

                          {/* Treble Control */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] uppercase tracking-wider text-gray-400">Agudos</span>
                              <span className="text-amber-400 font-mono text-[10px]">{Math.round(((eq[sound.id]?.treble ?? 0.5) - 0.5) * 30)}dB</span>
                            </div>
                            <input 
                              type="range"
                              min="0" max="1" step="0.01"
                              value={eq[sound.id]?.treble ?? 0.5}
                              onChange={(e) => handleEQChange(sound.id, 'treble', parseFloat(e.target.value))}
                              disabled={!isActive}
                              className={themeMode === 'child' && (kidsTheme === 'space' || kidsTheme === 'dino') 
                                ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/et.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[url('/et.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                : "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <PublishMixOverlay
          isOpen={isPublishOverlayOpen}
          onClose={() => setIsPublishOverlayOpen(false)}
          volumes={volumes}
          eq={eq}
          activeSounds={Object.keys(activeSounds).filter(k => activeSounds[k])}
          onVolumeChange={handleVolumeChange}
          onEQChange={handleEQChange}
          toggleSound={toggleSound}
        />
        </>,
        document.body
      )}
    </motion.div>
    </>
  );
}
