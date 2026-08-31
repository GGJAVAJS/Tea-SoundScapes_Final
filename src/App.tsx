import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
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
const RefugeOverlay = lazy(() => import('./views/RefugeOverlay').then(m => ({ default: m.RefugeOverlay })));
const OnboardingView = lazy(() => import('./views/OnboardingView').then(m => ({ default: m.OnboardingView })));
const GuardianAlertOverlay = lazy(() => import('./views/GuardianAlertOverlay').then(m => ({ default: m.GuardianAlertOverlay })));
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

  
  const [themeMode, setThemeMode] = useState<'adult'|'child'>('adult');
  const [kidsTheme, setKidsTheme] = useState<'dino'|'space'|'cars'|'animals'|'magic'|null>(null);
  const [parentalPin, setParentalPin] = useState('');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<{tab: TabIndex, subView?: SubView, diaryStartView?: 'registro'|'analises'} | null>(null);

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
  const [diaryStartView, setDiaryStartView] = useState<'registro'|'analises'>('registro');
  
  const [isRefugeOpen, setIsRefugeOpen] = useState(false);
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
  const [interventionActive, setInterventionActive] = useState(true);
  const [isGuardianAlertOpen, setIsGuardianAlertOpen] = useState(false);

  const [isSmsOverlayOpen, setIsSmsOverlayOpen] = useState(false);
  const [lastSmsAlertTime, setLastSmsAlertTime] = useState<number | null>(null);

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

  const handleSustainedPeak = useCallback(() => {
    // Only suggest if intervention is active, refuge isn't already active, and no overlays are open
    if (interventionActive && !isRefugeActive && !isPanicOpen && !isGuardianAlertOpen && !isRefugeOpen) {
       setIsGuardianAlertOpen(true);
    }
  }, [interventionActive, isRefugeActive, isPanicOpen, isGuardianAlertOpen, isRefugeOpen]);

  const dbLevel = useGuardian(guardianMonitorActive, handleSustainedPeak);

  const handlePanicStart = () => {
    setIsPanicOpen(true);
    setIsSmsSent(false);
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`diaryRecords_${email}`);
      const records = data ? JSON.parse(data) : [];
      records.push({
        intensity: 100,
        moodId: 'panic',
        triggers: ['SOS Pânico automático'],
        date: Date.now()
      });
      localStorage.setItem(`diaryRecords_${email}`, JSON.stringify(records));
      window.dispatchEvent(new Event('diary-updated'));
    } catch(e) {}
  };

  useEffect(() => {
    // Triggers: panic open or guardian hitting peak
    const isTriggerActive = isPanicOpen || (guardianMonitorActive && dbLevel >= 75);
    
    if (isTriggerActive && !isSmsOverlayOpen) {
      const now = Date.now();
      const fifteenMins = 15 * 60 * 1000;
      
      if (!lastSmsAlertTime || (now - lastSmsAlertTime >= fifteenMins)) {
        setIsSmsOverlayOpen(true);
      }
    }
  }, [isPanicOpen, guardianMonitorActive, dbLevel, isSmsOverlayOpen, lastSmsAlertTime]);

  const handleSmsOverlayClose = (sendSms: boolean) => {
    setIsSmsOverlayOpen(false);
    setLastSmsAlertTime(Date.now());
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
            
            // Using the native SMS app via sms: URI scheme
            // On iOS '&body=' is often used, on Android '?body=' is common.
            // Using ?body as a default format standard
            window.open(`sms:${phones}?body=${message}`, '_system');
          }
        }
      } catch (e) {}
    }
  };

  const acceptRefuge = () => {
    setIsGuardianAlertOpen(false);
    setActiveRefugeSound('som-b'); // Auto-select pink noise for panic intervention
    setIsRefugeActive(true);
    setIsRefugeOpen(true);
  };

  const executeNavigation = (tab: TabIndex, subView: SubView = 'none', diaryStart?: 'registro'|'analises') => {
    setCurrentTab(tab);
    setCurrentSubView(subView);
    if (tab === 'diary') {
      setDiaryStartView(diaryStart || 'registro');
    }
  };

  const checkPinAndNavigate = (tab: TabIndex, subView: SubView = 'none', diaryStart?: 'registro'|'analises') => {
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
      
      <main className="h-full w-full relative">
        <Suspense fallback={<div className="flex items-center justify-center h-full w-full bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <AnimatePresence mode="wait">
            {currentTab === 'home' && (
              <HomeView 
                onPanic={handlePanicStart} 
                isRefugeActive={isRefugeActive}
                onRefugeToggle={() => setIsRefugeOpen(true)}
                activeSounds={activeSounds}
                toggleSound={toggleSound}
                importedSounds={importedSounds}
                setImportedSounds={setImportedSounds}
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
            {currentTab === 'guardian' && (
              <GuardianView 
                monitorActive={guardianMonitorActive}
                setMonitorActive={setGuardianMonitorActive}
                interventionActive={interventionActive}
                setInterventionActive={setInterventionActive}
                dbLevel={dbLevel}
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />
            )}
            {currentTab === 'community' && <CommunityView />}
            {currentTab === 'diary' && <DiaryView startView={diaryStartView} />}
            {currentTab === 'profile' && (
              <ProfileView 
                currentSubView={currentSubView} 
                setSubView={setCurrentSubView} 
                onSaveToDiary={handleSaveToDiaryAnalyses}
                onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  setIsLoggedIn(false);
                  setCurrentTab('home');
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
        {currentSubView === 'none' && !isPanicOpen && !isGuardianAlertOpen && !isRefugeOpen && (
          <div className="hide-on-print">
            <BottomNav activeTab={currentTab} onChange={handleTabChange} />
          </div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <RefugeOverlay 
          isOpen={isRefugeOpen} 
          onClose={() => setIsRefugeOpen(false)} 
          activeRefuge={activeRefugeSound}
          onToggleRefuge={handleToggleRefugeSound}
        />
        <PanicOverlay 
          isOpen={isPanicOpen} 
          onClose={() => setIsPanicOpen(false)} 
          themeMode={themeMode}
          kidsTheme={kidsTheme}
          isSmsSent={isSmsSent}
        />
        <GuardianAlertOverlay 
           isOpen={isGuardianAlertOpen} 
           onAccept={acceptRefuge} 
           onDismiss={() => setIsGuardianAlertOpen(false)} 
        />
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
