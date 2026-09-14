import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowRight, Check, Play, Pause, ShieldAlert, Mic, ArrowLeft } from 'lucide-react';
import { playSound, stopSound, toggleRefuge } from '../lib/audioEngine';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [supportName, setSupportName] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [alertSupport, setAlertSupport] = useState(true);
  const [hasTherapist, setHasTherapist] = useState<boolean | null>(null);
  const [refugeSound, setRefugeSound] = useState<string | null>(null);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'adult' | 'child'>('adult');
  const [kidsTheme, setKidsTheme] = useState<'dino' | 'space' | 'cars'>('dino');
  const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (themeMode === 'child') {
      document.body.classList.add('child-mode');
    } else {
      document.body.classList.remove('child-mode');
    }
  }, [themeMode]);

  useEffect(() => {
    // stop previously playing sounds when setting up/tearing down
    return () => {
      ['som-a', 'som-b', 'som-c'].forEach(s => stopSound(s));
    };
  }, []);

  
  const isChild = themeMode === 'child';
  const primaryBg = isChild ? 'bg-[#ff5c00]' : 'bg-accent-blue';
  const primaryBorder = isChild ? 'border-[#ff5c00]' : 'border-accent-blue';
  const primaryText = isChild ? 'text-[#ff5c00]' : 'text-accent-blue';
  const primaryShadow = isChild ? 'shadow-[0_0_20px_rgba(255,92,0,0.4)]' : 'shadow-[0_0_20px_rgba(56,189,248,0.4)]';
  const secondaryShadow = isChild ? 'shadow-[0_0_15px_rgba(255,92,0,0.2)]' : 'shadow-[0_0_15px_rgba(56,189,248,0.2)]';
  const primaryGlow = isChild ? 'shadow-[0_0_10px_rgba(255,92,0,0.5)]' : 'shadow-[0_0_10px_rgba(56,189,248,0.5)]';

  const totalSteps = themeMode === 'child' ? 11 : 8;
  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  }
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleLocation = (loc: string) => {
    if (locations.includes(loc)) setLocations(locations.filter(l => l !== loc));
    else setLocations([...locations, loc]);
  };

  const handleFinish = () => {
    onComplete({
      name,
      email,
      locations,
      supportNetwork: { name: supportName, phone: supportPhone, alert: alertSupport },
      hasTherapist,
      refugeSound,
      themeMode,
      kidsTheme: themeMode === 'child' ? kidsTheme : undefined,
      childAutonomyFilter: themeMode === 'child' ? childAutonomyFilter : undefined,
      parentalPin: themeMode === 'child' ? pin : undefined
    });
  };

  const REFUGE_SOUNDS = [
    { id: 'som-a', label: 'Som A (Ruído Marrom - Grave e profundo)' },
    { id: 'som-b', label: 'Som B (Ruído Rosa + Chuva Suave)' },
    { id: 'som-c', label: 'Som C (Ruído Branco + Vento)' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#060b13] flex flex-col justify-between overflow-y-auto">
      {/* Ambient background */}

      {step <= 8 && (
        <div className="w-full px-6 pt-12 shrink-0 z-10 relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button 
                  onClick={prevStep} 
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
              )}
              <span className="text-xs text-gray-400 font-medium tracking-wide">Passo {step} de {totalSteps}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${primaryBg} ${primaryGlow}`}
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-6 z-10 relative justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">
                Olá! Bem-vindo(a) ao<br/><span className={`${primaryText} font-medium tracking-wide`}>TEA SoundScapes</span>. 🎧
              </h1>
              <p className="text-gray-300 text-lg">Estamos aqui para criar o seu espaço seguro. Para começar, como você gostaria de ser chamado(a)?</p>
              <input 
                type="text" 
                placeholder="Seu nome ou apelido" 
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full glass-card p-4 focus:outline-none ${isChild ? "focus:border-[#ff5c00]" : "focus:border-accent-blue"} text-white placeholder-gray-500 mt-4 text-lg`}
              />
              <button 
                onClick={nextStep}
                disabled={!name.trim()}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-8 ${primaryShadow} disabled:opacity-50 disabled:shadow-none transition-all`}
              >
                Começar
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="stepA" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">Registre seu E-mail</h1>
              <p className="text-gray-300 text-lg">Para mantermos seus dados salvos.</p>
              
              <div className="flex flex-col gap-4 mt-2">
                <input 
                  type="email" placeholder="seu@email.com" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={`w-full glass-card p-4 focus:outline-none ${isChild ? "focus:border-[#ff5c00]" : "focus:border-accent-blue"} text-white placeholder-gray-500`}
                />
                
                <div className="flex items-center gap-2 my-2 w-full">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-gray-500 font-medium uppercase min-w-max">Ou registre com</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => nextStep()} className="glass-card flex items-center justify-center py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" className="w-4 h-4 opacity-80" /> Google
                  </button>
                  <button onClick={() => nextStep()} className="glass-card flex items-center justify-center py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" className="w-4 h-4 opacity-80" /> Facebook
                  </button>
                  <button onClick={() => nextStep()} className="glass-card flex items-center justify-center py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm gap-2 col-span-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" className="w-4 h-4 opacity-80" /> Outlook
                  </button>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} transition-all`}
              >
                Avançar
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="stepTheme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">Escolha o Modo</h1>
              <p className="text-gray-300 text-lg">Selecione como será o visual do seu perfil.</p>
              
              <div className="grid gap-4 mt-2">
                <button 
                  onClick={() => setThemeMode('adult')} 
                  className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all backdrop-blur-md ${themeMode === 'adult' ? 'bg-accent-blue/20 border-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  <div className="p-4 bg-white/10 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <span className="font-semibold text-lg">Modo Adulto</span>
                </button>
                <button 
                  onClick={() => setThemeMode('child')} 
                  className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all backdrop-blur-md ${themeMode === 'child' ? 'bg-[#ff5c00]/20 border-[#ff5c00] text-white shadow-[0_0_20px_rgba(255,92,0,0.3)]' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  <div className="p-4 bg-white/10 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <span className="font-semibold text-lg">Modo Infantil</span>
                </button>
              </div>

              <button 
                onClick={nextStep}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} transition-all`}
                
              >
                Avançar
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">Onde o barulho mais te incomoda?</h1>
              <p className="text-gray-300 text-lg">Pode escolher mais de uma opção.</p>
              
              <div className="flex flex-col gap-3 mt-4">
                {[
                  { id: 'transporte', label: '🚌 Transporte (Ônibus, Metrô)' },
                  { id: 'escola', label: '🏫 Escola / Faculdade' },
                  { id: 'trabalho', label: '💼 Trabalho' },
                  { id: 'shopping', label: '🛒 Supermercado / Shopping' },
                  { id: 'casa', label: '🏠 Casa' }
                ].map(loc => {
                  const isSelected = locations.includes(loc.id);
                  return (
                    <button 
                      key={loc.id}
                      onClick={() => toggleLocation(loc.id)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected ? `${isChild ? "bg-[#ff5c00]/20 border-[#ff5c00] text-white shadow-[0_0_15px_rgba(255,92,0,0.2)]" : "bg-accent-blue/20 border-accent-blue text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]"}` : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-lg">{loc.label}</span>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={nextStep}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-8 ${primaryShadow} transition-all`}
              >
                Avançar
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">Quem seria sua rede de apoio? 🤝</h1>
              <p className="text-gray-300 text-lg">Se você usar o Botão de Pânico, podemos avisar alguém de confiança para te ajudar.</p>
              
              <div className="space-y-4 mt-2">
                <input 
                  type="text" placeholder="Nome da pessoa (Ex: Mãe, João)" 
                  value={supportName} onChange={e => setSupportName(e.target.value)}
                  className={`w-full glass-card p-4 focus:outline-none ${isChild ? "focus:border-[#ff5c00]" : "focus:border-accent-blue"} text-white placeholder-gray-500`}
                />
                <input 
                  type="tel" placeholder="Celular / WhatsApp" 
                  value={supportPhone} onChange={e => setSupportPhone(e.target.value)}
                  className={`w-full glass-card p-4 focus:outline-none ${isChild ? "focus:border-[#ff5c00]" : "focus:border-accent-blue"} text-white placeholder-gray-500`}
                />
              </div>

              <div className="glass-card p-4 flex justify-between items-center mt-2">
                <span className="text-white text-sm font-medium pr-4">Avisar esta pessoa quando eu estiver em crise</span>
                <button 
                  onClick={() => setAlertSupport(!alertSupport)} 
                  className={`w-14 h-8 shrink-0 rounded-full p-1 transition-colors ${alertSupport ? (isChild ? 'bg-[#ff5c00]' : 'bg-accent-blue') : 'bg-gray-600'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${alertSupport ? 'ml-6' : 'ml-0'}`} />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-white font-medium mb-3">Você faz acompanhamento com psicólogo(a)?</p>
                <div className="flex gap-4">
                  <button onClick={() => setHasTherapist(true)} className={`flex-1 py-3 rounded-xl border transition-all ${hasTherapist === true ? `${primaryBg} ${primaryBorder} text-white` : 'bg-white/5 border-white/10 text-gray-300'}`}>Sim</button>
                  <button onClick={() => setHasTherapist(false)} className={`flex-1 py-3 rounded-xl border transition-all ${hasTherapist === false ? `${primaryBg} ${primaryBorder} text-white` : 'bg-white/5 border-white/10 text-gray-300'}`}>Não</button>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} transition-all`}
              >
                Avançar
              </button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 text-center items-center">
              <div className="w-24 h-24 rounded-full ${isChild ? 'bg-[#ff5c00]/10 border-[#ff5c00]/30' : 'bg-accent-blue/10 border-accent-blue/30'} flex items-center justify-center border relative">
                <Mic className={`w-10 h-10 ${primaryText} relative z-10`} />
                <div className="absolute inset-0 ${isChild ? 'bg-[#ff5c00]/20' : 'bg-accent-blue/20'} rounded-full animate-ping opacity-50" />
              </div>
              <h1 className="text-3xl font-light text-white leading-tight">Conheça o seu Guardião Automático 🛡️</h1>
              <p className="text-gray-300 text-lg">Nosso sistema pode escutar o ambiente e te proteger de barulhos muito altos antes mesmo de eles te incomodarem.</p>
              
              <div className="glass-card-active p-5 text-sm text-left text-gray-300 leading-relaxed mt-4">
                <strong className="text-white block mb-2">Fique tranquilo(a):</strong>
                O Guardião só mede o volume do som. Ele <span className="text-white">não grava vozes</span>, <span className="text-white">não salva conversas</span> e <span className="text-white">não precisa de internet</span>.
              </div>

              <button 
                onClick={async () => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    // Immediately stop the tracks since we just wanted permission
                    stream.getTracks().forEach(t => t.stop());
                    nextStep();
                  } catch (e) {
                    alert('Permissão de microfone negada. O Guardião Automático não funcionará sem ela. Você pode conceder nas configurações do site/app depois.');
                    nextStep();
                  }
                }}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-8 ${primaryShadow} transition-all`}
              >
                Permitir uso do Microfone
              </button>
              
               <button 
                onClick={nextStep}
                className="text-gray-500 font-medium py-2 rounded-full w-full hover:text-white transition-colors"
               >
                Pular esta etapa por enquanto
               </button>
            </motion.div>
          )}

          {(step === 7 && themeMode === 'adult' || step === 9 && themeMode === 'child') && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h1 className="text-3xl font-light text-white leading-tight">Vamos encontrar o Seu Refúgio 🎧</h1>
              <p className="text-gray-300 text-lg">Coloque os fones de ouvido. Qual destes sons te deixa mais calmo(a) e confortável?</p>
              
              <div className="flex flex-col gap-4 mt-4">
                {REFUGE_SOUNDS.map(sound => {
                  const isPlaying = playingPreview === sound.id;
                  const isSelected = refugeSound === sound.id;
                  
                  return (
                    <div 
                      key={sound.id}
                      onClick={() => setRefugeSound(sound.id)}
                      className={`p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer border ${
                        isSelected ? `${isChild ? "bg-[#ff5c00]/20 border-[#ff5c00] shadow-[0_0_15px_rgba(255,92,0,0.2)]" : "bg-accent-blue/20 border-accent-blue shadow-[0_0_15px_rgba(56,189,248,0.2)]"}` : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          
                          // First stop whatever is currently playing
                          ['som-a', 'som-b', 'som-c'].forEach(s => stopSound(s));
                          
                          if (isPlaying) {
                            setPlayingPreview(null);
                          } else {
                            setPlayingPreview(sound.id);
                            // explicitly trigger play on click to avoid AudioContext restrictions
                            // the AudioContext resume happens inside playSound
                            await playSound(sound.id);
                          }
                        }}
                        className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                           isPlaying ? `${primaryBg} text-white ${primaryBorder}` : "bg-white/10 border-white/20 text-white"
                        }`}
                      >
                         {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                      </button>
                      <span className="text-sm font-medium text-white">{sound.label}</span>
                      {isSelected && <Check className={`w-5 h-5 ${primaryText} ml-auto shrink-0`} strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-white font-medium mt-4">Qual você escolhe como seu som de emergência?</p>

              <button 
                onClick={nextStep}
                disabled={!refugeSound}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} disabled:opacity-50 disabled:shadow-none transition-all`}
              >
                Salvar Meu Refúgio
              </button>
            </motion.div>
          )}

          {step === 7 && themeMode === 'child' && (
            <motion.div key="stepKidsTheme" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col text-center items-center justify-center h-full gap-6">
              <h1 className="text-3xl font-bold text-[#ff5c00] leading-tight">Qual é o seu mundo favorito? 🌎</h1>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <button onClick={() => setKidsTheme('dino')} className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${kidsTheme === 'dino' ? 'bg-[#ff5c00]/20 border-2 border-[#ff5c00] shadow-[0_0_20px_rgba(255,92,0,0.4)]' : 'bg-white/5 border border-white/10 grayscale hover:grayscale-0'}`}>
                  <span className="text-5xl">🦖</span>
                  <span className="font-bold text-white">Dinossauros</span>
                </button>
                <button onClick={() => setKidsTheme('space')} className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${kidsTheme === 'space' ? 'bg-indigo-500/20 border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 border border-white/10 grayscale hover:grayscale-0'}`}>
                  <span className="text-5xl">🚀</span>
                  <span className="font-bold text-white">Espaço Sideral</span>
                </button>
                <button onClick={() => setKidsTheme('cars')} className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all col-span-2 ${kidsTheme === 'cars' ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 border border-white/10 grayscale hover:grayscale-0'}`}>
                  <span className="text-5xl">🚗</span>
                  <span className="font-bold text-white">Carros</span>
                </button>
              </div>

              <button 
                onClick={nextStep}
                className="bg-[#ff5c00] text-white font-bold py-4 rounded-full w-full mt-4 shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all text-lg"
              >
                Avançar
              </button>
            </motion.div>
          )}

          {step === 8 && themeMode === 'child' && (
            <motion.div key="stepAutonomy" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col text-center items-center justify-center h-full gap-6">
              <h1 className="text-3xl font-bold text-accent-blue leading-tight">Filtro de Autonomia</h1>
              <p className="text-gray-300 text-lg">A criança fará o registro de suas próprias emoções após o uso do Som Refúgio?</p>
              
              <div className="flex flex-col gap-4 w-full mt-4">
                <button onClick={() => setChildAutonomyFilter(true)} className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-1 ${childAutonomyFilter ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'}`}>
                  <span className={`font-bold ${childAutonomyFilter ? 'text-accent-blue' : 'text-white'}`}>Ligado (Sim)</span>
                  <span className="text-sm text-gray-400">Após a utilização do SOS Pânico, a criança vê o termômetro lúdico dos temas para apontar como se sente. A tela de avaliação só aparecerá após a utilização do SOS Pânico.</span>
                </button>
                <button onClick={() => setChildAutonomyFilter(false)} className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-1 ${!childAutonomyFilter ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'}`}>
                  <span className={`font-bold ${!childAutonomyFilter ? 'text-accent-blue' : 'text-white'}`}>Desligado (Não)</span>
                  <span className="text-sm text-gray-400">O app pula essa etapa. O registro aguarda silenciosamente no painel dos pais.</span>
                </button>
              </div>
              <button 
                onClick={nextStep}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} transition-all text-lg`}
              >
                Avançar
              </button>
            </motion.div>
          )}
          {step === 10 && themeMode === 'child' && (
            <motion.div key="stepPin" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col text-center items-center justify-center h-full gap-6">
              <h1 className="text-3xl font-bold text-accent-blue leading-tight">Proteger o Diário 🔒</h1>
              <p className="text-gray-300 text-sm">O Diário guarda informações sensíveis das crises e análises. Vamos protegê-lo com uma senha (PIN) apenas para pais e terapeutas.</p>
              
              <div className="flex flex-col gap-4 w-full mt-4">
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="Digite um PIN (4 números)"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl tracking-[1em] placeholder:tracking-normal placeholder:text-base placeholder:font-sans placeholder:text-gray-400 focus:outline-none focus:border-accent-blue transition-colors text-white"
                />
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="Confirme o PIN"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl tracking-[1em] placeholder:tracking-normal placeholder:text-base placeholder:font-sans placeholder:text-gray-400 focus:outline-none focus:border-accent-blue transition-colors text-white"
                />
                {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
              </div>
              <button 
                onClick={() => {
                  if (pin.length < 4) {
                    setPinError('O PIN deve ter 4 números.');
                    return;
                  }
                  if (pin !== confirmPin) {
                    setPinError('Os PINs não coincidem.');
                    return;
                  }
                  nextStep();
                }}
                className={`${primaryBg} text-white font-bold py-4 rounded-full w-full mt-4 ${primaryShadow} transition-all text-lg`}
              >
                Salvar Senha
              </button>
            </motion.div>
          )}
          {step === totalSteps && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col text-center items-center justify-center h-full gap-6">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 mb-4">
                <Check className="w-12 h-12 text-green-400" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-light text-white leading-tight">Tudo pronto,<br/><span className="font-medium">{name}</span>! ✨</h1>
              <p className="text-gray-300 text-lg">Seu espaço seguro está configurado. Lembre-se: o seu Botão de Pânico está sempre pronto na tela inicial.</p>
              
              <button 
                onClick={handleFinish}
                className="bg-accent-blue text-white font-bold py-4 px-8 rounded-full w-full mt-12 shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
              >
                Ir para a Mesa de Som <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
