import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

# Replace AboutAppView
start = content.find("function AboutAppView")
if start != -1:
    content = content[:start]

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
"""

content = content + "\n" + permissionsViewCode

# Remove any existing {currentSubView === 'about-app' ...} from JSX
content = re.sub(r"\{\s*currentSubView === 'about-app'.*?\}", "", content)

with open('src/views/ProfileView.tsx', 'w') as f:
    f.write(content)

