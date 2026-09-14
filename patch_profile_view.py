import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
if 'Lock' not in content:
    content = content.replace("import { User, Shield, Bell, Info, ChevronRight, ArrowLeft, Plus, Edit2, X, LogOut } from 'lucide-react';", 
                              "import { User, Shield, Bell, Info, ChevronRight, ArrowLeft, Plus, Edit2, X, LogOut, Mic, Camera, MapPin, Lock } from 'lucide-react';")

# 2. Add subview to render
if "<PermissionsView" not in content:
    content = content.replace("{currentSubView === 'about' && <AboutYou setSubView={setSubView} userName={userName} setUserName={setUserName} onSaveToDiary={onSaveToDiary} isDinoTheme={isDinoTheme} />}",
                              "{currentSubView === 'about' && <AboutYou setSubView={setSubView} userName={userName} setUserName={setUserName} onSaveToDiary={onSaveToDiary} isDinoTheme={isDinoTheme} />}\n          {currentSubView === 'permissions' && <PermissionsView setSubView={setSubView} isDinoTheme={isDinoTheme} />}")

# 3. Modify menuItems
menuItemsBlock = """  const menuItems = [
    { id: 'support', icon: Shield, title: 'Rede de Apoio', subtitle: `${contactsCount} contatos cadastrados` },
    { id: 'about', icon: User, title: 'Sobre Você', subtitle: 'Editar anamnese sensorial' },
    { id: 'none', icon: Bell, title: 'Permissões e Privacidade', subtitle: '' },
    { id: 'about-app', icon: Info, title: 'Sobre o app', subtitle: '' },
  ];"""

newMenuItemsBlock = """  const menuItems = [
    { id: 'support', icon: Shield, title: 'Rede de Apoio', subtitle: `${contactsCount} contatos cadastrados` },
    { id: 'about', icon: User, title: 'Sobre Você', subtitle: 'Editar anamnese sensorial' },
    { id: 'permissions', icon: Lock, title: 'Permissões e Privacidade', subtitle: 'Gerenciar acessos do dispositivo' },
  ];"""

content = content.replace(menuItemsBlock, newMenuItemsBlock)

# 4. Replace AboutAppView with PermissionsView
aboutAppCode = """function AboutAppView({ setSubView, isDinoTheme, isSpaceTheme, isCarsTheme }: any) {
  const accentColor = isSpaceTheme ? "text-[#602EC9]" : isDinoTheme ? "text-[#80F356]" : isCarsTheme ? "text-[#FACC15]" : "text-[#38bdf8]";
  return (
    <SubViewLayout title="Sobre o app" setSubView={setSubView}>
      <div className="flex flex-col gap-6 text-gray-300 pb-12 mt-4 text-sm leading-relaxed">
        <div>
          <h3 className="text-white font-medium text-base mb-2">O que é o TEA SoundScapes?</h3>
          <p>
            O TEA SoundScapes é um ecossistema digital criado para auxiliar na regulação sensorial, no acolhimento emocional e no desenvolvimento da autonomia de pessoas no Transtorno do Espectro Autista (TEA). Nosso objetivo é transformar o smartphone em uma ferramenta terapêutica e um refúgio acústico seguro, adaptando-se às necessidades reais de cada usuário.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-medium text-base mb-3">Nossos Principais Pilares:</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <h4 className={`${accentColor} font-medium mb-1`}>Regulação e Alívio</h4>
              <p>Um Mixer de Sons personalizado para criar ambientes auditivos confortáveis e uma ferramenta de "SOS Pânico", desenhada para intervir e acolher durante crises e sobrecargas sensoriais.</p>
            </div>
            
            <div>
              <h4 className={`${accentColor} font-medium mb-1`}>Modo Dual (Infantil e Adulto)</h4>
              <p>Acreditamos que a autonomia se desenvolve de forma gradual. O Modo Infantil oferece uma experiência altamente interativa (com temas lúdicos) e bloqueada para edições acidentais, enquanto o Modo Adulto é minimalista e empodera o usuário na tomada de decisões.</p>
            </div>
            
            <div>
              <h4 className={`${accentColor} font-medium mb-1`}>Rede de Apoio e Refúgio</h4>
              <p>Botões de discagem rápida para contatos de confiança e mapeamento rápido de locais seguros nas proximidades para ajudar no reencontro e no re-equilíbrio durante momentos de vulnerabilidade.</p>
            </div>
          </div>
        </div>
      </div>
    </SubViewLayout>
  );
}"""

permissionsViewCode = """function PermissionsView({ setSubView, isDinoTheme }: any) {
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
          description="Para customização de perfil e compartilhamento com Rede de Apoio" 
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
    if (permissionName === 'notifications' && 'Notification' in window) {
      setGranted(Notification.permission === 'granted');
    } else if (navigator.permissions && (permissionName === 'microphone' || permissionName === 'camera' || permissionName === 'geolocation')) {
       navigator.permissions.query({ name: permissionName as PermissionName }).then(res => {
         setGranted(res.state === 'granted');
         res.onchange = () => {
           setGranted(res.state === 'granted');
         };
       }).catch(() => {});
    }
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
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
      <div className="flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">{title}</h4>
          <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
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
}"""

content = content.replace(aboutAppCode, permissionsViewCode)

with open('src/views/ProfileView.tsx', 'w') as f:
    f.write(content)

print("Patched!")
