import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Link, Check, Play, Trees, MoreVertical, Trash2, Volume, Volume2, Pause, Bookmark, Users, Heart, ChevronDown, Activity, Circle, Disc, Grid3x3, Wind, Droplets, Flame, Bird, Compass, Baby, Moon, Bus, BookOpen, Shield, Eye, EyeOff } from 'lucide-react';
import { playSound, stopSound, setVolume, setEQ } from '../lib/audioEngine';
import { MixRecipe, MOCK_RECIPES, getAllRecipes } from '../data/mockRecipes';
import { PUBLISHED_MIXES_KEY } from './PublishMixOverlay';

function PassingLights({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => {
        const isVertical = i % 2 === 0;
        const startPos = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 2 + Math.random() * 4;
        return (
          <motion.div
            key={i}
            initial={
              isVertical
                ? { top: "-10%", left: `${startPos}%`, opacity: 0 }
                : { left: "-10%", top: `${startPos}%`, opacity: 0 }
            }
            animate={
              isVertical
                ? { top: "110%", opacity: [0, 0.8, 0] }
                : { left: "110%", opacity: [0, 0.8, 0] }
            }
            transition={{
              repeat: Infinity,
              duration,
              delay,
              ease: "linear",
            }}
            className="absolute rounded-full"
            style={{
              width: isVertical ? '2px' : '40px',
              height: isVertical ? '40px' : '2px',
              background: `linear-gradient(${isVertical ? 'to bottom' : 'to right'}, transparent, ${color}, transparent)`
            }}
          />
        );
      })}
    </div>
  );
}


const CATEGORIES = [
  { id: 'destaques', title: 'Destaques' },
  { id: 'foco', title: 'Foco' },
  { id: 'sono', title: 'Relaxamento' },
  { id: 'infantil', title: 'Infantil' },
  { id: 'transporte', title: 'Transporte' }
];

const SCENARIOS = [
  { id: 'foco', label: 'Foco Profundo', icon: Circle },
  { id: 'sono', label: 'Sono Rápido', icon: Moon },
  { id: "relaxamento", label: "Relaxamento", icon: Trees },
  { id: 'infantil', label: 'Infantil', icon: Baby },
  { id: 'transporte', label: 'Transporte', icon: Bus },
];

const RecipeCard: React.FC<{ recipe: MixRecipe, isThisPlaying: boolean, handlePlay: (r: MixRecipe) => void | Promise<void> }> = ({ recipe, isThisPlaying, handlePlay }) => {
  const Icon = recipe.icon;
    return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => handlePlay(recipe)}
      style={isThisPlaying ? { boxShadow: `0 0 20px ${recipe.color}40`, borderColor: `${recipe.color}80` } : {}}
      className={`group relative shrink-0 w-44 h-56 rounded-3xl p-5 flex flex-col justify-end overflow-hidden cursor-pointer bg-[#060b13] border transition-all ${
        isThisPlaying ? 'border-white/30' : 'border-white/5 hover:border-white/20'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#060b13]/60 z-10" />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-10 pointer-events-none" />
        <motion.div 
          animate={isThisPlaying ? { scale: [1, 1.2, 1], rotate: [0, 90, 0] } : {}}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-50 blur-2xl" 
          style={{ 
            background: `radial-gradient(circle at center, ${recipe.color} 0%, transparent 50%)` 
          }} 
        />
      </div>

      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <Icon className="w-12 h-12" style={{ color: recipe.color }} strokeWidth={1} />
      </div>

      <div className="relative z-20 text-center w-full mt-auto">
        <h3 className="text-sm font-poppins font-light text-white/90 leading-tight mb-1">{recipe.title}</h3>
        <p className="text-[10px] text-white/50 uppercase tracking-widest">{recipe.creator}</p>
      </div>

      <div className="absolute right-4 top-4 z-20 opacity-80">
        {isThisPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
      </div>
    </motion.div>
  );
}

export interface CommunityViewProps {
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
}

export function CommunityView({ themeMode, kidsTheme }: CommunityViewProps) {
  const [currentMix, setCurrentMix] = useState<string | null>(null);
  const [combinedRecipes, setCombinedRecipes] = useState<MixRecipe[]>(MOCK_RECIPES);
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';

  useEffect(() => {
    try {
      const existing = localStorage.getItem(PUBLISHED_MIXES_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        const mapped = parsed.map((p: any) => ({ ...p, icon: Activity }));
        setCombinedRecipes(getAllRecipes());
      }
    } catch(e) {}
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  const handleDeleteMix = (id: string) => {
    if (true) {
      try {
        const existing = localStorage.getItem(PUBLISHED_MIXES_KEY);
        if (existing) {
          const parsed = JSON.parse(existing);
          const filtered = parsed.filter((p: any) => p.id !== id);
          localStorage.setItem(PUBLISHED_MIXES_KEY, JSON.stringify(filtered));
          setCombinedRecipes(getAllRecipes());
          if (currentMix === id) {
            setIsPlaying(false);
            setIsFullPlayerOpen(false);
            if (activeRecipe) {
               Object.keys(activeRecipe.config.volumes).forEach(soundId => {
                  stopSound(soundId);
               });
            }
          }
        }
      } catch(e) {}
    }
  };

  const [isUiHidden, setIsUiHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(1);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  
  const [savedMixes, setSavedMixes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_community_mixes');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });


  const handlePlay = async (recipe: MixRecipe) => {
    if (currentMix === recipe.id && isPlaying) {
      // Pause logic
      Object.keys(recipe.config.volumes).forEach(soundId => {
        stopSound(soundId);
      });
      setIsPlaying(false);
    } else {
      if (currentMix && isPlaying) {
        const prevRecipe = combinedRecipes.find(r => r.id === currentMix);
        if (prevRecipe) {
          Object.keys(prevRecipe.config.volumes).forEach(soundId => {
            stopSound(soundId);
          });
        }
      }
      setCurrentMix(recipe.id);
      setIsPlaying(true);
      const sounds = Object.keys(recipe.config.volumes);
      for (const soundId of sounds) {
        await playSound(soundId);
      }
      setTimeout(() => {
        for (const soundId of sounds) {
          setVolume(soundId, (recipe.config.volumes[soundId] || 1) * globalVolume);
          if (recipe.config.eq[soundId]) {
            setEQ(soundId, 'bass', recipe.config.eq[soundId].bass);
            setEQ(soundId, 'mid', recipe.config.eq[soundId].mid);
            setEQ(soundId, 'treble', recipe.config.eq[soundId].treble);
          }
        }
      }, 100); 
    }
  };

  
  

  const activeRecipe = combinedRecipes.find(r => r.id === currentMix);

  useEffect(() => {
    if (activeRecipe && isPlaying) {
      const sounds = Object.keys(activeRecipe.config.volumes);
      for (const soundId of sounds) {
        setVolume(soundId, (activeRecipe.config.volumes[soundId] || 1) * globalVolume);
      }
    }
  }, [globalVolume, activeRecipe, isPlaying]);

  return (
    <div className="w-full h-full overflow-y-auto pb-48 relative bg-[#060b13]">

      {/* Header */}
      <div className="pt-16 px-4 mb-8">
        <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-bold text-white font-poppins mb-2 tracking-tight">Comunidade</h1>
        <p className="text-gray-400 text-sm">Explore e compartilhe mixagens sonoras.</p>
      </div>

      {/* Scenarios Grid */}
      <div className="px-4 mb-8">
         <h2 className="text-lg font-medium font-poppins text-white mb-4">Cenários</h2>
         <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.map(sc => (
               <button 
                  key={sc.id} 
                  onClick={() => setActiveScenario(activeScenario === sc.id ? null : sc.id)}
                  className={`h-12 rounded-2xl border flex items-center justify-between px-4 transition-colors ${
                     activeScenario === sc.id ? 'bg-white/10 border-white/30' : 'glass-card border-white/5 hover:bg-white/10'
                  }`}
               >
                  <div className="flex items-center gap-2">
                     <sc.icon className={`w-4 h-4 ${activeScenario === sc.id ? 'text-white' : 'text-gray-400'}`} />
                     <span className={`text-xs font-medium ${activeScenario === sc.id ? 'text-white' : 'text-gray-400'}`}>{sc.label}</span>
                  </div>
               </button>
            ))}
         </div>
      </div>

      {/* Carousels for Categories / Filtered View */}
      <div className="space-y-8 pb-12">
        {activeScenario ? (
          <div className="px-4">
            <h2 className="text-lg font-medium font-poppins text-white mb-4">
               {SCENARIOS.find(s => s.id === activeScenario)?.label}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {combinedRecipes.filter(r => r.category === activeScenario || activeScenario === 'destaques').map(recipe => (
                <div key={recipe.id} className="w-full">
                  <RecipeCard recipe={recipe} isThisPlaying={currentMix === recipe.id && isPlaying} handlePlay={handlePlay} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          CATEGORIES.map(category => {
            let displayRecipes = [];
            if (category.id === 'destaques') {
              displayRecipes = combinedRecipes.slice(0, 4);
            } else {
              displayRecipes = combinedRecipes.filter(r => r.category === category.id);
            }

            if (displayRecipes.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-lg font-medium font-poppins text-white px-4 mb-4">{category.title}</h2>
                <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar cursor-grab active:cursor-grabbing">
                  {displayRecipes.map(recipe => (
                    <RecipeCard key={recipe.id + category.id} recipe={recipe} isThisPlaying={currentMix === recipe.id && isPlaying} handlePlay={handlePlay} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {activeRecipe && !isFullPlayerOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed bottom-[95px] left-4 right-4 z-40 pointer-events-auto"
          >
            <div 
              onClick={() => setIsFullPlayerOpen(true)}
              className="bg-[#0b1320] border border-white/10 rounded-[2rem] p-2 pr-4 flex items-center justify-between shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#060b13] flex items-center justify-center relative overflow-hidden">
                   {isPlaying && <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                     className="absolute inset-0 border-[1.5px] border-dashed border-white/30 rounded-full"
                   />}
                   <activeRecipe.icon className="w-5 h-5 text-white relative z-10" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white font-poppins">{activeRecipe.title}</span>
                  <span className="text-[10px] text-gray-400">Mixagem Ativa</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(activeRecipe);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white z-50 relative"
              >
                {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Endel-like Player */}
      <AnimatePresence>
        {isFullPlayerOpen && activeRecipe && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            className="fixed inset-0 z-[60] bg-[#060b13] overflow-hidden flex flex-col pointer-events-auto"
          >

            {/* Endel Animations based on play state */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
               {isPlaying && (
                 <>
                   {/* Central pulsing abstract rings */}
                   <motion.div
                     animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                     transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full border-[0.5px] border-white/20"
                   />
                   <motion.div
                     animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05], rotate: [0, 90, 0] }}
                     transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full border-[0.5px] border-white/30"
                   />
                   <motion.div
                     animate={{ scale: [1, 2, 1], opacity: [0.02, 0.08, 0.02] }}
                     transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full border-[0.5px] border-white/10"
                   />

                   {/* Floating structural elements / Light particles */}
                   <motion.div
                     animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0], x: [0, 10, 0] }}
                     transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                     className="absolute top-[30%] left-[30%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                   />
                   <motion.div
                     animate={{ y: [0, 30, 0], opacity: [0, 0.6, 0], x: [0, -15, 0] }}
                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                     className="absolute bottom-[40%] right-[30%] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                   />
                   <motion.div
                     animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                     transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                     className="absolute top-[50%] left-[70%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                   />
                    <motion.div
                     animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0], x: [0, -5, 0] }}
                     transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                     className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                   />
                   
                   <PassingLights color={activeRecipe.color} />
                 </>
               )}
            </div>
            <div className="relative z-10 flex flex-col h-full p-6" onClick={() => { if (isUiHidden) setIsUiHidden(false); if (isMenuOpen) setIsMenuOpen(false); }}>
              {/* Top Bar */}
              <div className={`flex justify-center items-center relative transition-opacity duration-500 ${isUiHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                 <div className="flex flex-col items-center mt-4">
                    <span className="text-white font-medium text-lg font-poppins">{activeRecipe.title}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-widest">{activeRecipe.category}</span>
                 </div>
              </div>

              
              {/* Close / Back button */}
              <AnimatePresence>
                {!isUiHidden && (
                  <>
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsFullPlayerOpen(false)}
                      className="absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors z-20 pointer-events-auto"
                    >
                      <ChevronDown className="w-8 h-8" strokeWidth={1.5} />
                    </motion.button>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-6 right-6 z-30 pointer-events-auto"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-8 h-8" strokeWidth={1.5} />
                      </button>

                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ transformOrigin: 'top right' }}
                            className="absolute top-14 right-0 min-w-[200px] glass-card rounded-2xl p-4 flex flex-col gap-4 shadow-xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-2">
                               <div className="flex justify-between items-center text-xs text-white/70 uppercase tracking-widest font-medium px-1">
                                 <span>Volume</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Volume className="w-4 h-4 text-white/50" />
                                  <input 
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={globalVolume}
                                    onChange={(e) => setGlobalVolume(Number(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <Volume2 className="w-4 h-4 text-white/50" />
                               </div>
                            </div>

                            {activeRecipe?.id.startsWith('mix-user-') && (
                              <>
                                <div className="h-px bg-white/10 w-full" />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); handleDeleteMix(activeRecipe.id); }}
                                  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors px-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm font-medium">Deletar Mix</span>
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>


              <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 pointer-events-none">
                 {/* Minimalist central icon - dynamic animation depending on play state */}
                 <motion.div 
                    animate={isPlaying ? { 
                      y: [0, -15, 0, -10, 0], 
                      x: [-5, 5, -5, 5, -5],
                      rotate: [-5, 5, -5, 5, -5] 
                    } : { y: 0, x: 0, rotate: 0 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-32 h-32 flex items-center justify-center mb-8 relative"
                 >
                    {isPlaying && <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-dashed border-white/30"
                    />}
                    <activeRecipe.icon className="w-16 h-16 text-white" strokeWidth={1} style={{ color: activeRecipe.color }} />
                 </motion.div>

                 {/* Tags/Levels */}
                 <div className={`w-full max-w-[200px] mx-auto space-y-6 transition-all duration-500 pointer-events-auto ${isUiHidden ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                    {activeRecipe.tags.map((tag, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-[10px] text-white/50 uppercase tracking-widest">{tag.name}</span>
                        </div>
                        <div className="w-full h-[2px] bg-white/5 relative">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${tag.pct}%` }}
                             transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                             className="absolute left-0 top-0 bottom-0"
                             style={{ backgroundColor: isPlaying ? activeRecipe.color : "rgba(255,255,255,0.4)" }}
                           />
                           {isPlaying && (
                              <motion.div 
                                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 + idx, ease: "easeInOut" }}
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                style={{ left: `calc(${tag.pct}% - 3px)`, backgroundColor: activeRecipe.color, boxShadow: `0 0 8px ${activeRecipe.color}` }}
                              />
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center pointer-events-auto w-full">
                
                <AnimatePresence>
                  {!isUiHidden && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="w-full flex justify-center gap-4 px-4 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-2"
                    >
                        {/* Horizontal mix selector list */}
                        {combinedRecipes.map(recipe => (
                            <button
                              key={'carousel-'+recipe.id}
                              onClick={(e) => { e.stopPropagation(); handlePlay(recipe); }}
                              className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                                  currentMix === recipe.id ? '' : 'border-white/10 bg-transparent hover:border-white/30 hover:bg-white/10'
                              }`}
                              style={currentMix === recipe.id ? { 
                                borderColor: recipe.color, 
                                backgroundColor: `${recipe.color}20`,
                                boxShadow: `0 0 15px ${recipe.color}33`
                              } : {}}
                            >
                              <recipe.icon 
                                className="w-5 h-5" 
                                style={{ color: currentMix === recipe.id ? recipe.color : 'rgba(255, 255, 255, 0.5)' }} 
                                strokeWidth={1.5} 
                              />
                            </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pb-12 relative w-full max-w-[300px] h-20 mx-auto flex items-center justify-center">
                   
                   <motion.button
                     animate={{ x: isUiHidden ? 0 : -90 }}
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsUiHidden(!isUiHidden);
                     }}
                     className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
                   >
                     {isUiHidden ? <Eye className="w-6 h-6" strokeWidth={1.5} /> : <EyeOff className="w-6 h-6" strokeWidth={1.5} />}
                   </motion.button>
                   
                   <AnimatePresence>
                     {!isUiHidden && (
                       <motion.button
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1, x: 0 }}
                         exit={{ opacity: 0, scale: 0.5 }}
                         onClick={(e) => { e.stopPropagation(); handlePlay(activeRecipe); }}
                         className="absolute w-20 h-20 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/5 transition-colors z-10"
                       >
                         {isPlaying ? <Pause className="w-8 h-8" fill="none" strokeWidth={1} /> : <Play className="w-8 h-8 ml-1" fill="none" strokeWidth={1} />}
                       </motion.button>
                     )}
                   </AnimatePresence>
                   
                   <AnimatePresence>
                     {!isUiHidden && (
                       <motion.button
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1, x: 90 }}
                         exit={{ opacity: 0, scale: 0.5 }}
                         onClick={(e) => {
                           e.stopPropagation();
                           const isSaved = savedMixes.includes(activeRecipe.id);
                           setSavedMixes(prev => {
                             const next = isSaved ? prev.filter(id => id !== activeRecipe.id) : [...prev, activeRecipe.id];
                             localStorage.setItem('saved_community_mixes', JSON.stringify(next));
                             return next;
                           });
                         }}
                         className="absolute w-12 h-12 rounded-full flex items-center justify-center transition-colors z-10"
                       >
                          <Bookmark className={`w-6 h-6 transition-colors ${savedMixes.includes(activeRecipe.id) ? 'text-accent-blue' : 'text-white/40 hover:text-white'}`} fill={savedMixes.includes(activeRecipe.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                       </motion.button>
                     )}
                   </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
