import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Check, Download, Lightbulb, ChevronDown, Share2, Trash2, FileText, Filter } from 'lucide-react';
import { saveReport, getReportsByUser, deleteReport, Report } from '../lib/reportDB';
import { CarsFuelTank } from '../components/CarsFuelTank';

const MOODS = [
  { id: 'great', emoji: '😇', label: 'Ótimo', min: 0, max: 20 },
  { id: 'good', emoji: '🙂', label: 'Bom', min: 21, max: 40 },
  { id: 'neutral', emoji: '😐', label: 'Neutro', min: 41, max: 60 },
  { id: 'bad', emoji: '😟', label: 'Ruim', min: 61, max: 80 },
  { id: 'terrible', emoji: '😩', label: 'Péssimo', min: 81, max: 100 },
];

const TRIGGERS = ['Barulho', 'Luzes', 'Multidão', 'Transporte', 'Escola', 'Shopping', 'Cansaço'];
const STRATEGIES = ['Meu Refúgio', 'Sair do local', 'Respiração', 'Música', 'Nenhum'];


const FuelTankMood = ({ mood }: { mood: string }) => {
  const config = {
    great: { level: 100, color: '#22c55e', text: 'F' },
    good: { level: 75, color: '#84cc16', text: '3/4' },
    neutral: { level: 50, color: '#eab308', text: '1/2' },
    bad: { level: 25, color: '#f97316', text: '1/4' },
    terrible: { level: 10, color: '#ef4444', text: 'E' },
  }[mood] || { level: 50, color: '#eab308', text: '1/2' };

  return (
    <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex flex-col items-center justify-end rounded-lg overflow-hidden bg-black/60 border-2 border-white/10 shrink-0">
       <div 
         className="absolute bottom-0 w-full transition-all duration-500" 
         style={{ height: `${config.level}%`, backgroundColor: config.color, opacity: 0.8 }}
       />
       <svg className="absolute inset-0 w-full h-full p-2 text-white/90 drop-shadow-md z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M3 22v-8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v8"/><path d="M14 22V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>
       </svg>
       {/* Small F and E markers */}
       {mood === 'great' && (
         <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] font-bold text-white z-20">F</span>
       )}
       {mood === 'terrible' && (
         <span className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] font-bold text-red-300 z-20">E</span>
       )}
    </div>
  );
};

const AstronautMood = ({ mood, kidsTheme }: { mood: string; kidsTheme?: string }) => {
  let imgSrc = '';
  const currentTheme = kidsTheme || (typeof window !== 'undefined' ? localStorage.getItem('kidsTheme') : 'space') || 'space';
  const themeName = currentTheme === 'dino' ? 'dinossauro' : currentTheme;

  switch (mood) {
    case 'great':
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dinosaur_happy.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/chegada.png';
      else imgSrc = '/themes/space/happy-astronaut.png';
      break;
    case 'good':
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dinosaur_smile.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/carro.png';
      else imgSrc = '/themes/space/astronaut-calm.png';
      break;
    case 'neutral':
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dinosaur_neutral.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/cronometro.png';
      else imgSrc = '/themes/space/alien_neutral.png';
      break;
    case 'bad':
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dynosaurus_angry.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/cone.png';
      else imgSrc = '/themes/space/alien_sad.png';
      break;
    case 'terrible':
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dinossaur_rage.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/bandeira_corrida.png';
      else imgSrc = '/themes/space/alien_rage.png';
      break;
    default:
      if (themeName === 'dinossauro') imgSrc = '/themes/dinossauro/dinosaur_neutral.png';
      else if (themeName === 'cars') imgSrc = '/themes/cars/cronometro.png';
      else imgSrc = '/themes/space/alien_neutral.png';
  }
  return <img src={imgSrc} alt={mood} className="w-[2em] h-[2em] object-contain drop-shadow-md scale-125" />;
};


interface DiaryRecord {
  intensity: number;
  moodId: string;
  triggers: string[];
  estrategiaUsadaString?: string;
  observacao?: string;
  date: number; // timestamp
}

interface DiaryViewProps {
  startView?: 'registro' | 'analises' | 'relatorios';
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
  isChildAutonomyMode?: boolean;
  onAutonomyComplete?: () => void;
}

export function DiaryView({ startView = 'registro', themeMode, kidsTheme, isChildAutonomyMode, onAutonomyComplete }: DiaryViewProps) {
  const [activeTab, setActiveTab] = useState<'registro' | 'analises' | 'relatorios'>(startView);
  const [records, setRecords] = useState<DiaryRecord[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const email = localStorage.getItem('currentUserEmail');
        const data = localStorage.getItem(`diaryRecords_${email}`);
        if (data) {
          setRecords(JSON.parse(data));
        }
      } catch (e) {}
    };
    
    loadData();
    window.addEventListener('storage', loadData);
    // Custom event for same-window updates
    window.addEventListener('diary-updated', loadData);
    
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('diary-updated', loadData);
    };
  }, []);

  const handleSaveForm = (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => {
    const newRecord: DiaryRecord = {
      intensity,
      moodId,
      triggers,
      estrategiaUsadaString: strategy,
      observacao,
      date: Date.now()
    };
    const newRecords = [...records, newRecord];
    setRecords(newRecords);
    try {
      const email = localStorage.getItem('currentUserEmail');
      localStorage.setItem(`diaryRecords_${email}`, JSON.stringify(newRecords));
      window.dispatchEvent(new Event('diary-updated'));
    } catch(e) {}
    if (isChildAutonomyMode && onAutonomyComplete) {
      onAutonomyComplete();
    } else {
      setActiveTab('analises');
    }
  };

  // Aggregate stats by day for last 30 days
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentRecords = records.filter(r => r.date >= thirtyDaysAgo);

  // Compute stats for the last 30 days
  let totalCrises = 0;
  let goodDays = 0;
  let avgIntensity = 0;
  
  if (recentRecords.length > 0) {
    totalCrises = recentRecords.filter(r => r.intensity >= 60).length;
    goodDays = recentRecords.filter(r => r.intensity <= 40).length;
    avgIntensity = recentRecords.reduce((acc, r) => acc + r.intensity, 0) / recentRecords.length;
  }
  
  const moodEmoji = recentRecords.length === 0 ? '—' : (MOODS.find(m => avgIntensity >= m.min && avgIntensity <= m.max)?.emoji || '😐');

  let trend = '—';
  if (recentRecords.length >= 2) {
    const half = Math.floor(recentRecords.length / 2);
    const firstHalf = recentRecords.slice(0, half);
    const secondHalf = recentRecords.slice(half);
    const avgFirst = firstHalf.reduce((a, r) => a + r.intensity, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, r) => a + r.intensity, 0) / secondHalf.length;
    // lower intensity = better mood => trend UP
    if (avgSecond < avgFirst - 5) trend = '↑';
    else if (avgSecond > avgFirst + 5) trend = '↓';
    else trend = '→';
  } else if (recentRecords.length === 1) {
    trend = '→';
  }

  const dailyData: Record<string, { totalMood: number, count: number }> = {};
  recentRecords.forEach(r => {
    const d = new Date(r.date);
    const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`;
    if (!dailyData[label]) dailyData[label] = { totalMood: 0, count: 0 };
    // 1 to 5 scale calculation
    const moodScore = 5 - (r.intensity / 25);
    dailyData[label].totalMood += moodScore;
    dailyData[label].count += 1;
  });

  const chartData = Object.keys(dailyData).map(day => {
    return {
      day,
      mood: dailyData[day].count > 0 ? (dailyData[day].totalMood / dailyData[day].count) : 0
    };
  }).slice(-30); // limit to 30 days

  // Compute strategy frequences
  const strategyData: Record<string, { count: number, dates: number[] }> = {};
  records.forEach(r => {
    if (r.estrategiaUsadaString) {
      if (!strategyData[r.estrategiaUsadaString]) {
        strategyData[r.estrategiaUsadaString] = { count: 0, dates: [] };
      }
      strategyData[r.estrategiaUsadaString].count += 1;
      strategyData[r.estrategiaUsadaString].dates.push(r.date);
    }
  });
  const topStrategies = Object.keys(strategyData)
    .sort((a, b) => strategyData[b].count - strategyData[a].count)
    .slice(0, 3)
    .map(t => ({ label: t, count: strategyData[t].count, dates: strategyData[t].dates }));

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const heatmapData = [
    [0,0,0,0,0,0,0], // Madrugada (0-5)
    [0,0,0,0,0,0,0], // Manhã (6-11)
    [0,0,0,0,0,0,0], // Tarde (12-17)
    [0,0,0,0,0,0,0]  // Noite (18-23)
  ];
  records.forEach(r => {
    const d = new Date(r.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.intensity >= 60) {
      let day = d.getDay() - 1;
      if (day === -1) day = 6;
      const h = d.getHours();
      let slot = 0;
      if (h >= 6 && h <= 11) slot = 1;
      else if (h >= 12 && h <= 17) slot = 2;
      else if (h >= 18) slot = 3;
      heatmapData[slot][day]++;
    }
  });

  // Compute trigger frequences
  const triggerCounts: Record<string, number> = {};
  records.forEach(r => {
    if (r.intensity >= 60) {
      r.triggers.forEach(t => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    }
  });
  const maxTrigger = Math.max(...Object.values(triggerCounts), 1);
  const topTriggers = Object.keys(triggerCounts)
    .sort((a, b) => triggerCounts[b] - triggerCounts[a])
    .slice(0, 3)
    .map(t => ({ label: t, count: triggerCounts[t], p: Math.round((triggerCounts[t] / maxTrigger) * 100) }));

  // Computed days for relations
  const daysMap: Record<string, { date: number, crises: number, emojis: string[], moodIds: string[], intensities: number[], dateStr: string }> = {};
  records.forEach(r => {
    const dStr = new Date(r.date).toLocaleDateString('pt-BR');
    if (!daysMap[dStr]) daysMap[dStr] = { date: r.date, crises: 0, emojis: [], moodIds: [], intensities: [], dateStr: dStr };
    if (r.intensity >= 60) daysMap[dStr].crises++;
    daysMap[dStr].emojis.push(MOODS.find(m => m.id === r.moodId)?.emoji || '😐');
    daysMap[dStr].moodIds.push(r.moodId);
    daysMap[dStr].intensities.push(r.intensity);
  });
  const diasComCrises = Object.values(daysMap).filter(d => d.crises > 0).sort((a,b) => b.date - a.date).slice(0, 3);
  const diasSemCrises = Object.values(daysMap).filter(d => d.crises === 0).sort((a,b) => b.date - a.date).slice(0, 3);
  
  // Timeline of observations
  const timelineRecords = records.filter(r => r.observacao && r.observacao.trim() !== '' && !r.observacao.includes('Registro automático')).sort((a,b) => b.date - a.date).slice(0, 5);

  const avgMoodId = recentRecords.length === 0 ? null : (MOODS.find(m => avgIntensity >= m.min && avgIntensity <= m.max)?.id);
  const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend, moodId: avgMoodId };
  const effectiveKidsTheme = kidsTheme || (typeof window !== 'undefined' ? localStorage.getItem('kidsTheme') : null);
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';
  const showCarsThemeGauge = effectiveKidsTheme === 'cars';

  return (
    <>
      {themeMode === 'child' && kidsTheme === 'cars' && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.93)' }}
        />
      )}
      {themeMode === 'child' && kidsTheme === 'dino' && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none" 
          style={{ 
            width: '100vw', 
            height: '100vh',
            background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'
          }}
        />
      )}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative z-10 p-6 pt-12 flex flex-col h-full max-w-md mx-auto overflow-y-auto pb-24"
      >
      {!isChildAutonomyMode && (
      <header className="mb-6">
        <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold text-[#f3f4f6] tracking-tight">Diário Terapêutico</h1>
      </header>
      )}

      {/* Tabs */}
      {isChildAutonomyMode ? null : (
      <div className="glass-card flex p-1 mb-8 rounded-full hide-on-print border-[rgba(255,255,255,0.1)]">
        <button 
          onClick={() => setActiveTab('registro')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'registro' ? (isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] text-black border border-[rgba(255,232,56,0.88)] shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_15px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.25)] text-white border border-[rgba(128,243,86,0.79)] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-[rgba(56,189,248,0.2)] text-white border border-[rgba(56,189,248,0.5)] shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isCarsTheme ? 'text-[#9ca3af] hover:text-white hover:bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'text-[#9ca3af] hover:text-[#602EC9] hover:bg-[rgba(96,46,201,0.1)]' : isDinoTheme ? 'text-[#9ca3af] hover:text-[#80F356] hover:bg-[rgba(128,243,86,0.1)]' : 'text-[#9ca3af] hover:text-accent-blue hover:bg-[rgba(56,189,248,0.1)]')}`}
        >
          Registro
        </button>
        <button 
          onClick={() => setActiveTab('analises')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'analises' ? (isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] text-black border border-[rgba(255,232,56,0.88)] shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_15px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.25)] text-[#80F356] border border-[rgba(128,243,86,0.79)] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-[rgba(56,189,248,0.2)] text-accent-blue border border-[rgba(56,189,248,0.5)] shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isCarsTheme ? 'text-[#9ca3af] hover:text-white hover:bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'text-[#9ca3af] hover:text-[#602EC9] hover:bg-[rgba(96,46,201,0.1)]' : isDinoTheme ? 'text-[#9ca3af] hover:text-[#80F356] hover:bg-[rgba(128,243,86,0.1)]' : 'text-[#9ca3af] hover:text-accent-blue hover:bg-[rgba(56,189,248,0.1)]')}`}
        >
          Análises
        </button>
        <button 
          onClick={() => setActiveTab('relatorios')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'relatorios' ? (isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] text-black border border-[rgba(255,232,56,0.88)] shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[#602EC9] text-white shadow-[0_0_15px_rgba(96,46,201,0.6)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.25)] text-[#80F356] border border-[rgba(128,243,86,0.79)] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-[rgba(56,189,248,0.2)] text-accent-blue border border-[rgba(56,189,248,0.5)] shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isCarsTheme ? 'text-[#9ca3af] hover:text-white hover:bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'text-[#9ca3af] hover:text-[#602EC9] hover:bg-[rgba(96,46,201,0.1)]' : isDinoTheme ? 'text-[#9ca3af] hover:text-[#80F356] hover:bg-[rgba(128,243,86,0.1)]' : 'text-[#9ca3af] hover:text-accent-blue hover:bg-[rgba(56,189,248,0.1)]')}`}
        >
          Relatórios
        </button>
      </div>
      )}
      <AnimatePresence mode="wait">
        {activeTab === 'registro' ? <RegistroView key="registro" onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isChildAutonomyMode={isChildAutonomyMode} /> : activeTab === 'analises' ? <AnalisesView key="analises" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} themeMode={themeMode} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} /> : <RelatoriosView key="relatorios" isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} />}
      </AnimatePresence>
    </motion.div>
    </>
  );
}

function RegistroView({ onSave, isDinoTheme, isSpaceTheme, isCarsTheme, isChildAutonomyMode }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean, isChildAutonomyMode?: boolean }) {
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
        <h2 className="text-xl text-[#e5e7eb] mb-6">{isCarsTheme ? 'Como está o seu motor agora?' : 'Como você está agora?'}</h2>
        {isCarsTheme ? (
          <CarsFuelTank intensity={intensity} setIntensity={setIntensity} />
        ) : (
          <>
            <div className="flex justify-between items-center px-2">
              {MOODS.map(mood => (
              <button 
                key={mood.id}
                onClick={() => handleMoodClick(mood.id)}
                className={`transition-all ${(isDinoTheme || isCarsTheme) ? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'text-4xl'} ${selectedMood === mood.id ? 'scale-125' : 'scale-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110'}`}
              >
                {selectedMood === mood.id ? (
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-md scale-150 ${isCarsTheme ? 'bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'bg-[rgba(96,46,201,0.4)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.4)]' : 'bg-[rgba(56,189,248,0.4)]'}`} />
                    <span className={`relative z-10 flex items-center justify-center rounded-full border-2 p-1 ${(isDinoTheme || isCarsTheme) ? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'w-12 h-12'} ${isCarsTheme ? 'border-[rgba(255,232,56,0.88)] shadow-[0_0_15px_rgba(255,232,56,0.79)]' : isSpaceTheme ? 'border-[rgba(96,46,201,0.79)] shadow-[0_0_15px_rgba(56,189,248,0.79)]' : isDinoTheme ? 'border-[rgba(128,243,86,0.79)] shadow-[0_0_15px_rgba(128,243,86,0.79)]' : 'border-[rgba(56,189,248,0.79)] shadow-[0_0_15px_rgba(56,189,248,0.5)]'}`}>
                      {isSpaceTheme ? (
                        <AstronautMood mood={mood.id} />
                      ) : isDinoTheme ? (
                        <img src={mood.id === 'great' ? '/themes/dinossauro/dinosaur_happy.png' : mood.id === 'good' ? '/themes/dinossauro/dinosaur_smile.png' : mood.id === 'neutral' ? '/themes/dinossauro/dinosaur_neutral.png' : mood.id === 'bad' ? '/themes/dinossauro/dynosaurus_angry.png' : '/themes/dinossauro/dinossaur_rage.png'} alt={mood.label} className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0" />
                      ) : isCarsTheme ? (
                        <FuelTankMood mood={mood.id} />
                      ) : (
                        mood.emoji
                      )}
                    </span>
                  </div>
                ) : (
                  <span className={`flex items-center justify-center p-1 rounded-full hover:border transition-all ${(isDinoTheme || isCarsTheme) ? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'w-12 h-12'} ${isCarsTheme ? 'text-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'hover:border-[rgba(96,46,201,0.79)] hover:shadow-[0_0_10px_rgba(56,189,248,0.6)]' : isDinoTheme ? 'hover:border-[rgba(128,243,86,0.79)] hover:shadow-[0_0_10px_rgba(128,243,86,0.6)]' : 'hover:border-[rgba(56,189,248,0.79)] hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]'}`}>
                    {isSpaceTheme ? (
                      <AstronautMood mood={mood.id} />
                    ) : isDinoTheme ? (
                        <img src={mood.id === 'great' ? '/themes/dinossauro/dinosaur_happy.png' : mood.id === 'good' ? '/themes/dinossauro/dinosaur_smile.png' : mood.id === 'neutral' ? '/themes/dinossauro/dinosaur_neutral.png' : mood.id === 'bad' ? '/themes/dinossauro/dynosaurus_angry.png' : '/themes/dinossauro/dinossaur_rage.png'} alt={mood.label} className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0" />
                      ) : isCarsTheme ? (
                        <FuelTankMood mood={mood.id} />
                      ) : (
                        mood.emoji
                      )}
                  </span>
                )}
              </button>
              ))}
            </div>
            
            {/* Intensity Slider */}
            <div className="mt-4">
              <input 
                type="range" 
                min="0" max="100" 
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className={`w-full h-3 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer transition-colors ${isSpaceTheme ? 'accent-[#602EC9] hover:border hover:border-[rgba(96,46,201,0.79)]' : isDinoTheme ? 'accent-[#80F356] hover:border hover:border-[rgba(128,243,86,0.79)]' : 'accent-accent-blue hover:border hover:border-[rgba(56,189,248,0.79)]'}`}
              />
              <div className="flex justify-between text-xs text-[#9ca3af] mt-3">
                <span className={`transition-colors cursor-pointer ${isSpaceTheme ? 'hover:text-[rgba(96,46,201,0.79)]' : isDinoTheme ? 'hover:text-[rgba(128,243,86,0.79)]' : 'hover:text-[rgba(56,189,248,0.79)]'}`} onClick={() => setIntensity(0)}>Calmo</span>
                <span className={`transition-colors cursor-pointer ${isSpaceTheme ? 'hover:text-[rgba(96,46,201,0.79)]' : isDinoTheme ? 'hover:text-[rgba(128,243,86,0.79)]' : 'hover:text-[rgba(56,189,248,0.79)]'}`} onClick={() => setIntensity(100)}>Estressado</span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isChildAutonomyMode && (
      <>
        {/* Triggers */}
        <div>
          <h2 className="text-lg text-[#e5e7eb] mb-4 font-medium">O que aconteceu?</h2>
          <div className="flex flex-wrap gap-3">
            {TRIGGERS.map(trigger => {
              const isSelected = selectedTriggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden ${isSelected ? (isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] border border-[rgba(255,232,56,0.88)] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[rgba(96,46,201,0.2)] border border-[rgba(96,46,201,0.79)] text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.2)] border border-[rgba(128,243,86,0.79)] text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-[rgba(56,189,248,0.2)] border border-[rgba(56,189,248,0.79)] text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-[#9ca3af] hover:text-white hover:bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(96,46,201,0.79)] hover:text-[#602EC9] hover:bg-[rgba(96,46,201,0.1)]' : isDinoTheme ? 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(128,243,86,0.79)] hover:text-[#80F356] hover:bg-[rgba(128,243,86,0.1)]' : 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(56,189,248,0.79)] hover:text-accent-blue hover:bg-[rgba(56,189,248,0.1)]')}`}
                >
                  {isSelected && <Check className={`w-4 h-4 ${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}`} />}
                  {trigger}
                </button>
              );
            })}
          </div>
        </div>

        {/* Strategies */}
        <div>
          <h2 className="text-lg text-[#e5e7eb] mb-4 font-medium">O que ajudou você a se acalmar?</h2>
          <div className="flex flex-wrap gap-3">
            {STRATEGIES.map(s => {
              const isSelected = strategy === s;
              return (
                <button
                  key={s}
                  onClick={() => setStrategy(isSelected ? '' : s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 overflow-hidden ${isSelected ? (isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] border border-[rgba(255,232,56,0.88)] text-black shadow-[0_0_12px_rgba(255,232,56,0.5)]' : isSpaceTheme ? 'bg-[rgba(96,46,201,0.2)] border border-[rgba(96,46,201,0.79)] text-[#602EC9] shadow-[0_0_12px_rgba(56,189,248,0.5)]' : isDinoTheme ? 'bg-[rgba(128,243,86,0.2)] border border-[rgba(128,243,86,0.79)] text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-[rgba(56,189,248,0.2)] border border-[rgba(56,189,248,0.79)] text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isCarsTheme ? 'text-[#9ca3af] hover:text-white hover:bg-[rgba(255,232,56,0.88)]' : isSpaceTheme ? 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(96,46,201,0.79)] hover:text-[#602EC9] hover:bg-[rgba(96,46,201,0.1)]' : isDinoTheme ? 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(128,243,86,0.79)] hover:text-[#80F356] hover:bg-[rgba(128,243,86,0.1)]' : 'bg-[rgba(255,255,255,0.05)] text-[#d1d5db] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(56,189,248,0.79)] hover:text-accent-blue hover:bg-[rgba(56,189,248,0.1)]')}`}
                >
                  {isSelected && <Check className={`w-4 h-4 ${isCarsTheme ? 'text-black' : isSpaceTheme ? 'text-[#602EC9]' : isDinoTheme ? 'text-[#80F356]' : 'text-accent-blue'}`} />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Observation */}
        <div>
          <h2 className="text-lg text-[#e5e7eb] mb-4 font-medium">Observação / Diário</h2>
          <textarea
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
            placeholder="Descreva o que aconteceu de importante..."
            className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-sm text-[#e5e7eb] focus:outline-none transition-colors ${isCarsTheme ? 'focus:border-[rgba(255,232,56,0.88)] focus:ring-1 focus:ring-[rgba(255,232,56,0.88)] hover:border-[rgba(255,232,56,0.5)]' : isSpaceTheme ? 'focus:border-[rgba(96,46,201,0.79)] focus:ring-1 focus:ring-[rgba(96,46,201,0.79)] hover:border-[rgba(96,46,201,0.5)]' : isDinoTheme ? 'focus:border-[rgba(128,243,86,0.79)] focus:ring-1 focus:ring-[rgba(128,243,86,0.79)] hover:border-[rgba(128,243,86,0.5)]' : 'focus:border-[rgba(56,189,248,0.79)] focus:ring-1 focus:ring-[rgba(56,189,248,0.79)] hover:border-[rgba(56,189,248,0.5)]'}`}
            rows={3}
          />
        </div>
      </>
      )}

      <button 
         onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)}
         className={`py-4 w-full text-center font-medium text-lg mt-12 mb-32 rounded-2xl relative overflow-hidden active:scale-95 transition-all ${isCarsTheme ? 'bg-[rgba(255,232,56,0.88)] text-black hover:bg-[#FFE838] border border-[rgba(255,232,56,0.88)] shadow-[0_0_18px_rgba(255,232,56,0.4)]' : isSpaceTheme ? 'text-white bg-[rgba(96,46,201,0.2)] hover:bg-[rgba(96,46,201,0.3)] border border-[rgba(96,46,201,0.79)] shadow-[0_0_18px_rgba(56,189,248,0.4)]' : isDinoTheme ? 'text-white bg-[rgba(128,243,86,0.2)] hover:bg-[rgba(128,243,86,0.3)] border border-[rgba(128,243,86,0.79)] shadow-[0_0_18px_rgba(128,243,86,0.4)]' : 'text-white bg-[rgba(56,189,248,0.2)] hover:bg-[rgba(56,189,248,0.3)] border border-[rgba(56,189,248,0.79)] shadow-[0_0_18px_rgba(56,189,248,0.4)]'}`}
      >
        <span className="relative z-10 font-semibold">{isChildAutonomyMode ? 'Concluir' : 'Salvar Registro'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </button>

    </motion.div>
  );
}


function PrintableClinicalReport({ 
  records, isSpaceTheme, isCarsTheme, isDinoTheme, themeMode,
  stats, chartData, topStrategies = [], heatmapData, topTriggers = [],
  diasComCrises, diasSemCrises, timelineRecords, aiInsights 
}: any) {
  const dateStr = new Date().toLocaleDateString('pt-BR');
  const effectiveKidsTheme = isCarsTheme ? 'cars' : isDinoTheme ? 'dino' : isSpaceTheme ? 'space' : null;
  const showCarsThemeGauge = isCarsTheme;
  
  return (
    <div className="flex flex-col gap-6 p-10 w-[800px] bg-[#090e17] text-[#e5e7eb] font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Relatório Clínico</h1>
        <div className="flex items-center gap-2 mb-2">
           <div className="flex gap-1 items-end h-8">
             <div className="w-1.5 h-4 bg-[#1e293b]"></div>
             <div className="w-1.5 h-6 bg-[#475569]"></div>
             <div className="w-1.5 h-8 bg-[#38bdf8]"></div>
             <div className="w-1.5 h-5 bg-[#94a3b8]"></div>
             <div className="w-1.5 h-7 bg-[#0ea5e9]"></div>
           </div>
           <div className="flex flex-col ml-2 leading-none">
             <span className="text-2xl font-bold text-[#e5e7eb] tracking-wider">TEA</span>
             <span className="text-sm font-semibold text-[#38bdf8]">SoundScapes</span>
           </div>
        </div>
        <p className="text-sm text-[#9ca3af]">Gerado em: {dateStr}</p>
        <div className="w-full h-[1px] bg-[rgba(255,255,255,0.1)] mt-4"></div>
      </div>

      <div className="grid grid-cols-4 gap-3">
          {[
            { v: isSpaceTheme && stats.moodId ? <AstronautMood mood={stats.moodId} /> : stats.mood, l: 'Humor Médio', color: 'text-2xl flex items-center justify-center' },
            { v: stats.crises, l: 'Total de Crises', color: 'text-[#f43f5e] text-2xl font-semibold' },
            { v: stats.goodDays, l: 'Dias Bons', color: 'text-[#4ade80] text-2xl font-semibold' },
            { v: stats.trend, l: 'Tendência', color: stats.trend === '↓' ? 'text-[#f43f5e] text-2xl font-bold' : (stats.trend === '↑' ? 'text-[#4ade80] text-2xl font-bold' : 'text-[#d1d5db] text-2xl font-bold') }
          ].map((stat, i) => (
            <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className={`mb-1 ${stat.color}`}>{stat.v}</span>
              <span className="text-[10px] text-[#d1d5db] leading-tight">{stat.l}</span>
            </div>
          ))}
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 pb-2">
          <h3 className="text-sm font-medium text-white mb-4">Evolução do Humor</h3>
          {chartData.length > 0 ? (
            <div className="h-40 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorMoodPrint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                  <YAxis ticks={[1, 3, 5]} domain={[0, 5]} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tickFormatter={(val: any) => {
                    if(val === 1) return 'Baixo';
                    if(val === 3) return 'Médio';
                    if(val === 5) return 'Alto';
                    return '';
                  }} />
                  <Area type="monotone" dataKey="mood" isAnimationActive={false} stroke={isSpaceTheme ? "#602EC9" : "#38bdf8"} strokeWidth={3} fillOpacity={1} fill="url(#colorMoodPrint)" activeDot={{ r: 6, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} dot={{ r: 4, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#6b7280] text-sm">
              Nenhum dado registrado ainda
            </div>
          )}
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
          <h3 className="text-sm font-medium text-white mb-4">Mapa de Calor (Horários de Crise)</h3>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="w-10"></div>
              <div className="flex-1 grid grid-cols-7 gap-1 mb-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] text-center text-[#9ca3af]">{d}</div>
                ))}
              </div>
            </div>
            {heatmapData.map((row: number[], rIdx: number) => (
              <div key={rIdx} className="flex gap-2">
                <div className="w-10 text-[10px] text-[#9ca3af] flex items-center justify-start">
                  {['Madru', 'Manhã', 'Tarde', 'Noite'][rIdx]}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {row.map((val: number, cIdx: number) => {
                    let bg = "bg-[rgba(255,255,255,0.05)]";
                    if (val >= 1 && val <= 2) bg = "bg-[#ff9c85]";
                    else if (val >= 3) bg = "bg-[#ff5a36]";
                    return <div key={`${rIdx}-${cIdx}`} className={`aspect-square rounded-sm ${bg}`} />
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 text-[10px] text-[#9ca3af]">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[rgba(255,255,255,0.05)] inline-block" /> 0 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff9c85] inline-block" /> 1-2 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff5a36] inline-block" /> 3+ crises</div>
          </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
          <h3 className="text-sm font-medium text-white mb-4">Locais de Risco</h3>
          {topTriggers && topTriggers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topTriggers.map((t: any, i: number) => {
                let medal = '🏅';
                if (i === 0) medal = '🥇';
                else if (i === 1) medal = '🥈';
                else if (i === 2) medal = '🥉';
                
                let TriggerIcon = '🎯';
                const lowerLabel = t.label.toLowerCase();
                if (lowerLabel.includes('multid')) TriggerIcon = '👥';
                else if (lowerLabel.includes('shopping')) TriggerIcon = '🛍️';
                else if (lowerLabel.includes('barulho') || lowerLabel.includes('som')) TriggerIcon = '🔊';
                else if (lowerLabel.includes('trabalho')) TriggerIcon = '💼';
                else if (lowerLabel.includes('escola') || lowerLabel.includes('faculdade')) TriggerIcon = '🏫';
                else if (lowerLabel.includes('trânsito') || lowerLabel.includes('carro') || lowerLabel.includes('onibus') || lowerLabel.includes('ônibus') || lowerLabel.includes('transporte')) TriggerIcon = '🚌';
                else if (lowerLabel.includes('calor')) TriggerIcon = '🥵';
                else if (lowerLabel.includes('fechado')) TriggerIcon = '📦';
                else if (lowerLabel.includes('luzes')) TriggerIcon = '💡';
                else if (lowerLabel.includes('cansaço') || lowerLabel.includes('fadiga')) TriggerIcon = '🥱';

                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center text-xl">{medal}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-xl">
                          {TriggerIcon}
                        </div>
                        <span className="text-sm font-semibold text-[#e5e7eb]">{t.label}</span>
                      </div>
                    </div>
                    <div className="text-white bg-[#f43f5e] px-2.5 py-1 rounded-md text-xs font-bold">
                      {t.count} {t.count === 1 ? 'crise' : 'crises'}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-[#6b7280] text-sm py-4 text-center">Nenhum dado registrado</div>
          )}
      </div>

      {topTriggers && topTriggers.length > 0 && (
          <div className="p-4 border-l-4 border-[#f59e0b] bg-[rgba(245,158,11,0.1)] rounded-r-2xl">
            <h3 className="text-sm font-bold text-[#f59e0b] mb-3 flex items-center gap-2">⚠️ Principais gatilhos identificados:</h3>
            <div className="flex flex-col gap-3">
              {topTriggers.map((t: any, i: number) => {
                let msg = '';
                if(i === 0) msg = `é o local com mais crises (${t.count} crises). Considere desenvolver estratégias específicas para este ambiente com seu psicólogo.`;
                else if(i === 1) msg = `também é um gatilho importante (${t.count} crises). Identifique o que esses ambientes têm em comum.`;
                else msg = `Você teve ${t.count} crise(s) relacionadas a ${t.label}. Planeje pausas quando estiver exposto a isso.`;
                return (
                  <div key={i} className="flex gap-2">
                    <p className="text-xs text-[rgba(253,230,138,0.9)] leading-relaxed"><strong className="text-[#fbbf24]">{t.label}</strong>: {msg}</p>
                  </div>
                )
              })}
            </div>
          </div>
      )}

      {aiInsights?.therapistSummary && (
        <div className="bg-[rgba(56,189,248,0.05)] rounded-2xl p-5 mb-4 border border-[rgba(56,189,248,0.3)]">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#38bdf8]" />
              Resumo Analítico da IA (Visão do Terapeuta)
            </h3>
            <p className="text-sm text-[#e5e7eb] leading-relaxed italic">{aiInsights.therapistSummary}</p>
        </div>
      )}
      
      <div className="flex flex-col gap-4">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
             <h3 className="text-sm font-medium text-white mb-4">Relação entre Humor e Crises</h3>
             <div className="bg-[rgba(244,63,94,0.05)] rounded-xl border border-[rgba(244,63,94,0.2)] p-3 mb-3">
                <h4 className="text-xs text-center font-semibold text-[#f43f5e] mb-3 border-b border-[rgba(244,63,94,0.2)] pb-2">Dias com Crises</h4>
                {diasComCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasComCrises.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[#e5e7eb]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          {showCarsThemeGauge ? (
                            <div className="w-32"><CarsFuelTank intensity={d.intensities?.slice(-1)[0] ?? 50} readOnly={true} /></div>
                          ) : (
                            <span className="text-sm">{(themeMode === 'child' || true) && d.moodIds && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} kidsTheme={effectiveKidsTheme || undefined} /> : d.emojis.slice(-1)[0]}</span>
                          )}
                          <span className="text-white bg-[#f43f5e] px-2 py-0.5 rounded font-medium">{d.crises} crise(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>

             <div className="bg-[rgba(34,197,94,0.05)] rounded-xl border border-[rgba(34,197,94,0.2)] p-3">
                <h4 className="text-xs text-center font-semibold text-[#4ade80] mb-3 border-b border-[rgba(34,197,94,0.2)] pb-2">Dias sem Crises</h4>
                {diasSemCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasSemCrises.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-center text-[#9ca3af]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          {showCarsThemeGauge ? (
                            <div className="w-32"><CarsFuelTank intensity={d.intensities?.slice(-1)[0] ?? 50} readOnly={true} /></div>
                          ) : (
                            <span className="text-sm">{(themeMode === 'child' || true) && d.moodIds && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} kidsTheme={effectiveKidsTheme || undefined} /> : d.emojis.slice(-1)[0]}</span>
                          )}
                          <span className="text-[#4ade80] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded font-medium">✓ Sem crises</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>
          </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4">
        <h3 className="text-sm font-medium text-white mb-4">Ranking de Estratégias</h3>
        {topStrategies.length > 0 ? (
          <div className="flex flex-col gap-3 relative">
            {topStrategies.map((s: any, i: number) => {
              const maxCount = Math.max(...topStrategies.map((ts:any) => ts.count));
              const percent = (s.count / maxCount) * 100;
              return (
                <div key={i} className="glass-card-active rounded-xl overflow-hidden relative">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#38bdf8]" />
                  <div className="relative p-3 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-1 bg-[rgba(56,189,248,0.2)] text-[#38bdf8] ring-[rgba(56,189,248,0.5)]">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-[#e5e7eb]">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded-md">
                      <span className="text-xs font-mono font-medium text-[#38bdf8]">{s.count} vezes</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-[#6b7280] text-sm py-4">Nenhuma estratégia registrada.</div>
        )}
      </div>
      
      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6">
        <h3 className="text-sm font-medium text-white mb-4">Linha do Tempo do Progresso</h3>
        {timelineRecords.length > 0 ? (
          <div className="border-l-2 border-[rgba(255,255,255,0.1)] ml-2 pl-4 flex flex-col gap-4">
            {timelineRecords.map((rec: any, i: number) => {
              const isCrisis = rec.crises > 0;
              return (
                <div key={i} className="relative">
                  <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full ${isCrisis ? 'bg-[#f43f5e] border-2 border-[#121214]' : 'bg-[#38bdf8] border-2 border-[#121214]'}`} />
                  <div className="text-xs text-[#9ca3af] mb-1">{new Date(rec.date).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</div>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 text-sm text-[#e5e7eb]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{isSpaceTheme && rec.moodId ? <AstronautMood mood={rec.moodId} /> : rec.emoji}</span>
                      {isCrisis && <span className="text-[10px] font-bold text-[#f43f5e] uppercase tracking-wider px-1.5 py-0.5 bg-[rgba(244,63,94,0.1)] rounded">Crise Registrada</span>}
                    </div>
                    {rec.texto ? <p className="leading-relaxed">{rec.texto}</p> : <p className="text-[#6b7280] italic">Sem anotação de texto.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-[#6b7280] text-sm">
            Nenhuma observação registrada.
          </div>
        )}
      </div>

    </div>
  );
}
function AnalisesView({ isDinoTheme, isSpaceTheme, isCarsTheme, themeMode,
  stats, chartData, topStrategies, topTriggers, heatmapData, 
  diasComCrises, diasSemCrises, timelineRecords, records }: { 
  stats: any, chartData: any[], 
  topStrategies: {label: string, count: number, dates: number[]}[], 
  topTriggers: {label: string, count: number, p: number}[], 
  heatmapData: number[][],
  diasComCrises: any[], diasSemCrises: any[], timelineRecords: DiaryRecord[],
  records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean, themeMode?: string }) {

  const printRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [aiInsights, setAiInsights] = useState<{userInsight?: string, therapistSummary?: string}>({});
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/analyze-diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            records, 
            themeMode, 
            kidsTheme: isDinoTheme ? 'dino' : isSpaceTheme ? 'space' : isCarsTheme ? 'cars' : null 
          })
        });
        if (response.ok) {
          const data = await response.json();
          setAiInsights(data);
        }
      } catch (err) {
        console.error('Failed to fetch AI insights', err);
      } finally {
        setIsLoadingInsights(false);
      }
    };
    if (records.length > 0) {
      fetchInsights();
    } else {
      setIsLoadingInsights(false);
    }
  }, [records]);


    const handleExportPDF = async () => {
    if (!pdfContainerRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfContainerRef.current;
      
      // Delay so React has time to ensure everything is painted
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#090e17',
        useCORS: true,
        logging: false
      });
      
      
      
      const imgData = canvas.toDataURL('image/png');
      
      if (imgData === 'data:,' || !imgData.startsWith('data:image/png;base64,')) {
        throw new Error('Erro: O motor do PDF gerou uma imagem inválida ou vazia.');
      }
      
      const pdfWidth = 210;
      const pageHeight = 297;
      const validWidth = canvas.width > 0 ? canvas.width : 800;
      const imgHeight = (canvas.height * pdfWidth) / validWidth;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const filename = `Relatorio_${dd}-${mm}-${yyyy}.pdf`;
      
      const dataUri = pdf.output('datauristring');
      
      const userEmail = localStorage.getItem('currentUserEmail') || 'guest';
      await saveReport({
        id: Date.now().toString(),
        userEmail,
        date: `${dd}/${mm}/${yyyy}`,
        timestamp: Date.now(),
        filename,
        dataUrl: dataUri
      });
      
      alert('Relatório salvo com sucesso na aba "Meus Relatórios".');
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
      
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, zIndex: -9999, pointerEvents: 'none' }}>
      <div ref={pdfContainerRef}>
        <PrintableClinicalReport 
          records={records} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} isDinoTheme={isDinoTheme} themeMode={themeMode}
          stats={stats} chartData={chartData} topStrategies={topStrategies} heatmapData={heatmapData} topTriggers={topTriggers}
          diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} aiInsights={aiInsights}
        />
      </div>
    </div>
    <div ref={printRef} className="flex flex-col gap-6 p-1">
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: isSpaceTheme && stats.moodId ? <AstronautMood mood={stats.moodId} /> : stats.mood, l: 'Humor Médio', color: 'text-2xl flex items-center justify-center' },
            { v: stats.crises, l: 'Total de Crises', color: 'text-danger-panic text-2xl font-semibold' },
            { v: stats.goodDays, l: 'Dias Bons', color: 'text-[#4ade80] text-2xl font-semibold' },
            { v: stats.trend, l: 'Tendência', color: stats.trend === '↓' ? 'text-danger-panic text-2xl font-bold' : (stats.trend === '↑' ? 'text-[#4ade80] text-2xl font-bold' : 'text-[#d1d5db] text-2xl font-bold') }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-3 flex flex-col items-center justify-center text-center">
              <span className={`mb-1 ${stat.color}`}>{stat.v}</span>
              <span className="text-[10px] text-[#d1d5db] leading-tight">{stat.l}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 pb-2">
          <h3 className="text-sm font-medium text-white mb-4">Evolução do Humor</h3>
          {chartData.length > 0 ? (
            <div className="h-40 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isSpaceTheme ? "#602EC9" : "#38bdf8"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                  <YAxis ticks={[1, 3, 5]} domain={[0, 5]} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tickFormatter={(val) => {
                    if(val === 1) return 'Baixo';
                    if(val === 3) return 'Médio';
                    if(val === 5) return 'Alto';
                    return '';
                  }} />
                  <Area type="monotone" dataKey="mood" isAnimationActive={false} stroke={isSpaceTheme ? "#602EC9" : "#38bdf8"} strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" activeDot={{ r: 6, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} dot={{ r: 4, fill: '#fff', stroke: isSpaceTheme ? '#602EC9' : '#38bdf8', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-[#6b7280] text-sm">
              Nenhum dado registrado ainda
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-white mb-4">Mapa de Calor (Horários de Crise)</h3>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="w-10"></div>
              <div className="flex-1 grid grid-cols-7 gap-1 mb-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] text-center text-[#9ca3af]">{d}</div>
                ))}
              </div>
            </div>
            {heatmapData.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2">
                <div className="w-10 text-[10px] text-[#9ca3af] flex items-center justify-start">
                  {['Madru', 'Manhã', 'Tarde', 'Noite'][rIdx]}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {row.map((val, cIdx) => {
                    let bg = "bg-[rgba(255,255,255,0.05)]";
                    if (val >= 1 && val <= 2) bg = "bg-[#ff9c85]";
                    else if (val >= 3) bg = "bg-[#ff5a36]";
                    return <div key={`${rIdx}-${cIdx}`} className={`aspect-square rounded-sm ${bg}`} />
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 text-[10px] text-[#9ca3af]">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[rgba(255,255,255,0.05)] inline-block" /> 0 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff9c85] inline-block" /> 1-2 crises</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff5a36] inline-block" /> 3+ crises</div>
          </div>
        </div>

        <div className="glass-card p-4 font-poppins">
          <h3 className="text-sm font-medium text-white mb-4 font-sans">Locais de Risco</h3>
          {topTriggers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topTriggers.map((t, i) => {
                let medal: React.ReactNode = '🏅';
                if(i === 0) medal = <span className="text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">🥇</span>;
                if(i === 1) medal = <span className="text-xl drop-shadow-[0_0_8px_rgba(156,163,175,0.6)]">🥈</span>;
                if(i === 2) medal = <span className="text-xl drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]">🥉</span>;
                
                let TriggerIcon = '🎯';
                const lowerLabel = t.label.toLowerCase();
                if (lowerLabel.includes('multid')) TriggerIcon = '👥';
                else if (lowerLabel.includes('shopping')) TriggerIcon = '🛍️';
                else if (lowerLabel.includes('barulho') || lowerLabel.includes('som')) TriggerIcon = '🔊';
                else if (lowerLabel.includes('trabalho')) TriggerIcon = '💼';
                else if (lowerLabel.includes('escola') || lowerLabel.includes('faculdade')) TriggerIcon = '🏫';
                else if (lowerLabel.includes('trânsito') || lowerLabel.includes('carro') || lowerLabel.includes('onibus') || lowerLabel.includes('ônibus') || lowerLabel.includes('transporte')) TriggerIcon = '🚌';
                else if (lowerLabel.includes('calor')) TriggerIcon = '🥵';
                else if (lowerLabel.includes('fechado')) TriggerIcon = '📦';
                else if (lowerLabel.includes('luzes')) TriggerIcon = '💡';
                else if (lowerLabel.includes('cansaço') || lowerLabel.includes('fadiga')) TriggerIcon = '🥱';

                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">
                        {medal}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-xl shadow-inner">
                          {TriggerIcon}
                        </div>
                        <span className="text-sm font-semibold text-[#e5e7eb]">{t.label}</span>
                      </div>
                    </div>
                    <div className="text-white bg-danger-panic px-2.5 py-1 rounded-md text-xs font-bold shadow-sm whitespace-nowrap">
                      {t.count} {t.count === 1 ? 'crise' : 'crises'}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-[#6b7280] text-sm py-4 text-center">Nenhum dado registrado</div>
          )}
        </div>

        {topTriggers.length > 0 && (
          <div className="p-4 border-l-4 border-[#f59e0b] bg-[rgba(245,158,11,0.1)] rounded-r-2xl">
            <h3 className="text-sm font-bold text-[#f59e0b] mb-3 flex items-center gap-2">⚠️ Principais gatilhos identificados:</h3>
            <div className="flex flex-col gap-3">
              {topTriggers.map((t, i) => {
                let msg = '';
                if(i === 0) msg = `é o local com mais crises (${t.count} crises). Considere desenvolver estratégias específicas para este ambiente com seu psicólogo.`;
                else if(i === 1) msg = `também é um gatilho importante (${t.count} crises). Identifique o que esses ambientes têm em comum.`;
                else msg = `Você teve ${t.count} crise(s) relacionadas a ${t.label}. Planeje pausas quando estiver exposto a isso.`;
                return (
                  <div key={i} className="flex gap-2">
                    <p className="text-xs text-[rgba(253,230,138,0.9)] leading-relaxed"><strong className="text-[#fbbf24]">{t.label}</strong>: {msg}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        
        {/* Resumo Analitico da IA */}
        <div className="glass-card p-5 mb-4 border-[rgba(56,189,248,0.3)] bg-gradient-to-br from-[rgba(56,189,248,0.05)] to-transparent">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#38bdf8]" />
            Resumo Analítico da IA
          </h3>
          {isLoadingInsights ? (
             <div className="animate-pulse flex flex-col gap-2">
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-3/4"></div>
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-full"></div>
               <div className="h-3 bg-[rgba(255,255,255,0.1)] rounded w-5/6"></div>
             </div>
          ) : aiInsights.userInsight ? (
             <div className="flex flex-col gap-4">
               <div>
                 <h4 className="text-xs font-medium text-[#9ca3af] mb-1">Para Você:</h4>
                 <p className="text-sm text-[#e5e7eb] leading-relaxed">{aiInsights.userInsight}</p>
               </div>
               {aiInsights.therapistSummary && (
                 <div className="pt-3 border-t border-[rgba(255,255,255,0.1)]">
                   <h4 className="text-xs font-medium text-[#38bdf8] mb-1">Nota para o Terapeuta:</h4>
                   <p className="text-xs text-[#d1d5db] leading-relaxed italic">{aiInsights.therapistSummary}</p>
                 </div>
               )}
             </div>
          ) : (
             <p className="text-sm text-[#9ca3af]">A IA precisa de mais registros para gerar um resumo analítico.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card p-4">
             <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">Relação entre Humor e Crises</h3>
             
             <div className="bg-[rgba(244,63,94,0.05)] rounded-xl border border-[rgba(244,63,94,0.2)] p-3 mb-3">
                <h4 className="text-xs text-center font-semibold text-danger-panic mb-3 border-b border-[rgba(244,63,94,0.2)] pb-2">Dias com Crises</h4>
                {diasComCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasComCrises.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[#e5e7eb]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          {isCarsTheme ? (
                            <div className="w-32"><CarsFuelTank intensity={d.intensities?.slice(-1)[0] ?? 50} readOnly={true} /></div>
                          ) : (
                            <span className="text-sm">{(isSpaceTheme || isDinoTheme) && d.moodIds && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} kidsTheme={isDinoTheme ? 'dino' : isSpaceTheme ? 'space' : undefined} /> : d.emojis.slice(-1)[0]}</span>
                          )}
                          <span className="text-white bg-danger-panic px-2 py-0.5 rounded font-medium">{d.crises} crise(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>

             <div className="bg-[rgba(34,197,94,0.05)] rounded-xl border border-[rgba(34,197,94,0.2)] p-3">
                <h4 className="text-xs text-center font-semibold text-[#4ade80] mb-3 border-b border-[rgba(34,197,94,0.2)] pb-2">Dias sem Crises</h4>
                {diasSemCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasSemCrises.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-center text-[#9ca3af]">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{(isSpaceTheme || isDinoTheme || isCarsTheme) && d.moodIds && d.moodIds.slice(-1)[0] ? <AstronautMood mood={d.moodIds.slice(-1)[0]} kidsTheme={isDinoTheme ? 'dino' : isSpaceTheme ? 'space' : isCarsTheme ? 'cars' : undefined} /> : d.emojis.slice(-1)[0]}</span>
                          <span className="text-[#4ade80] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded font-medium">✓ Sem crises</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280] text-center">Nenhum dado</div>
                )}
             </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">📅 Linha do Tempo do Progresso</h3>
          <p className="text-xs text-[#9ca3af] mb-4">Veja suas observações ao longo da jornada</p>
          
          {timelineRecords.length > 0 ? (
            <div className="border-l-2 border-[rgba(255,255,255,0.1)] ml-2 pl-4 flex flex-col gap-4 relative">
              {timelineRecords.map((r, i) => {
                const dateStr = new Date(r.date).toLocaleDateString('pt-BR');
                const emoji = MOODS.find(m => m.id === r.moodId)?.emoji || '😐';
                return (
                  <div key={i} className="relative">
                     <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-[#09090b] ${isSpaceTheme ? 'bg-[#602EC9] shadow-[0_0_8px_#602EC9]' : 'bg-accent-blue shadow-[0_0_8px_#38bdf8]'}`} />
                     <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-3">
                       <div className="flex justify-between text-xs mb-2">
                          <span className={`font-semibold flex items-center gap-1 ${isSpaceTheme ? 'text-[#602EC9]' : 'text-accent-blue'}`}>
                            {isSpaceTheme ? <AstronautMood mood={r.moodId} /> : emoji} {dateStr}
                          </span>
                       </div>
                       <p className="text-xs text-[#d1d5db] italic">"{r.observacao}"</p>
                     </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-xs text-[#6b7280] text-center py-4">
              Nenhuma observação registrada ainda. Preencha o campo "Observação / Diário" na aba de Registro para ver sua linha do tempo.
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-white mb-4">Ranking de Estratégias</h3>
          <p className="text-xs text-[#9ca3af] mb-4">Ferramentas que funcionaram melhor para aliviar crises</p>
          {topStrategies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topStrategies.map((s, i) => {
                const percent = (s.count / Math.max(1, topStrategies[0]?.count || 1)) * 100;
                const isExpanded = expandedStrategy === s.label;
                return (
                  <div key={i} className="glass-card-active rounded-xl overflow-hidden relative transition-all duration-300">
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${isSpaceTheme ? 'bg-[#602EC9]' : 'bg-accent-blue'}`} />
                    
                    <button 
                      onClick={() => setExpandedStrategy(isExpanded ? null : s.label)}
                      className="w-full text-left relative p-3 flex justify-between items-center z-10 active:bg-[rgba(255,255,255,0.05)] transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-1 ${isSpaceTheme ? 'bg-[rgba(96,46,201,0.2)] text-[#602EC9] ring-[rgba(96,46,201,0.5)]' : 'bg-[rgba(56,189,248,0.2)] text-accent-blue ring-[rgba(56,189,248,0.5)]'}`}>
                          {i + 1}
                        </div>
                        <span className="text-sm text-[#f3f4f6] font-medium">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded-md backdrop-blur-sm">
                          <svg className={`w-3.5 h-3.5 ${isSpaceTheme ? 'text-[#602EC9]' : 'text-accent-blue'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <span className={`text-xs font-mono font-medium ${isSpaceTheme ? 'text-[#602EC9]' : 'text-accent-blue'}`}>{s.count} vezes</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[#9ca3af] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="relative z-10 border-t border-[rgba(255,255,255,0.05)] px-4 py-3"
                        >
                          <h4 className="text-[10px] font-semibold text-[#9ca3af] mb-2 uppercase tracking-wider">Histórico de Uso</h4>
                          {s.dates && s.dates.length > 0 ? (
                            <ul className="flex flex-col gap-1.5">
                              {s.dates.sort((a,b) => b - a).map((d, index) => {
                                const dObj = new Date(d);
                                return (
                                  <li key={index} className="text-xs text-[#d1d5db] flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSpaceTheme ? 'bg-[rgba(96,46,201,0.5)]' : 'bg-[rgba(56,189,248,0.05)]0'}`} />
                                    {dObj.toLocaleDateString('pt-BR')} às {dObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-[#6b7280]">Nenhum registro encontrado</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-dashed rounded-xl p-6 text-center text-[#9ca3af] text-sm">
              Nenhuma estratégia salva ainda.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-4 mb-32 hide-on-print">
        <button onClick={handleExportPDF} disabled={isExporting || isLoadingInsights} className={`glass-card-active py-4 w-full text-center font-medium text-white flex items-center justify-center gap-2 transition-colors active:scale-95 ${isSpaceTheme ? 'hover:bg-[rgba(96,46,201,0.3)]' : 'hover:bg-[rgba(56,189,248,0.3)]'}`}>
          <Download className="w-5 h-5" /> {isExporting ? "Gerando..." : isLoadingInsights ? "Carregando IA..." : "Salvar PDF"}
        </button>
      </div>

    </motion.div>
  );
}





function ReportCard({ report, onDelete, onDownload, onShare }: { report: Report, onDelete: (id: string) => void, onDownload: (r: Report) => void, onShare: (r: Report) => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="glass-card p-4 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.2)] flex items-center justify-center border border-[rgba(56,189,248,0.3)] text-[#38bdf8]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{report.filename}</h3>
            <p className="text-xs text-[#9ca3af]">{report.date}</p>
          </div>
        </div>
        {!confirming && (
          <button onClick={() => setConfirming(true)} className="text-[#6b7280] hover:text-[#f87171] p-1 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => onDownload(report)} className="flex-1 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Download className="w-3.5 h-3.5" /> Baixar
        </button>
        <button onClick={() => onShare(report)} className="flex-1 py-2 bg-[rgba(56,189,248,0.2)] hover:bg-[rgba(56,189,248,0.3)] border border-[rgba(56,189,248,0.5)] text-[#38bdf8] rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Compartilhar
        </button>
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-[#060b13]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10"
          >
            <p className="text-sm font-medium text-white mb-3 text-center">Excluir este relatório permanentemente?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] text-white text-xs font-semibold">
                Cancelar
              </button>
              <button onClick={() => onDelete(report.id)} className="flex-1 py-2 rounded-lg bg-[#f43f5e] text-white text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                Excluir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RelatoriosView({ isDinoTheme, isSpaceTheme, isCarsTheme }: { isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'old' | 'month' | 'year'>('recent');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('currentUserEmail') || 'guest';
      const data = await getReportsByUser(email);
      setReports(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDownload = (report: Report) => {
    const a = document.createElement('a');
    a.href = report.dataUrl;
    a.download = report.filename;
    a.click();
  };

  const handleShare = async (report: Report) => {
    try {
      const res = await fetch(report.dataUrl);
      const blob = await res.blob();
      const file = new File([blob], report.filename, { type: 'application/pdf' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: report.filename,
          text: 'Confira o relatório do diário.'
        });
      } else {
        console.log('Compartilhamento nativo não suportado neste dispositivo. Use a opção de baixar.');
      }
    } catch (e) {
      console.error(e);
      console.error('Erro ao tentar compartilhar o arquivo.');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    loadReports();
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (filter === 'old') return a.timestamp - b.timestamp;
    return b.timestamp - a.timestamp;
  });

  const renderGroupedReports = () => {
    if (filter === 'recent' || filter === 'old') {
      return (
        <div className="flex flex-col gap-3 mb-32">
          {sortedReports.map(report => <ReportCard key={report.id} report={report} onDelete={handleDelete} onDownload={handleDownload} onShare={handleShare} />)}
        </div>
      );
    }
    
    // Grouping
    const groups: Record<string, Report[]> = {};
    sortedReports.forEach(report => {
      const d = new Date(report.timestamp);
      let key = '';
      if (filter === 'month') {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        key = `${mm}/${yyyy}`;
      } else {
        key = `${d.getFullYear()}`;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(report);
    });

    return (
      <div className="flex flex-col gap-6 mb-32">
        {Object.entries(groups).map(([groupKey, groupReports]) => (
          <div key={groupKey}>
            <h3 className="text-[#9ca3af] font-medium text-sm mb-3 ml-1">{groupKey}</h3>
            <div className="flex flex-col gap-3">
              {groupReports.map(report => <ReportCard key={report.id} report={report} onDelete={handleDelete} onDownload={handleDownload} onShare={handleShare} />)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-3 rounded-2xl border border-[rgba(255,255,255,0.1)]">
        <h2 className="text-[#e5e7eb] font-medium px-2">Meus Relatórios</h2>
        <div className="relative group">
          <button className="bg-[rgba(255,255,255,0.1)] text-xs px-3 py-1.5 rounded-lg text-white flex items-center gap-2 border border-[rgba(255,255,255,0.1)]">
            <Filter className="w-3 h-3" /> 
            {filter === 'recent' && 'Mais Recentes'}
            {filter === 'old' && 'Mais Antigos'}
            {filter === 'month' && 'Por Mês'}
            {filter === 'year' && 'Por Ano'}
          </button>
          <div className="absolute right-0 top-full mt-2 w-40 bg-[#111827] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl">
            <button onClick={() => setFilter('recent')} className="w-full text-left px-4 py-3 text-sm text-[#d1d5db] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors">Mais Recentes</button>
            <button onClick={() => setFilter('old')} className="w-full text-left px-4 py-3 text-sm text-[#d1d5db] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors">Mais Antigos</button>
            <button onClick={() => setFilter('month')} className="w-full text-left px-4 py-3 text-sm text-[#d1d5db] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors">Por Mês</button>
            <button onClick={() => setFilter('year')} className="w-full text-left px-4 py-3 text-sm text-[#d1d5db] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors">Por Ano</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[rgba(56,189,248,0.3)] border-t-accent-blue rounded-full animate-spin" />
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="text-center py-12 px-6 glass-card rounded-2xl">
          <FileText className="w-12 h-12 text-[#6b7280] mx-auto mb-4 opacity-50" />
          <p className="text-[#9ca3af] text-sm">Nenhum relatório salvo ainda.</p>
          <p className="text-[#6b7280] text-xs mt-2">Gere novos PDFs na aba de Análises.</p>
        </div>
      ) : (
        renderGroupedReports()
      )}
    </motion.div>
  );
}
