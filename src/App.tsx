import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';

import { FloatingDinoBackground } from './components/FloatingDinoBackground';
import { FloatingCarsBackground } from './components/FloatingCarsBackground';
import { FloatingSpaceBackground } from './components/FloatingSpaceBackground';

import { TabIndex, SubView } from './types';
import { BottomNav } from './components/BottomNav';
import { playSound, stopSound, SoundType, toggleRefuge, playUrlSound } from './lib/audioEngine';
import { useGuardian } from './lib/useGuardian';

const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const GuardianView = lazy(() => import('./views/GuardianView').then(m => ({ default: m.GuardianView })));
const CommunityView = lazy(() => import('./views/CommunityView').then(m => ({ default: m.CommunityView })));
const DiaryView = lazy(() => import('./views/DiaryView').then(m => ({ default: m.DiaryView })));
const ProfileView = lazy(() => import('./views/ProfileView').then(m => ({ default: m.ProfileView })));
const PanicOverlay = lazy(() => import('./views/PanicOverlay').then(m => ({ default: m.PanicOverlay })));

const OnboardingView = lazy(() => import('./views/OnboardingView').then(m => ({ default: m.OnboardingView })));

const EmergencySmsOverlay = lazy(() => import('./views/EmergencySmsOverlay').then(m => ({ default: m.EmergencySmsOverlay })));
const AuthView = lazy(() => import('./views/AuthView').then(m => ({ default: m.AuthView })));
const PinOverlay = lazy(() => import('./views/PinOverlay').then(m => ({ default: m.PinOverlay })));

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    try { return localStorage.getItem('currentUserEmail') || ''; } catch(e) { return ''; }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { return localStorage.getItem('isLoggedIn') === 'true'; } catch(e) { return false; }
  });
  const [isOnboarding, setIsOnboarding] = useState(() => {
    try {
      if (localStorage.getItem('isLoggedIn') !== 'true') return false;
      const email = localStorage.getItem('currentUserEmail');
      if (!email) return false;
      return localStorage.getItem(`onboardingCompleted_${email}`) !== 'true';
    } catch(e) { return false; }
  });

  
  const [themeMode, setThemeMode] = useState<'adult'|'child'>(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      if (email) {
        const data = localStorage.getItem(`onboardingData_${email}`);
        if (data) return JSON.parse(data).themeMode || 'adult';
      }
    } catch(e) {}
    return 'adult';
  });
  
  const [kidsTheme, setKidsTheme] = useState<'dino'|'space'|'cars'|null>(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      if (email) {
        const data = localStorage.getItem(`onboardingData_${email}`);
        if (data) return JSON.parse(data).kidsTheme || null;
      }
    } catch(e) {}
    return null;
  });
  
  const [parentalPin, setParentalPin] = useState(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      if (email) {
        const data = localStorage.getItem(`onboardingData_${email}`);
        if (data) return JSON.parse(data).parentalPin || '';
      }
    } catch(e) {}
    return '';
  });
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<{tab: TabIndex, subView?: SubView, diaryStartView?: 'registro'|'analises'|'relatorios'} | null>(null);

  // New effect to apply theme mode from onboarding data
  useEffect(() => {
    if (currentUserEmail) {
      try {
        const data = localStorage.getItem(`onboardingData_${currentUserEmail}`);
        if (data) {
          const parsed = JSON.parse(data);
          setThemeMode(parsed.themeMode || 'adult');
          setKidsTheme(parsed.kidsTheme || null);
          setParentalPin(parsed.parentalPin || '');
          if (parsed.themeMode === 'child') {
            document.body.classList.add('child-mode');
          } else {
            document.body.classList.remove('child-mode');
          }
        }
      } catch (e) {}
    } else {
      setThemeMode('adult');
      setKidsTheme(null);
      setParentalPin('');
      document.body.classList.remove('child-mode');
    }
  }, [currentUserEmail, isOnboarding]);

    const [currentTab, setCurrentTab] = useState<TabIndex>('home');
  const [currentSubView, setCurrentSubView] = useState<SubView>('none');
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [diaryStartView, setDiaryStartView] = useState<'registro'|'analises'|'relatorios'>('registro');
  
  const [isRefugeOpen, setIsRefugeOpen] = useState(false);
  const [isPostCrisisDiaryOpen, setIsPostCrisisDiaryOpen] = useState(false);
  const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);
  const [isRefugeActive, setIsRefugeActive] = useState(false);
  const [activeRefugeSound, setActiveRefugeSound] = useState<string | null>(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        return JSON.parse(data).refugeSound || null;
      }
    } catch (e) {}
    return null;
  });
  
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [guardianMonitorActive, setGuardianMonitorActive] = useState(false);
  const [micSensitivity, setMicSensitivity] = useState(() => {
    try { return parseInt(localStorage.getItem('micSensitivity') || '100'); } catch(e) { return 100; }
  });
  const [interventionActive, setInterventionActive] = useState(true);

  const [isSmsOverlayOpen, setIsSmsOverlayOpen] = useState(false);

  const [importedSounds, setImportedSounds] = useState<{id: string, name: string, url: string}[]>([]);

  const toggleSound = (soundId: string, url?: string) => {
    const type = soundId as SoundType;
    if (activeSounds[soundId]) {
      stopSound(type);
      setActiveSounds(prev => ({ ...prev, [soundId]: false }));
    } else {
      if (url) {
        playUrlSound(soundId, url);
      } else {
        playSound(type);
      }
      setActiveSounds(prev => ({ ...prev, [soundId]: true }));
    }
  };

  const handleStopAllSounds = () => {
    Object.keys(activeSounds).forEach(soundId => {
      if (activeSounds[soundId]) {
        stopSound(soundId as SoundType);
      }
    });
    setActiveSounds({});
  };

  useEffect(() => {
    const activeCount = Object.values(activeSounds).filter(Boolean).length;
    
    if (activeCount > 0) {
      if (silentAudioRef.current) {
        silentAudioRef.current.play().catch(() => {});
      }
      
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Serenity Mixer',
          artist: `${activeCount} som(ns) em execução`,
          album: 'Serenity App'
        });
        navigator.mediaSession.playbackState = 'playing';
        
        navigator.mediaSession.setActionHandler('pause', () => handleStopAllSounds());
        navigator.mediaSession.setActionHandler('stop', () => handleStopAllSounds());
      }
    } else {
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
      }
      
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
      }
    }
  }, [activeSounds]);

  const handleToggleRefugeSound = (soundId: string) => {
    setActiveRefugeSound(prev => {
      const next = prev === soundId ? null : soundId;
      setIsRefugeActive(!!next); // Active if there's a selected sound
      return next;
    });
  };

  useEffect(() => {
    toggleRefuge(isRefugeActive, activeRefugeSound);
  }, [isRefugeActive, activeRefugeSound]);

  const handlePanicStart = useCallback(() => {
    if (isPanicOpen) return;
    setIsPanicOpen(true);
    setIsSmsOverlayOpen(true);
    setIsSmsSent(false);
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`diaryRecords_${email}`);
      const records = data ? JSON.parse(data) : [];
      records.push({
        intensity: 100,
        moodId: 'panic',
        triggers: ['SOS Pânico automático'],
        estrategiaUsadaString: 'Botão de Pânico',
        observacao: themeMode === 'child' && !childAutonomyFilter ? 'Registro automático (Aguardando preenchimento)' : '',
        date: Date.now()
      });
      localStorage.setItem(`diaryRecords_${email}`, JSON.stringify(records));
      window.dispatchEvent(new Event('diary-updated'));
    } catch(e) {}
  }, [isPanicOpen, themeMode, childAutonomyFilter]);

  const handleSustainedPeak = useCallback(() => {
    if (interventionActive && !isPanicOpen) {
      handlePanicStart();
    }
  }, [interventionActive, isPanicOpen, handlePanicStart]);

  const dbLevel = useGuardian(guardianMonitorActive, handleSustainedPeak, micSensitivity);

  const handleSmsOverlayClose = (sendSms: boolean) => {
    setIsSmsOverlayOpen(false);
    setIsSmsSent(sendSms);
    
    if (sendSms) {
      try {
        const email = localStorage.getItem('currentUserEmail');
        const data = localStorage.getItem(`onboardingData_${email}`);
        if (data) {
          const parsed = JSON.parse(data);
          let contacts = parsed.contacts || [];
          if (contacts.length === 0 && parsed.supportNetwork && parsed.supportNetwork.phone) {
            contacts = [parsed.supportNetwork];
          }
          
          if (contacts.length > 0) {
            const userName = parsed.name || 'Alguém';
            const phones = contacts.map((c: any) => c.phone.replace(/\D/g, '')).join(',');
            const message = encodeURIComponent(`${userName} está passando por uma crise sensorial e pode precisar de apoio.`);
            
            // Em PWAs/Web Mobile, location.href é a forma mais confiável de abrir URIs nativos
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const separator = isIOS ? '&' : '?';
            window.location.href = `sms:${phones}${separator}body=${message}`;
          }
        }
      } catch (e) {
        console.error('Erro ao abrir SMS:', e);
      }
    }
  };



  const executeNavigation = (tab: TabIndex, subView: SubView = 'none', diaryStart?: 'registro'|'analises'|'relatorios') => {
    setCurrentTab(tab);
    setCurrentSubView(subView);
    if (tab === 'diary') {
      setDiaryStartView(diaryStart || 'registro');
    }
  };

  const checkPinAndNavigate = (tab: TabIndex, subView: SubView = 'none', diaryStart?: 'registro'|'analises'|'relatorios') => {
    if (themeMode === 'child' && tab === 'diary') {
      setPendingTab({ tab, subView, diaryStartView: diaryStart });
      setIsPinOpen(true);
      return;
    }
    executeNavigation(tab, subView, diaryStart);
  };

  const navigateTo = (tab: TabIndex, subView: SubView = 'none') => {
    checkPinAndNavigate(tab, subView);
  };

  // When changing main tabs, reset subview
  const handleTabChange = (tab: TabIndex) => {
    checkPinAndNavigate(tab, tab === 'profile' ? currentSubView : 'none', tab === 'diary' ? 'registro' : undefined);
  };

  const handleSaveToDiaryAnalyses = () => {
    checkPinAndNavigate('diary', 'none', 'analises');
  };

  const handleKidsThemeChange = (newTheme: 'dino'|'space'|'cars') => {
    setKidsTheme(newTheme);
    if (currentUserEmail) {
      try {
        const dataStr = localStorage.getItem(`onboardingData_${currentUserEmail}`);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          data.kidsTheme = newTheme;
          localStorage.setItem(`onboardingData_${currentUserEmail}`, JSON.stringify(data));
        }
      } catch (e) {}
    }
  };

  if (!isLoggedIn) {
    return <AuthView 
      onLogin={(email) => {
        setCurrentUserEmail(email);
        setIsLoggedIn(true);
      }} 
      onCreateAccount={() => {
        setIsLoggedIn(true);
        setIsOnboarding(true); 
      }} 
    />;
  }

  if (isOnboarding) {
    return <OnboardingView onComplete={(data) => {
      const email = data.email || 'novo@usuario.com'; // fallback if skipped somehow
      
      localStorage.setItem('currentUserEmail', email);
      setCurrentUserEmail(email);

      const usersData = localStorage.getItem('tea_users');
      const users = usersData ? JSON.parse(usersData) : [];
      if (!users.includes(email)) {
        users.push(email);
        localStorage.setItem('tea_users', JSON.stringify(users));
      }

      localStorage.setItem(`onboardingCompleted_${email}`, 'true');
      localStorage.setItem(`onboardingData_${email}`, JSON.stringify(data));
      setActiveRefugeSound(data.refugeSound || null);
      setChildAutonomyFilter(data.childAutonomyFilter !== false);
      if (data.parentalPin) {
        setParentalPin(data.parentalPin);
      }
      setThemeMode(data.themeMode || 'adult');
      setKidsTheme(data.kidsTheme || null);
      if (data.themeMode === 'child') {
        document.body.classList.add('child-mode');
      } else {
        document.body.classList.remove('child-mode');
      }
      setIsOnboarding(false);
    }} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden selection:bg-accent-blue/30 font-sans">
      <audio 
        ref={silentAudioRef} 
        src="data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" 
        loop 
        playsInline 
        className="hidden" 
      />
      
      <main key={currentUserEmail} className="h-full w-full relative">
        {themeMode === 'child' && kidsTheme === 'space' && <FloatingSpaceBackground showImages={currentTab === 'home'} />}
        {themeMode === 'child' && kidsTheme === 'dino' && <FloatingDinoBackground showImages={currentTab === 'home'} />}
        {themeMode === 'child' && kidsTheme === 'cars' && <FloatingCarsBackground showImages={currentTab === 'home'} />}
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <AnimatePresence mode="wait">
            {currentTab === 'home' && (
              <HomeView key="home" 
                onPanic={handlePanicStart} 
                isRefugeActive={isRefugeActive}
                onRefugeToggle={() => setIsRefugeOpen(true)}
                activeSounds={activeSounds}
                toggleSound={toggleSound}
                importedSounds={importedSounds}
                setImportedSounds={setImportedSounds}
                themeMode={themeMode}
                kidsTheme={kidsTheme}
                onThemeChange={handleKidsThemeChange}
              />
            )}
            {currentTab === 'guardian' && (
              <GuardianView key="guardian" 
                onPanic={handlePanicStart}
                monitorActive={guardianMonitorActive}
                setMonitorActive={setGuardianMonitorActive}
                interventionActive={interventionActive}
                setInterventionActive={setInterventionActive}
                dbLevel={dbLevel}
                micSensitivity={micSensitivity}
                setMicSensitivity={(val) => {
                  setMicSensitivity(val);
                  localStorage.setItem('micSensitivity', val.toString());
                }}
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
            {currentTab === 'community' && (
              <CommunityView key="community" 
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
            {currentTab === 'diary' && (
              <DiaryView key="diary" 
                startView={diaryStartView} 
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
            {currentTab === 'profile' && (
              <ProfileView key="profile" 
                currentSubView={currentSubView} 
                setSubView={setCurrentSubView} 
                onSaveToDiary={handleSaveToDiaryAnalyses}
                onLogout={() => {
                  handleStopAllSounds();
                  
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('currentUserEmail');
                  
                  // Complete State Reset
                  setCurrentUserEmail('');
                  setThemeMode('adult');
                  setKidsTheme(null);
                  setParentalPin('');
                  setActiveRefugeSound(null);
                  setCurrentTab('home');
                  setCurrentSubView('none');
                  setChildAutonomyFilter(true);
                  setIsRefugeActive(false);
                  setActiveSounds({});
                  setGuardianMonitorActive(false);
                  setInterventionActive(true);
                  setMicSensitivity(100);
                  setIsPinOpen(false);
                  setIsPanicOpen(false);
                  setIsRefugeOpen(false);
                  setImportedSounds([]);
                  setPendingTab(null);
                  setDiaryStartView('registro');
                  setIsSmsOverlayOpen(false);
                  setIsPostCrisisDiaryOpen(false);
                  
                  document.body.classList.remove('child-mode');
                  
                  // Reset all React state first for visual feedback
                  setIsLoggedIn(false);
                }}
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Hide bottom nav if subview is active in profile or panic is open */}
      <AnimatePresence>
        {currentSubView === 'none' && !isPanicOpen && (
          <div className="hide-on-print">
            <BottomNav 
              activeTab={currentTab} 
              onChange={handleTabChange} 
              themeMode={themeMode}
              kidsTheme={kidsTheme}
            />
          </div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        
        {isPostCrisisDiaryOpen && (
          <div className="fixed inset-0 z-[100] bg-[#060b13] overflow-y-auto">
             <div className="max-w-md mx-auto p-6 pt-12 relative min-h-screen">
                <button 
                  onClick={() => setIsPostCrisisDiaryOpen(false)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 z-[999] shadow-xl border border-white/40"
                >
                  <span className="text-xl font-bold">✕</span>
                </button>
                
                <DiaryView key="diary" 
                  startView="registro" 
                  themeMode={themeMode} 
                  kidsTheme={kidsTheme} 
                  isChildAutonomyMode={true} 
                  onAutonomyComplete={() => setIsPostCrisisDiaryOpen(false)} 
                />
             </div>
          </div>
        )}
        {isPanicOpen && (
          <PanicOverlay 
            isOpen={true} 
            onClose={() => {
              setIsPanicOpen(false);
              if (themeMode === 'child' && childAutonomyFilter) {
                setIsPostCrisisDiaryOpen(true);
              }
            }} 
            themeMode={themeMode}
            kidsTheme={kidsTheme}
            isSmsSent={isSmsSent}
          />
        )}

        <EmergencySmsOverlay
           isOpen={isSmsOverlayOpen}
           onClose={handleSmsOverlayClose}
        />
        <PinOverlay
           isOpen={isPinOpen}
           mode={parentalPin ? 'verify' : 'create'}
           correctPin={parentalPin}
           onSuccess={(newPin?: string) => {
             setIsPinOpen(false);
             if (newPin) {
               setParentalPin(newPin);
               try {
                 const data = localStorage.getItem(`onboardingData_${currentUserEmail}`);
                 if (data) {
                   const parsed = JSON.parse(data);
                   parsed.parentalPin = newPin;
                   localStorage.setItem(`onboardingData_${currentUserEmail}`, JSON.stringify(parsed));
                 }
               } catch (e) {}
             }
             if (pendingTab) {
               executeNavigation(pendingTab.tab, pendingTab.subView, pendingTab.diaryStartView);
               setPendingTab(null);
             }
           }}
           onCancel={() => {
             setIsPinOpen(false);
             setPendingTab(null);
           }}
        />
      </Suspense>
    </div>
  );
}
