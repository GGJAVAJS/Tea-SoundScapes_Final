import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Bell, Info, ChevronRight, ArrowLeft, Plus, Edit2, X, LogOut, Mic, Camera, MapPin, Lock } from 'lucide-react';
import { SubView } from '../types';
import React, { useState, useRef, useEffect } from 'react';
import { DinoProfileBackground } from '../components/DinoProfileBackground';
import { getReportsByUser, deleteReport } from '../lib/reportDB';

interface ProfileViewProps {
  currentSubView: SubView;
  setSubView: (view: SubView) => void;
  onSaveToDiary?: () => void;
  onLogout?: () => void;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
}

export function ProfileView({ currentSubView, setSubView, onSaveToDiary, onLogout, themeMode, kidsTheme }: ProfileViewProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const [userName, setUserName] = useState(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        return JSON.parse(data).name || 'Lucas';
      }
    } catch (e) {}
    return 'Lucas';
  });
  const [sensoryProfileText, setSensoryProfileText] = React.useState(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        const parsed = JSON.parse(data);
        const sound = parsed.refugeSound;
        if (sound === 'som-a') {
          return 'Perfil sensorial · Hipersensível a sons agudos / Busca conforto em frequências graves';
        } else if (sound === 'som-b') {
          return 'Perfil sensorial · Sensibilidade moderada / Busca mascaramento natural';
        } else if (sound === 'som-c') {
          return 'Perfil sensorial · Hipersensível a variações bruscas / Busca isolamento sonoro total';
        }
      }
    } catch (e) {}
    return 'Perfil sensorial · Não definido';
  });


  const [contacts, setContacts] = useState<any[]>(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.contacts && parsed.contacts.length > 0) {
          return parsed.contacts;
        } else if (parsed.supportNetwork && parsed.supportNetwork.name) {
          return [{ id: Date.now(), name: parsed.supportNetwork.name, phone: parsed.supportNetwork.phone }];
        }
      }
    } catch (e) {}
    return [{ id: 1, name: 'Maria da Silva', phone: '(11) 98765-4321' }];
  });

  const [hasTherapist, setHasTherapist] = useState<boolean>(() => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        return JSON.parse(data).hasTherapist === true;
      }
    } catch (e) {}
    return false;
  });

  return (
    <>
      {(themeMode !== 'child' || kidsTheme === 'cars' ) && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.93)' }}
        />
      )}
      {/* Background with naveet.png */}
      {themeMode === 'child' && kidsTheme === 'space' && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.img 
            src="/naveet.png" 
            alt=""
            className="absolute top-[10%] -right-4 w-40 opacity-70"
            animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: 'transform' }}
          />
        </div>
      )}

      {/* Background for Cars Theme in Profile */}
      {themeMode === 'child' && kidsTheme === 'cars' && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 w-full max-w-md mx-auto">
            <motion.img 
              src="/race-lights.png" 
              alt=""
              className="absolute top-[8%] -left-6 w-32 opacity-90"
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: 'transform' }}
            />
            <motion.img 
              src="/speed-meter.png" 
              alt=""
              className="absolute top-[45%] -right-8 w-36 opacity-95"
              animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{ willChange: 'transform' }}
            />
            <motion.img 
              src="/podium-stand.png" 
              alt=""
              className="absolute bottom-[10%] left-[50%] -translate-x-[50%] w-36 opacity-100 z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>
      )}

      {/* Background with Dino Theme */}
      {themeMode === 'child' && kidsTheme === 'dino' && <DinoProfileBackground />}

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {currentSubView === 'none' && <MainProfile setSubView={setSubView} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} userName={userName} contactsCount={contacts.length} onLogout={onLogout} isDinoTheme={isDinoTheme} sensoryProfileText={sensoryProfileText} />}
          {currentSubView === 'support' && <SupportNetwork setSubView={setSubView} contacts={contacts} setContacts={setContacts} hasTherapist={hasTherapist} setHasTherapist={setHasTherapist} isDinoTheme={isDinoTheme} />}
          {currentSubView === 'about' && <AboutYou setSubView={setSubView} userName={userName} setUserName={setUserName} onSaveToDiary={onSaveToDiary} isDinoTheme={isDinoTheme} />}
          {currentSubView === 'permissions' && <PermissionsView setSubView={setSubView} isDinoTheme={isDinoTheme} />}
        </AnimatePresence>
      </div>
    </>
  );
}

function MainProfile({ setSubView, avatarUrl, setAvatarUrl, userName, contactsCount, onLogout, isDinoTheme, sensoryProfileText }: { setSubView: (v: SubView) => void, avatarUrl: string | null, setAvatarUrl: (url: string) => void, userName: string, contactsCount: number, onLogout?: () => void, isDinoTheme?: boolean, sensoryProfileText: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: 'support', icon: Shield, title: 'Rede de Apoio', subtitle: `${contactsCount} contatos cadastrados` },
    { id: 'about', icon: User, title: 'Sobre Você', subtitle: 'Editar anamnese sensorial' },
    { id: 'permissions', icon: Lock, title: 'Permissões e Privacidade', subtitle: 'Gerenciar acessos do dispositivo' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6 pt-12 flex flex-col h-full max-w-md mx-auto pb-44 overflow-y-auto">
      <header className="mb-10">
        <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold text-white mb-8">Eu</h1>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 shrink-0 rounded-full glass-card-active flex items-center justify-center p-1 relative cursor-pointer group overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-accent-blue/30 blur-xl rounded-full" />
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover relative z-10" />
            ) : (
              <User className="w-8 h-8 text-white relative z-10" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          <div>
            <h2 className="text-xl font-medium text-white">Olá, {userName || 'Usuário'}</h2>
            <p className="text-xs text-gray-400 mt-1">{sensoryProfileText}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 mt-4">
        {menuItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setSubView(item.id as SubView)}
            className="p-5 flex items-center gap-4 text-left rounded-2xl border border-white/10 overflow-hidden active:bg-white/10 hover:bg-white/10 transition-all"
            style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <item.icon className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-gray-200 font-medium">{item.title}</div>
              {item.subtitle && <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        ))}
        {onLogout && (
          <>
            <button 
               onClick={onLogout}
              className="p-5 flex items-center gap-4 text-left rounded-2xl border border-white/10 overflow-hidden active:bg-white/10 hover:bg-white/10 transition-all"
              style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-full border border-danger-panic/20 flex items-center justify-center bg-danger-panic/10">
                <LogOut className="w-5 h-5 text-danger-panic" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Sair da Conta</div>
                <div className="text-xs text-gray-400 mt-0.5">Voltar para tela de boas-vindas</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
            {!confirmDelete ? (
              <button 
                onClick={() => setConfirmDelete(true)}
                className="p-5 flex items-center gap-4 text-left rounded-2xl border border-red-500/20 overflow-hidden active:bg-red-500/20 hover:bg-red-500/10 transition-all mt-4"
                style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
              >
                <div className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center bg-transparent">
                   <X className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="text-red-500 font-medium">Excluir Conta</div>
                  <div className="text-xs text-red-500/70 mt-0.5">Apagar dados permanentemente</div>
                </div>
              </button>
            ) : (
              <div className="p-5 mt-4 rounded-2xl border border-red-500/30 backdrop-blur-md" style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}>
                <p className="text-white text-sm mb-4 font-medium text-center">Tem certeza? Todos os dados serão apagados.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2.5 text-sm rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >Cancelar</button>
                  <button 
                    onClick={async () => {
                     const email = localStorage.getItem('currentUserEmail');
                     if (email) {
                       const keysToRemove: string[] = [];
                       for (let i = 0; i < localStorage.length; i++) {
                         const key = localStorage.key(i);
                         if (key && (key.includes(email) || key.endsWith(email))) {
                           keysToRemove.push(key);
                         }
                       }
                       keysToRemove.forEach(k => localStorage.removeItem(k));
                       
                       // Remove from tea_users array
                       const usersStr = localStorage.getItem('tea_users');
                       if (usersStr) {
                         try {
                           let users = JSON.parse(usersStr);
                           if (Array.isArray(users)) {
                             users = users.filter(u => u !== email && u?.email !== email);
                             localStorage.setItem('tea_users', JSON.stringify(users));
                           }
                         } catch (e) {}
                       }

                       // Clear IndexedDB reports
                       try {
                         const reports = await getReportsByUser(email);
                         for (const report of reports) {
                           await deleteReport(report.id);
                         }
                       } catch (e) {
                         console.error("Erro ao deletar relatorios:", e);
                       }
                       
                       // For hard start, also clear any other global state that might have leaked
                       localStorage.removeItem('themeMode');
                       localStorage.removeItem('kidsTheme');
                     }
                     if (onLogout) {
                       onLogout();
                     } else {
                       localStorage.removeItem('currentUserEmail');
                       localStorage.removeItem('isLoggedIn');
                       window.location.reload();
                     }
                    }}
                    className="flex-1 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg"
                  >Sim, excluir</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function SupportNetwork({ setSubView, contacts, setContacts, hasTherapist, setHasTherapist, isDinoTheme }: { setSubView: (v: SubView) => void, contacts: any[], setContacts: (c: any[]) => void, hasTherapist: boolean, setHasTherapist: (v: boolean) => void, isDinoTheme?: boolean }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdd = () => {
    if (newName && newPhone) {
      if (editingId !== null) {
        setContacts(contacts.map(c => c.id === editingId ? { ...c, name: newName, phone: newPhone } : c));
        setEditingId(null);
      } else {
        setContacts([...contacts, { id: Date.now(), name: newName, phone: newPhone }]);
      }
      setIsAdding(false);
      setNewName('');
      setNewPhone('');
    }
  };

  const startEdit = (c: any) => {
    setNewName(c.name);
    setNewPhone(c.phone);
    setEditingId(c.id);
    setIsAdding(true);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <SubViewLayout title="Rede de Apoio" setSubView={setSubView}>
      
      {!isAdding && (
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setNewName(''); setNewPhone(''); }} 
          className="flex items-center gap-4 w-full mb-6 hover:brightness-110 p-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all"
          style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
        >
          <div className="w-12 h-12 rounded-full border border-dashed border-gray-400 flex items-center justify-center bg-white/5">
            <span className="text-2xl text-gray-400 font-light">+</span>
          </div>
          <span className="text-gray-300 font-medium tracking-wide">Adicionar contato de emergência</span>
        </button>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="p-4 mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 backdrop-blur-md"
            style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
          >
            <input 
              type="text" placeholder="Nome do contato" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue" 
            />
            <input 
              type="tel" placeholder="Telefone" value={newPhone} onChange={e => setNewPhone(e.target.value)}
              className="w-full bg-white/5 p-3 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue" 
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-2 rounded-lg text-gray-400 bg-white/5 text-sm font-medium hover:bg-white/10">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 shadow-[0_0_10px_rgba(56,189,248,0.3)]">{editingId !== null ? 'Salvar' : 'Adicionar'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 mb-8">
        {contacts.map(c => (
          <div 
            key={c.id} 
            className="p-4 flex items-center gap-4 group rounded-2xl border border-white/10 backdrop-blur-md"
            style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
               <User className="w-6 h-6 text-gray-300" />
            </div>
            <div className="flex-1">
               <div className="text-white font-medium text-lg leading-tight">{c.name}</div>
               <div className="text-sm text-gray-400">{c.phone}</div>
            </div>
            <div className="flex flex-col gap-2">
               <button onClick={() => startEdit(c)} className="text-gray-400 hover:text-white p-1"><Edit2 className="w-4 h-4" /></button>
               <button onClick={() => removeContact(c.id)} className="text-gray-400 hover:text-danger-panic p-1"><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="p-5 flex justify-between items-center mb-8 rounded-2xl border border-white/10 backdrop-blur-md"
        style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
      >
        <span className="text-gray-200 font-medium">Faço acompanhamento com<br/>psicólogo</span>
        <ToggleSwitch active={hasTherapist} onChange={setHasTherapist} />
      </div>

      <hr className="border-white/10 mb-8" />

      <div className="flex flex-col gap-4">
        <div 
          className="p-5 flex justify-between items-center rounded-2xl border border-white/10 backdrop-blur-md"
          style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
               <span className="text-lg">🎤</span>
             </div>
             <div>
               <div className="text-gray-200 font-medium mb-1">Acesso ao Microfone</div>
               <div className="text-xs text-gray-400">Para o Sistema Guardião ·<br/>processamento local</div>
             </div>
          </div>
          <ToggleSwitch active={true} />
        </div>
      </div>

      <button onClick={() => {
        try {
          const email = localStorage.getItem('currentUserEmail');
          let data = localStorage.getItem(`onboardingData_${email}`);
          let parsed = data ? JSON.parse(data) : {};
          if (contacts.length > 0) {
            parsed.supportNetwork = { name: contacts[0].name, phone: contacts[0].phone };
            parsed.contacts = contacts;
          } else {
            parsed.supportNetwork = null;
            parsed.contacts = [];
          }
          parsed.hasTherapist = hasTherapist;
          localStorage.setItem(`onboardingData_${email}`, JSON.stringify(parsed));
        } catch(e) {}
        setSubView('none');
      }} className="bg-white text-black font-bold py-4 rounded-full w-full mt-10 active:scale-95 transition-transform">
        Salvar
      </button>
    </SubViewLayout>
  );
}

function AboutYou({ setSubView, userName, setUserName, onSaveToDiary, isDinoTheme }: { setSubView: (v: SubView) => void, userName: string, setUserName: (v: string) => void, onSaveToDiary?: () => void, isDinoTheme?: boolean }) {
  
  const musicCategories = ['Música Clássica', 'Lo-fi', 'Sons da Natureza', 'Ruído Branco', 'Solfeggio', 'ASMR'];
  const crisisLocations = [
    { id: 'transporte', label: 'Transporte (Ônibus, Metrô)' },
    { id: 'escola', label: 'Escola / Faculdade' },
    { id: 'trabalho', label: 'Trabalho' },
    { id: 'shopping', label: 'Supermercado / Shopping' },
    { id: 'casa', label: 'Casa' }
  ];

  const [selectedMusic, setSelectedMusic] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const toggleMusic = (loc: string) => {
    if (selectedMusic.includes(loc)) setSelectedMusic(selectedMusic.filter(l => l !== loc));
    else setSelectedMusic([...selectedMusic, loc]);
  };

  const toggleLocation = (locId: string) => {
    if (selectedLocations.includes(locId)) setSelectedLocations(selectedLocations.filter(l => l !== locId));
    else setSelectedLocations([...selectedLocations, locId]);
  };

  const handleSave = () => {
    try {
      const email = localStorage.getItem('currentUserEmail');
      const data = localStorage.getItem(`onboardingData_${email}`);
      if (data) {
        const parsed = JSON.parse(data);
        parsed.name = userName;
        parsed.locations = selectedLocations;
        localStorage.setItem(`onboardingData_${email}`, JSON.stringify(parsed));
      }
    } catch(e) {}

    if (onSaveToDiary) {
      onSaveToDiary();
    } else {
      setSubView('none');
    }
  };

  return (
    <SubViewLayout title="Sobre Você" setSubView={setSubView}>
      <p className="text-center text-gray-400 mb-12 -mt-4">Vamos calibrar o app para você</p>
      
      <div className="mb-8">
        <label className="block text-white mb-3 font-medium">Como você gosta de ser chamado?</label>
        <input 
          type="text" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite seu nome ou apelido" 
          className="w-full p-4 rounded-2xl border border-white/10 focus:outline-none focus:border-accent-blue text-white placeholder-gray-500 backdrop-blur-md"
          style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
        />
      </div>

      <div>
        <label className="block text-white mb-4 font-medium">Quais categorias de som você mais gosta de ouvir?</label>
        <div className="flex flex-wrap gap-3">
          {musicCategories.map((l, i) => {
            const isSelected = selectedMusic.includes(l);
            return (
               <button 
                 key={i} 
                 onClick={() => toggleMusic(l)}
                 className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border overflow-hidden active:scale-95 ${isSelected ? 'text-white border-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.4)]' : 'text-gray-300 border-white/10 hover:bg-white/10'}`}
                 style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
               >
                 {l}
               </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-white mb-4 font-medium">Onde o barulho mais te incomoda?</label>
        <div className="flex flex-wrap gap-3">
          {crisisLocations.map((loc) => {
            const isSelected = selectedLocations.includes(loc.id);
            return (
               <button 
                 key={loc.id} 
                 onClick={() => toggleLocation(loc.id)}
                 className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border overflow-hidden active:scale-95 ${isSelected ? 'text-white border-danger-panic/50 shadow-[0_0_12px_rgba(225,29,72,0.4)]' : 'text-gray-300 border-white/10 hover:bg-white/10'}`}
                 style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
               >
                 {loc.label}
               </button>
            )
          })}
        </div>
      </div>

      <button 
        onClick={handleSave} 
        className="flex items-center justify-center text-accent-blue font-bold h-14 rounded-full w-full mt-12 mb-6 shrink-0 border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-lg overflow-hidden"
        style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}
      >
        Salvar Cadastro Base
      </button>
    </SubViewLayout>
  );
}

// Layout wrapper for sub-views
function SubViewLayout({ children, title, setSubView }: { children: React.ReactNode, title: string, setSubView: (v: SubView) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 pt-12 flex flex-col h-full max-w-md mx-auto pb-24 overflow-y-auto">
      <header className="flex items-center mb-10 text-white relative">
        <button onClick={() => setSubView('none')} className="absolute left-0 p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-light tracking-wide text-center w-full">{title}</h1>
      </header>
      {children}
    </motion.div>
  );
}

function ToggleSwitch({ active, onChange }: { active: boolean, onChange?: (v: boolean) => void }) {
  const [isActive, setIsActive] = useState(active);
  return (
    <button onClick={() => {
      setIsActive(!isActive);
      onChange?.(!isActive);
    }} className={`w-14 h-8 shrink-0 rounded-full p-1 transition-colors ${isActive ? 'bg-accent-blue' : 'bg-gray-600'}`}>
      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${isActive ? 'ml-6' : 'ml-0'}`} />
    </button>
  );
}


function PermissionsView({ setSubView, isDinoTheme }: any) {
  return (
    <SubViewLayout title="Privacidade" setSubView={setSubView}>
      <p className="text-center text-gray-400 mb-8 -mt-4">Gerencie as permissões do aplicativo</p>

      <div className="flex flex-col gap-6 pb-12">
        <PermissionItem 
          icon={Mic} 
          title="Microfone" 
          description="Necessário para acionamento de voz e análise de áudio durante o Modo Pânico" 
          permissionName="microphone"
        />
        <PermissionItem 
          icon={Camera} 
          title="Câmera" 
          description="Para customização de perfil e leitura visual" 
          permissionName="camera"
        />
        <PermissionItem 
          icon={MapPin} 
          title="Localização" 
          description="Para sugestão de Refúgios Seguros na Rede de Apoio" 
          permissionName="geolocation"
        />
        <PermissionItem 
          icon={Bell} 
          title="Notificações" 
          description="Avisos sobre novos mixes e lembretes de regulação sensorial" 
          permissionName="notifications"
        />
      </div>
    </SubViewLayout>
  )
}

function PermissionItem({ icon: Icon, title, description, permissionName }: any) {
  const [granted, setGranted] = useState(false);
  
  useEffect(() => {
    const checkStatus = async () => {
      // Notificações
      if (permissionName === 'notifications' && 'Notification' in window) {
        setGranted(Notification.permission === 'granted');
      } 
      
      // Checagem segura multiplataforma (incluindo iOS/Safari)
      try {
        if (navigator.permissions) {
          const res = await navigator.permissions.query({ name: permissionName as PermissionName });
          setGranted(res.state === 'granted');
          res.onchange = () => setGranted(res.state === 'granted');
        }
      } catch (e) {
        // Fallback para Safari (iOS) que não suporta navigator.permissions para mic/cam
        if (permissionName === 'microphone' || permissionName === 'camera') {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const kind = permissionName === 'microphone' ? 'audioinput' : 'videoinput';
            const hasPermission = devices.some(d => d.kind === kind && d.label !== '');
            if (hasPermission) setGranted(true);
          } catch(err) {}
        }
      }
    };
    checkStatus();
  }, [permissionName]);

  const requestPermission = async () => {
    if (permissionName === 'notifications' && 'Notification' in window) {
       const res = await Notification.requestPermission();
       setGranted(res === 'granted');
    } else if (permissionName === 'microphone' || permissionName === 'camera') {
       try {
         const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: permissionName === 'microphone', 
            video: permissionName === 'camera' 
         });
         stream.getTracks().forEach(t => t.stop());
         setGranted(true);
       } catch (e) {
         setGranted(false);
       }
    } else if (permissionName === 'geolocation') {
       navigator.geolocation.getCurrentPosition(() => setGranted(true), () => setGranted(false));
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
      <div className="flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">{title}</h4>
          <p className="text-gray-400 text-xs leading-relaxed pr-2">{description}</p>
        </div>
      </div>
      <button 
        onClick={requestPermission}
        disabled={granted}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${granted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        {granted ? 'Permitido' : 'Solicitar'}
      </button>
    </div>
  );
}
