import { Canvas } from '@react-three/fiber';
import { SoundNebulaShader } from '../components/ui/SoundNebulaShader';
import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';
import { MathematicalVisualizer } from '../components/ui/MathematicalVisualizer';
import PinkNoiseShader from '../components/ui/PinkNoiseShader';
import { LightSpeed } from '../components/ui/light-speed';
import Nucleus from '../components/ui/nucleus';
import NatureLandscapeShader from '../components/ui/NatureLandscapeShader';
import WaterShader from '../components/ui/water-shader';
import FireShader from '../components/ui/fire-shader';
import RainShader from '../components/ui/rain-shader';
import UniverseWithinShader from '../components/ui/UniverseWithinShader';
import { PublishMixOverlay } from "./PublishMixOverlay";
import { AdultMixerOverlay } from "../components/AdultMixerOverlay";
import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark, Brain, Grid3x3, Moon, Bus, Baby, BookOpen, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { setVolume, setEQ, preloadSounds, toggleGlobalPause, updateMediaSession } from '../lib/audioEngine';
import { FloatingDinoBackground } from '../components/FloatingDinoBackground';
import { FloatingCarsBackground } from '../components/FloatingCarsBackground';

interface HomeViewProps {
  onPanic: () => void;
  onRefugeToggle: () => void;
  isRefugeActive: boolean;
  activeSounds: Record<string, boolean>;
  toggleSound: (soundId: string, url?: string) => void;
  importedSounds: {id: string, name: string, url: string}[];
  setImportedSounds: React.Dispatch<React.SetStateAction<{id: string, name: string, url: string}[]>>;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
}



function MixerOverlay({ dominantSoundId, dominantLabel, DominantIcon, activeSoundIds, allMixerSounds, volumes, handleVolumeChange, setIsMixerOpen, isGlobalPause, setIsGlobalPause, eq, handleEQChange, themeMode, kidsTheme, onFavorite }) {
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [showEQ, setShowEQ] = useState(false);

  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';

  const getSliderTrackClass = () => {
    if (isSpaceTheme) return 'bg-gradient-to-r from-[#602EC9] to-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]';
    if (isDinoTheme) return 'bg-gradient-to-r from-[#553100] to-[#80F356] shadow-[0_0_8px_rgba(128,243,86,0.5)]';
    if (isCarsTheme) return 'bg-white/30';
    return 'bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]';
  };

  const getEQSliderTrackClass = () => {
    if (isSpaceTheme) return 'bg-gradient-to-r from-[#602EC9] to-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]';
    if (isDinoTheme) return 'bg-gradient-to-r from-[#553100] to-[#80F356] shadow-[0_0_8px_rgba(128,243,86,0.5)]';
    if (isCarsTheme) return 'bg-white/30';
    return 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#060b13] flex flex-col pointer-events-auto overflow-hidden"
    >
       {/* New Quantum Nebula Background Shader */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          {themeMode === 'child' && (
            dominantSoundId?.startsWith('imported-') ? <MathematicalVisualizer soundId={dominantSoundId} /> : dominantSoundId === 'marrom' ? <LightSpeed speed={0.4} /> : dominantSoundId === 'natureza' ? <NatureLandscapeShader /> : dominantSoundId === 'passaros' ? <UniverseWithinShader /> : dominantSoundId === 'branco' ? <Nucleus /> : dominantSoundId === 'agua' ? <WaterShader /> : dominantSoundId === 'lareira' ? <FireShader /> : dominantSoundId === 'chuva' ? <RainShader /> : dominantSoundId === 'rosa' ? <PinkNoiseShader /> : <GenerativeArtSceneV3 />
          )}
       </div>

       {/* Overlay UI Layer */}
       <div className="relative z-10 flex flex-col h-full w-full">
         
         {/* Top Bar - Hidden when isUiHidden */}
         <div className={`flex items-center justify-between p-6 mt-4 transition-all duration-500 ${isUiHidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
           <button onClick={() => setIsMixerOpen(false)} className="text-white/70 hover:text-white p-2">
             <ChevronDown className="w-8 h-8" strokeWidth={1.5} />
           </button>
           
           <div className="flex flex-col items-center">
             <span className="text-white font-bold text-lg">{dominantLabel || "Mixagem"}</span>
             <span className="text-white/50 text-[10px] tracking-widest uppercase mt-1 font-bold">Mixer</span>
           </div>
           
           <button onClick={() => setShowEQ(!showEQ)} className={`p-2 transition-colors ${showEQ ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
             <MoreVertical className="w-6 h-6" />
           </button>
         </div>

         {/* Spacer */}
         <div className="flex-1" />

         {/* Main Content Area (Volumes or EQ) */}
         <div className={`w-full max-w-sm mx-auto px-6 pb-8 space-y-8 z-20 transition-all duration-500 ${isUiHidden ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            
            {showEQ ? (
              // EQ CONTROLS
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 space-y-6">
                <div className="text-center text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Equalizador Geral</div>
                {['bass', 'mid', 'treble'].map(band => {
                  // We'll control EQ for the dominant sound, or ideally all active sounds.
                  // For simplicity, we control the dominant sound's EQ.
                  const currentEq = eq[dominantSoundId] || { bass: 0.5, mid: 0.5, treble: 0.5 };
                  const val = currentEq[band];
                  const labels = { bass: 'Graves', mid: 'Médios', treble: 'Agudos' };
                  return (
                    <div key={band} className="flex flex-col gap-3 relative">
                      <div className="flex justify-between items-center text-white/50 text-[10px] font-bold tracking-widest uppercase">
                        <span>{labels[band]}</span>
                        <span>{Math.round(val * 100)}%</span>
                      </div>
                      <div className="relative w-full h-[12px] flex items-center">
                        {/* Track background */}
                        <div className="absolute w-full h-[4px] bg-white/10 rounded-full flex items-center overflow-hidden pointer-events-none">
                           {isCarsTheme && (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                 <div className="w-full h-[1px] border-b-2 border-dashed border-white/50" />
                              </div>
                           )}
                        </div>

                        {/* Track Fill */}
                        <div className={`absolute left-0 h-[4px] rounded-full pointer-events-none ${getEQSliderTrackClass()}`} style={{ width: `${val * 100}%` }}></div>
                        
                        {/* Custom Thumb */}
                        <div className="absolute pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[60]" style={{ left: `${val * 100}%`, top: '50%' }}>
                           {isSpaceTheme ? (
                             <div className="w-10 h-10 bg-contain bg-center bg-no-repeat drop-shadow-lg" style={{ backgroundImage: "url('/themes/space/et.png')" }} />
                           ) : isDinoTheme ? (
                             <div className="w-10 h-10 bg-contain bg-center bg-no-repeat drop-shadow-lg" style={{ backgroundImage: "url('/themes/dinossauro/dinosaur_smile.png')" }} />
                           ) : isCarsTheme ? (
                             <div className="w-10 h-10 bg-contain bg-center bg-no-repeat drop-shadow-lg" style={{ backgroundImage: "url('/themes/cars/helmet.png')" }} />
                           ) : (
                             <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                           )}
                        </div>

                        <input
                           type="range"
                           min="0" max="1" step="0.01"
                           value={val}
                           onChange={(e) => {
                             e.stopPropagation();
                             // Apply to all active sounds for a "global" EQ feel, or just dominant
                             activeSoundIds.forEach(id => {
                               handleEQChange(id, band, parseFloat(e.target.value));
                             });
                           }}
                           className="absolute inset-0 w-full appearance-none bg-transparent h-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-transparent cursor-pointer z-50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // VOLUME CONTROLS
              <>
                {activeSoundIds.length === 0 && (
                   <div className="text-center text-white/40 text-sm">Nenhum som ativo</div>
                )}
                {activeSoundIds.map(id => {
                   const sound = allMixerSounds.find(s => s.id === id);
                   const vol = volumes[id] !== undefined ? volumes[id] : 1;
                   return (
                     <div key={id} className="flex flex-col gap-3 relative">
                       <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{sound?.label}</span>
                       <div className="relative w-full h-[12px] flex items-center">
                         {/* Track background */}
                         <div className="absolute w-full h-[4px] bg-white/10 rounded-full flex items-center overflow-hidden pointer-events-none">
                            {isCarsTheme && (
                               <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <div className="w-full h-[1px] border-b-2 border-dashed border-white/50" />
                               </div>
                            )}
                         </div>

                         {/* Track Fill */}
                         <div className={`absolute left-0 h-[4px] rounded-full pointer-events-none ${getSliderTrackClass()}`} style={{ width: `${vol * 100}%` }}></div>
                         
                         {/* Custom Thumb */}
                         <div className="absolute pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[60]" style={{ left: `${vol * 100}%`, top: '50%' }}>
                            {isSpaceTheme ? (
                              <div className="w-10 h-10 bg-contain bg-center bg-no-repeat -rotate-45 drop-shadow-lg" style={{ backgroundImage: "url('/themes/space/rocekt.png')" }} />
                            ) : isDinoTheme ? (
                              <div className="w-10 h-10 bg-contain bg-center bg-no-repeat drop-shadow-lg" style={{ backgroundImage: "url('/themes/dinossauro/fossil_rex.png')" }} />
                            ) : isCarsTheme ? (
                              <div className="relative w-14 h-7 drop-shadow-lg scale-75">
                                {/* Tires */}
                                <div className="absolute -top-1 left-2 w-3 h-2 bg-gray-900 rounded-sm"></div>
                                <div className="absolute -bottom-1 left-2 w-3 h-2 bg-gray-900 rounded-sm"></div>
                                <div className="absolute -top-1 right-2 w-3 h-2 bg-gray-900 rounded-sm"></div>
                                <div className="absolute -bottom-1 right-2 w-3 h-2 bg-gray-900 rounded-sm"></div>
                                {/* Chassis */}
                                <div className="absolute inset-0 bg-red-500 rounded-xl overflow-hidden shadow-inner border border-red-700/50">
                                  {/* Front Hood */}
                                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-red-600 rounded-r-xl"></div>
                                  {/* Windshield */}
                                  <div className="absolute right-3 top-1 bottom-1 w-2.5 bg-sky-900 rounded border border-gray-800/50"></div>
                                  {/* Roof */}
                                  <div className="absolute left-2 right-6 top-1 bottom-1 bg-red-700 rounded-sm"></div>
                                  {/* Rear Window */}
                                  <div className="absolute left-1 top-1.5 bottom-1.5 w-1.5 bg-sky-900 rounded-sm"></div>
                                </div>
                                {/* Headlights */}
                                <div className="absolute top-1 right-0 w-1 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_8px_3px_rgba(253,224,71,0.9)]"></div>
                                <div className="absolute bottom-1 right-0 w-1 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_8px_3px_rgba(253,224,71,0.9)]"></div>
                                {/* Taillights */}
                                <div className="absolute top-1.5 left-0 w-0.5 h-1 bg-red-300 shadow-[0_0_6px_2px_rgba(239,68,68,0.9)]"></div>
                                <div className="absolute bottom-1.5 left-0 w-0.5 h-1 bg-red-300 shadow-[0_0_6px_2px_rgba(239,68,68,0.9)]"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)]" />
                            )}
                         </div>

                         <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={vol}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleVolumeChange(id, parseFloat(e.target.value));
                            }}
                            className="absolute inset-0 w-full appearance-none bg-transparent h-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-transparent cursor-pointer z-50"
                         />
                       </div>
                     </div>
                   )
                })}
              </>
            )}
         </div>

         {/* Bottom Controls */}
         <div className="mt-auto pb-12 relative flex items-center justify-center h-24 z-20">
            <AnimatePresence>
          {activeSoundIds.length > 0 && (
            <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 20 }} 
                  className="absolute flex items-center justify-center gap-12 w-full"
                >
                  <button onClick={(e) => { e.stopPropagation(); setIsUiHidden(true); }} className="text-white/30 hover:text-white transition-colors">
                    <EyeOff className="w-6 h-6 transition-all" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsGlobalPause(!isGlobalPause); }}
                    className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     {isGlobalPause ? <Play className="w-8 h-8 text-white ml-1" fill="none" strokeWidth={1} /> : <Pause className="w-8 h-8 text-white" fill="none" strokeWidth={1} />}
                  </button>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <Bookmark className="w-6 h-6" onClick={(e) => { 
  e.stopPropagation(); 
  if (activeSoundIds.length > 0) {
    onFavorite({ 
      id: 'fav_' + Date.now().toString(), 
      name: 'Meu Mix ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      activeSoundIds, 
      volumes, 
      eq,
      dominantSoundId
    });
    alert('Mix Favoritado!');
  } else {
    alert('Selecione pelo menos um som para favoritar!');
  }
}} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isUiHidden && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.5 }} 
                  className="absolute flex items-center justify-center w-full"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsUiHidden(false); }} 
                    className="w-[72px] h-[72px] rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     <Eye className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
       </div>
    </motion.div>
  );
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

function getIconComponentForName(title: string) {
  const t = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (t.includes('cabeca') || t.includes('cerebro') || t.includes('mente') || t.includes('pensamento') || t.includes('acalmar')) return Brain;
  if (t.includes('foco') || t.includes('estudar') || t.includes('trabalho') || t.includes('produtividade')) return Grid3x3;
  if (t.includes('dormir') || t.includes('sono') || t.includes('noite') || t.includes('descanso')) return Moon;
  if (t.includes('relaxar') || t.includes('calma') || t.includes('paz') || t.includes('zen') || t.includes('vento')) return Wind;
  if (t.includes('chuva') || t.includes('agua') || t.includes('tempestade') || t.includes('mar')) return Droplets;
  if (t.includes('natureza') || t.includes('floresta') || t.includes('arvore') || t.includes('passaros')) return Trees;
  if (t.includes('viagem') || t.includes('onibus') || t.includes('carro') || t.includes('aviao')) return Bus;
  if (t.includes('bebe') || t.includes('crianca') || t.includes('infantil')) return Baby;
  if (t.includes('leitura') || t.includes('livro') || t.includes('estudo')) return BookOpen;
  if (t.includes('fogo') || t.includes('lareira')) return Flame;
  return Activity;
}


export function HomeView({ onPanic, onRefugeToggle, isRefugeActive, activeSounds, toggleSound, importedSounds, setImportedSounds, themeMode, kidsTheme }: HomeViewProps) {
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';
  useEffect(() => {
    preloadSounds();
  }, []);

  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isGlobalPause, setIsGlobalPause] = useState(false);


  const handleToggleSound = (id: string, url?: string) => {
    if (isGlobalPause) setIsGlobalPause(false);
    toggleSound(id, url);
  };
  useEffect(() => { toggleGlobalPause && toggleGlobalPause(isGlobalPause); }, [isGlobalPause]);
  const [isPublishOverlayOpen, setIsPublishOverlayOpen] = useState(false);
  const [favoriteMixes, setFavoriteMixes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'todos' | 'favoritos'>('todos');
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_favorite_mixes_local');
      if (stored) setFavoriteMixes(JSON.parse(stored));
    } catch(e) {}
  }, []);
  const saveFavorite = (mix: any) => {
    const updated = [...favoriteMixes, mix];
    setFavoriteMixes(updated);
    localStorage.setItem('user_favorite_mixes_local', JSON.stringify(updated));
  };
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
    ...importedSounds.map(s => ({ id: s.id, label: s.name, icon: getIconComponentForName(s.name) }))
  ];

  const activeSoundIds = Object.keys(activeSounds).filter(id => activeSounds[id]);
  let dominantSoundId = null;
  let maxVol = -1;
  for (const id of activeSoundIds) {
    const v = volumes[id] || 1;
    if (v > maxVol) {
      maxVol = v;
      dominantSoundId = id;
    }
  }
  const DominantIcon = dominantSoundId ? allMixerSounds.find(s => s.id === dominantSoundId)?.icon : null;
  const dominantLabel = dominantSoundId ? allMixerSounds.find(s => s.id === dominantSoundId)?.label : 'Silêncio';
  useEffect(() => {
    updateMediaSession(dominantLabel || 'TEA SoundScapes');
  }, [dominantLabel, activeSoundIds]);

  useEffect(() => {
    const onPlay = () => setIsGlobalPause(false);
    const onPause = () => setIsGlobalPause(true);
    const onStop = () => {
      // Clear sounds? Or just let state update naturally?
      // Since audioEngine stopped everything, activeSoundIds might be out of sync.
      // But we can just set global pause to true for now.
      setIsGlobalPause(true);
    };

    window.addEventListener('mediaSessionPlay', onPlay);
    window.addEventListener('mediaSessionPause', onPause);
    window.addEventListener('mediaSessionStop', onStop);

    return () => {
      window.removeEventListener('mediaSessionPlay', onPlay);
      window.removeEventListener('mediaSessionPause', onPause);
      window.removeEventListener('mediaSessionStop', onStop);
    };
  }, []);


  return (

    <>
      {themeMode !== 'child' && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: 'rgba(0, 0, 0, 0.93)' }} />
      )}
      
      
      

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative z-10 p-6 pt-16 flex flex-col h-full max-w-md mx-auto overflow-y-auto pb-44"
      >
      <header className="mb-8 shrink-0 flex justify-between items-start">
        <div>
          <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
          <h1 className="text-3xl font-poppins font-bold tracking-tight text-white">Mixer Principal</h1>
        </div>
        <div className="flex gap-2">
          {themeMode !== 'child' && (
            <>
              <button 
                onClick={() => setIsPublishOverlayOpen(true)} 
                className="px-4 py-2 bg-accent-blue text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 transition-all"
              >
                Publicar
              </button>
              <button 
                onClick={() => setIsMixerOpen(true)} 
                aria-label="Abrir Mixer Avançado"
                className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 transition-all text-gray-300 hover:text-white shadow-lg hover:shadow-accent-blue/10"
              >
                <MoreVertical className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </header>

      {favoriteMixes.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'todos' ? 'bg-white text-black' : 'glass-card text-white hover:bg-white/10'}`}
          >
            Todos os Sons
          </button>
          <button 
            onClick={() => setActiveTab('favoritos')}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'favoritos' ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'glass-card text-white hover:bg-white/10'}`}
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
      <div className="grid grid-cols-2 gap-4 flex-1 content-start mb-8">
        {SOUND_CONFIGS.map((sound) => {
          const isActive = activeSounds[sound.id];
          return (
            <button
              key={sound.id}
              onClick={() => { handleToggleSound(sound.id); if (themeMode === 'child' && !isActive) { setIsMixerOpen(true); } }}
              className={`flex flex-col items-center justify-center p-6 gap-3 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
                isActive 
                  ? (isDinoTheme 
                    ? 'bg-[#553100]/80 shadow-[0_0_15px_rgba(85,49,0,0.5)] border-[#80F356]/60' 
                    : isSpaceTheme 
                    ? 'bg-[#602EC9]/40 shadow-[0_0_15px_rgba(96,46,201,0.5)] border-[#8B5CF6]/60'
                    : isCarsTheme 
                    ? 'bg-[#FACC15]/20 shadow-[0_0_15px_rgba(250,204,21,0.4)] border-[#FACC15]/60'
                    : 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]')
                  : (isDinoTheme
                    ? 'bg-[#553100]/30 border-white/10 hover:bg-[#553100]/50'
                    : 'glass-card border-white/10 hover:bg-white/10 hover:border-white/20')
              }`}
            >
              <sound.icon className={`w-8 h-8 ${isActive 
                ? (isDinoTheme ? 'text-[#80F356] drop-shadow-[0_0_8px_rgba(128,243,86,0.6)]' 
                  : isSpaceTheme ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : isCarsTheme ? 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                  : 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]') 
                : 'text-gray-400'}`} />
              {!isActive && <span className="text-xs text-gray-500 font-medium tracking-wider">OFF</span>}
              <span className={`text-sm mt-1 z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {sound.label}
              </span>
            </button>
          );
        })}
        
        {importedSounds.map((sound) => {
          const isActive = activeSounds[sound.id];
          const IconComponent = getIconComponentForName(sound.name);
          return (
            <div key={sound.id} className="relative">
              <button
                onClick={() => { handleToggleSound(sound.id, sound.url); if (themeMode === 'child' && !isActive) { setIsMixerOpen(true); } }}
                className={`w-full flex flex-col items-center justify-center p-6 gap-3 rounded-2xl border transition-all duration-300 ${
                  isActive 
                  ? (isDinoTheme 
                    ? 'bg-[#553100]/80 shadow-[0_0_15px_rgba(85,49,0,0.5)] border-[#80F356]/60' 
                    : isSpaceTheme 
                    ? 'bg-[#602EC9]/40 shadow-[0_0_15px_rgba(96,46,201,0.5)] border-[#8B5CF6]/60' 
                    : isCarsTheme 
                    ? 'bg-[#FACC15]/20 shadow-[0_0_15px_rgba(250,204,21,0.4)] border-[#FACC15]/60' 
                    : 'glass-card-active shadow-[0_0_15px_rgba(56,189,248,0.2)]')
                  : (isDinoTheme
                    ? 'bg-[#553100]/30 border-white/10 hover:bg-[#553100]/50'
                    : 'glass-card border-white/10 hover:bg-white/5')
                }`}
              >
                <IconComponent className={`w-8 h-8 shrink-0 ${isActive 
                ? (isDinoTheme ? 'text-[#80F356] drop-shadow-[0_0_8px_rgba(128,243,86,0.6)]' 
                  : isSpaceTheme ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : isCarsTheme ? 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                  : 'text-accent-blue drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]') 
                : 'text-gray-400'}`} />
                {!isActive && <span className="text-xs text-gray-500 font-medium tracking-wider">OFF</span>}
                <span className={`text-sm mt-1 z-10 w-full truncate text-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {sound.name}
                </span>
              </button>
              
            <button 
                 onClick={(e) => {
                    e.stopPropagation();
                    if (activeSounds[sound.id]) handleToggleSound(sound.id);
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
      )}

      <div className="flex gap-4 mt-auto shrink-0 mb-4">
        <button
          onClick={onRefugeToggle}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full border overflow-hidden transition-all duration-200 font-medium active:scale-95 hover:scale-[1.02] ${
            isRefugeActive 
              ? (isDinoTheme 
                  ? 'bg-[#553100] text-[#80F356] shadow-[0_0_20px_rgba(85,49,0,0.6)] border-white/30 hover:brightness-110' 
                  : isSpaceTheme 
                  ? 'bg-[#602EC9] text-white shadow-[0_0_20px_rgba(96,46,201,0.4)] border-transparent hover:brightness-110 hover:shadow-[0_0_25px_rgba(96,46,201,0.6)]'
                  : isCarsTheme
                  ? 'bg-[#FACC15] text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] border-transparent hover:brightness-110 hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]'
                  : 'bg-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] border-transparent hover:brightness-110 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]')
              : (isDinoTheme 
                  ? 'bg-[#553100] text-[#80F356] border-white/10 hover:brightness-125 hover:border-[#80F356]/40 hover:shadow-[0_0_15px_rgba(128,243,86,0.2)]'
                  : isSpaceTheme
                  ? 'bg-white/5 hover:bg-white/15 text-[#602EC9] border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(96,46,201,0.25)]'
                  : isCarsTheme
                  ? 'bg-white/5 hover:bg-white/15 text-[#FACC15] border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)]'
                  : 'bg-white/5 hover:bg-white/15 text-accent-blue border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]')
          }`}
        >
          <ShieldAlert className="w-5 h-5 fill-current" />
          Meu Refúgio
        </button>
        
        <button
          onClick={onPanic}
          className="w-24 h-24 rounded-full bg-[#e11d48] hover:bg-[#be123c] border-2 border-white/20 text-white flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95 transition-all"
        >
          <span className="font-bold text-sm tracking-wider text-white">SOS</span>
          <span className="text-xs font-semibold text-white">PÂNICO</span>
        </button>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <>
        
        
        <AnimatePresence>
          {activeSoundIds.length > 0 && !isMixerOpen && themeMode === 'child' && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-[105px] left-4 right-4 z-40 cursor-pointer"
              onClick={() => { if (themeMode === 'child') setIsMixerOpen(true); }}
            >
              <div className="bg-[#0B1121] border border-white/10 rounded-full p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/5 relative">
                     {DominantIcon && <DominantIcon className="w-6 h-6 text-white" />}
                     {!isGlobalPause && <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-white/30"></motion.div>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-wide">{dominantLabel}</span>
                    <span className="text-accent-blue text-xs opacity-80">Mixagem Ativa</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsGlobalPause(!isGlobalPause); 
                    // To truly pause audio, we might need a global context toggle, 
                    // for now we trust state isGlobalPause.
                  }}
                  className="w-12 h-12 flex items-center justify-center text-white relative z-50 pointer-events-auto"
                >
                  {isGlobalPause ? <Play className="w-6 h-6 ml-1" fill="currentColor" /> : <Pause className="w-6 h-6" fill="currentColor" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMixerOpen && themeMode === 'child' && (
            <MixerOverlay 
               onFavorite={saveFavorite}
               dominantSoundId={dominantSoundId} 
               dominantLabel={dominantLabel} 
               DominantIcon={DominantIcon} 
               activeSoundIds={activeSoundIds} 
               allMixerSounds={allMixerSounds} 
               volumes={volumes} 
               handleVolumeChange={handleVolumeChange} 
               setIsMixerOpen={setIsMixerOpen} 
               isGlobalPause={isGlobalPause} 
               setIsGlobalPause={setIsGlobalPause} 
               eq={eq}
               handleEQChange={handleEQChange}
               themeMode={themeMode}
               kidsTheme={kidsTheme}
            />
          )}
          {isMixerOpen && themeMode !== 'child' && (
            <AdultMixerOverlay
               isOpen={isMixerOpen}
               onClose={() => setIsMixerOpen(false)}
               allMixerSounds={allMixerSounds}
               activeSounds={activeSounds}
               toggleSound={handleToggleSound}
               volumes={volumes}
               onVolumeChange={handleVolumeChange}
               eq={eq}
               onEQChange={handleEQChange}
               onFavorite={saveFavorite}
            />
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
