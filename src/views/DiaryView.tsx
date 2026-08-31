import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Check, Download, Lightbulb, ChevronDown } from 'lucide-react';

const MOODS = [
  { id: 'great', emoji: '😇', label: 'Ótimo', min: 0, max: 20 },
  { id: 'good', emoji: '🙂', label: 'Bom', min: 21, max: 40 },
  { id: 'neutral', emoji: '😐', label: 'Neutro', min: 41, max: 60 },
  { id: 'bad', emoji: '😟', label: 'Ruim', min: 61, max: 80 },
  { id: 'terrible', emoji: '😩', label: 'Péssimo', min: 81, max: 100 },
];

const TRIGGERS = ['Barulho', 'Luzes', 'Multidão', 'Transporte', 'Escola', 'Shopping', 'Cansaço'];
const STRATEGIES = ['Meu Refúgio', 'Sair do local', 'Respiração', 'Música', 'Nenhum'];

interface DiaryRecord {
  intensity: number;
  moodId: string;
  triggers: string[];
  estrategiaUsadaString?: string;
  observacao?: string;
  date: number; // timestamp
}

export function DiaryView({ startView = 'registro' }: { startView?: 'registro' | 'analises' }) {
  const [activeTab, setActiveTab] = useState<'registro' | 'analises'>(startView);
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
    setActiveTab('analises');
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
  const daysMap: Record<string, { date: number, crises: number, emojis: string[] }> = {};
  records.forEach(r => {
    const dStr = new Date(r.date).toLocaleDateString('pt-BR');
    if (!daysMap[dStr]) daysMap[dStr] = { date: r.date, crises: 0, emojis: [] };
    if (r.intensity >= 60) daysMap[dStr].crises++;
    daysMap[dStr].emojis.push(MOODS.find(m => m.id === r.moodId)?.emoji || '😐');
  });
  const diasComCrises = Object.values(daysMap).filter(d => d.crises > 0).sort((a,b) => b.date - a.date).slice(0, 3);
  const diasSemCrises = Object.values(daysMap).filter(d => d.crises === 0).sort((a,b) => b.date - a.date).slice(0, 3);
  
  // Timeline of observations
  const timelineRecords = records.filter(r => r.observacao && r.observacao.trim() !== '').sort((a,b) => b.date - a.date).slice(0, 5);

  const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 pt-12 flex flex-col h-full max-w-md mx-auto overflow-y-auto pb-24"
    >
      <header className="mb-6">
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold text-gray-100 tracking-tight">Diário Terapêutico</h1>
      </header>

      {/* Tabs */}
      <div className="glass-card flex p-1 mb-8 rounded-full hide-on-print">
        <button 
          onClick={() => setActiveTab('registro')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'registro' ? 'bg-accent-blue/20 text-white' : 'text-gray-400'}`}
        >
          Registro
        </button>
        <button 
          onClick={() => setActiveTab('analises')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'analises' ? 'bg-accent-blue/20 text-accent-blue' : 'text-gray-400'}`}
        >
          Análises
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'registro' ? <RegistroView onSave={handleSaveForm} /> : <AnalisesView stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />}
      </AnimatePresence>
    </motion.div>
  );
}

function RegistroView({ onSave }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void }) {
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
        <div className="flex justify-between items-center px-2">
          {MOODS.map(mood => (
            <button 
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`text-4xl transition-transform ${selectedMood === mood.id ? 'scale-125' : 'scale-100 opacity-60 grayscale'}`}
            >
              {selectedMood === mood.id ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-blue/30 rounded-full blur-md scale-150" />
                  <span className="relative z-10 block rounded-full border-2 border-accent-blue p-1">{mood.emoji}</span>
                </div>
              ) : (
                <span className="p-1 block">{mood.emoji}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="mt-4">
        <input 
          type="range" 
          min="0" max="100" 
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-3 bg-glass-border rounded-lg appearance-none cursor-pointer accent-accent-blue"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-3">
          <span>Calmo</span>
          <span>Estressado</span>
        </div>
      </div>

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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isSelected ? 'glass-card-active text-accent-blue' : 'glass-card text-gray-400 border-none'
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isSelected ? 'glass-card-active text-accent-blue' : 'glass-card text-gray-400 border-none'
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
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
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
          rows={3}
        />
      </div>

      <button onClick={() => onSave(intensity, selectedMood, selectedTriggers, strategy, observacao)} className="glass-card-active py-4 w-full text-center font-medium text-lg mt-12 mb-32 text-white relative overflow-hidden active:scale-95 transition-transform">
        <span className="relative z-10">Salvar Registro</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      </button>
    </motion.div>
  );
}

function AnalisesView({ 
  stats, chartData, topStrategies, topTriggers, heatmapData, 
  diasComCrises, diasSemCrises, timelineRecords, records 
}: { 
  stats: any, chartData: any[], 
  topStrategies: {label: string, count: number, dates: number[]}[], 
  topTriggers: {label: string, count: number, p: number}[], 
  heatmapData: number[][],
  diasComCrises: any[], diasSemCrises: any[], timelineRecords: DiaryRecord[],
  records: DiaryRecord[] 
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#060b13',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('analise-diario.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF', error);
      alert('Erro ao gerar PDF');
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
      
      <div ref={printRef} className="flex flex-col gap-6 p-1">
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: stats.mood, l: 'Humor Médio', color: 'text-2xl' },
            { v: stats.crises, l: 'Total de Crises', color: 'text-danger-panic text-2xl font-semibold' },
            { v: stats.goodDays, l: 'Dias Bons', color: 'text-green-400 text-2xl font-semibold' },
            { v: stats.trend, l: 'Tendência', color: stats.trend === '↓' ? 'text-danger-panic text-2xl font-bold' : (stats.trend === '↑' ? 'text-green-400 text-2xl font-bold' : 'text-gray-300 text-2xl font-bold') }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-3 flex flex-col items-center justify-center text-center">
              <span className={`mb-1 ${stat.color}`}>{stat.v}</span>
              <span className="text-[10px] text-gray-300 leading-tight">{stat.l}</span>
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
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
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
                  <Area type="monotone" dataKey="mood" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" activeDot={{ r: 6, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }} dot={{ r: 4, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
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
                  <div key={i} className="text-[10px] text-center text-gray-400">{d}</div>
                ))}
              </div>
            </div>
            {heatmapData.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2">
                <div className="w-10 text-[10px] text-gray-400 flex items-center justify-start">
                  {['Madru', 'Manhã', 'Tarde', 'Noite'][rIdx]}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {row.map((val, cIdx) => {
                    let bg = "bg-white/5";
                    if (val >= 1 && val <= 2) bg = "bg-[#ff9c85]";
                    else if (val >= 3) bg = "bg-[#ff5a36]";
                    return <div key={`${rIdx}-${cIdx}`} className={`aspect-square rounded-sm ${bg}`} />
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-white/5 inline-block" /> 0 crises</div>
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
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center">
                        {medal}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner">
                          {TriggerIcon}
                        </div>
                        <span className="text-sm font-semibold text-gray-200">{t.label}</span>
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
            <div className="text-gray-500 text-sm py-4 text-center">Nenhum dado registrado</div>
          )}
        </div>

        {topTriggers.length > 0 && (
          <div className="p-4 border-l-4 border-amber-500 bg-amber-500/10 rounded-r-2xl">
            <h3 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">⚠️ Principais gatilhos identificados:</h3>
            <div className="flex flex-col gap-3">
              {topTriggers.map((t, i) => {
                let msg = '';
                if(i === 0) msg = `é o local com mais crises (${t.count} crises). Considere desenvolver estratégias específicas para este ambiente com seu psicólogo.`;
                else if(i === 1) msg = `também é um gatilho importante (${t.count} crises). Identifique o que esses ambientes têm em comum.`;
                else msg = `Você teve ${t.count} crise(s) relacionadas a ${t.label}. Planeje pausas quando estiver exposto a isso.`;
                return (
                  <div key={i} className="flex gap-2">
                    <p className="text-xs text-amber-200/90 leading-relaxed"><strong className="text-amber-400">{t.label}</strong>: {msg}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="glass-card p-4">
             <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">Relação entre Humor e Crises</h3>
             
             <div className="bg-danger-panic/5 rounded-xl border border-danger-panic/20 p-3 mb-3">
                <h4 className="text-xs text-center font-semibold text-danger-panic mb-3 border-b border-danger-panic/20 pb-2">Dias com Crises</h4>
                {diasComCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasComCrises.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-200">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{d.emojis.slice(-1)[0]}</span>
                          <span className="text-white bg-danger-panic px-2 py-0.5 rounded font-medium">{d.crises} crise(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center">Nenhum dado</div>
                )}
             </div>

             <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-3">
                <h4 className="text-xs text-center font-semibold text-green-400 mb-3 border-b border-green-500/20 pb-2">Dias sem Crises</h4>
                {diasSemCrises.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {diasSemCrises.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-center text-gray-400">{new Date(d.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{d.emojis.slice(-1)[0]}</span>
                          <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-medium">✓ Sem crises</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 text-center">Nenhum dado</div>
                )}
             </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">📅 Linha do Tempo do Progresso</h3>
          <p className="text-xs text-gray-400 mb-4">Veja suas observações ao longo da jornada</p>
          
          {timelineRecords.length > 0 ? (
            <div className="border-l-2 border-white/10 ml-2 pl-4 flex flex-col gap-4 relative">
              {timelineRecords.map((r, i) => {
                const dateStr = new Date(r.date).toLocaleDateString('pt-BR');
                const emoji = MOODS.find(m => m.id === r.moodId)?.emoji || '😐';
                return (
                  <div key={i} className="relative">
                     <div className="absolute -left-[23px] top-1 w-3 h-3 bg-accent-blue rounded-full border-2 border-[#09090b] shadow-[0_0_8px_#38bdf8]" />
                     <div className="bg-white/5 rounded-xl p-3">
                       <div className="flex justify-between text-xs mb-2">
                          <span className="font-semibold text-accent-blue flex items-center gap-1">{emoji} {dateStr}</span>
                       </div>
                       <p className="text-xs text-gray-300 italic">"{r.observacao}"</p>
                     </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-4">
              Nenhuma observação registrada ainda. Preencha o campo "Observação / Diário" na aba de Registro para ver sua linha do tempo.
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-white mb-4">Ranking de Estratégias</h3>
          <p className="text-xs text-gray-400 mb-4">Ferramentas que funcionaram melhor para aliviar crises</p>
          {topStrategies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topStrategies.map((s, i) => {
                const percent = (s.count / Math.max(1, topStrategies[0]?.count || 1)) * 100;
                const isExpanded = expandedStrategy === s.label;
                return (
                  <div key={i} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden relative transition-all duration-300">
                    <div className="absolute top-0 left-0 bottom-0 bg-accent-blue/10" style={{ width: `${percent}%` }} />
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent-blue" />
                    
                    <button 
                      onClick={() => setExpandedStrategy(isExpanded ? null : s.label)}
                      className="w-full text-left relative p-3 flex justify-between items-center z-10 active:bg-white/5 transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xs ring-1 ring-accent-blue/50">
                          {i + 1}
                        </div>
                        <span className="text-sm text-gray-100 font-medium">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
                          <svg className="w-3.5 h-3.5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <span className="text-xs font-mono font-medium text-accent-blue">{s.count} vezes</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="relative z-10 bg-black/20 border-t border-white/5 px-4 py-3"
                        >
                          <h4 className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Histórico de Uso</h4>
                          {s.dates && s.dates.length > 0 ? (
                            <ul className="flex flex-col gap-1.5">
                              {s.dates.sort((a,b) => b - a).map((d, index) => {
                                const dObj = new Date(d);
                                return (
                                  <li key={index} className="text-xs text-gray-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50" />
                                    {dObj.toLocaleDateString('pt-BR')} às {dObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500">Nenhum registro encontrado</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-6 text-center text-gray-400 text-sm">
              Nenhuma estratégia salva ainda.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-4 mb-32 hide-on-print">
        <button onClick={handleExportPDF} disabled={isExporting} className="glass-card-active py-4 w-full text-center font-medium text-white flex items-center justify-center gap-2 hover:bg-accent-blue/30 transition-colors active:scale-95">
          <Download className="w-5 h-5" /> {isExporting ? "Gerando..." : "Exportar PDF"}
        </button>
      </div>

    </motion.div>
  );
}
