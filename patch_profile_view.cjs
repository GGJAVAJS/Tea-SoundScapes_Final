const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf-8');

// Update menu items
code = code.replace(
  "{ id: 'none', icon: Info, title: 'Sobre o app', subtitle: '' },",
  "{ id: 'about-app', icon: Info, title: 'Sobre o app', subtitle: '' },"
);

// Add margin-top to "Salvar Cadastro Base"
code = code.replace(
  /className="flex items-center justify-center text-accent-blue font-bold h-14 rounded-full w-full mt-auto mb-6 shrink-0 border border-white\/10 hover:bg-white\/10 transition-all active:scale-95 shadow-lg overflow-hidden"/g,
  'className="flex items-center justify-center text-accent-blue font-bold h-14 rounded-full w-full mt-12 mb-6 shrink-0 border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-lg overflow-hidden"'
);

// Add the About App subview
const aboutAppCode = `
function AboutAppView({ setSubView, isDinoTheme }: any) {
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
              <h4 className="text-[#38bdf8] font-medium mb-1">Regulação e Alívio</h4>
              <p>Um Mixer de Sons personalizado para criar ambientes auditivos confortáveis e uma ferramenta de "SOS Pânico", desenhada para intervir e acolher durante crises e sobrecargas sensoriais.</p>
            </div>
            
            <div>
              <h4 className="text-[#38bdf8] font-medium mb-1">Modo Dual (Infantil e Adulto)</h4>
              <p>O aplicativo respeita a fase de vida do usuário. O Modo Infantil oferece uma interface lúdica, temas interativos e avaliação de emoções acessível. O Modo Adulto entrega uma experiência direta, madura e focada na autogestão.</p>
            </div>
            
            <div>
              <h4 className="text-[#38bdf8] font-medium mb-1">Inteligência Artificial e Autoconhecimento</h4>
              <p>O Diário Terapêutico não apenas registra, mas analisa. Utilizando IA, o aplicativo cruza dados para identificar padrões, gatilhos recorrentes e horários de risco, gerando insights empáticos que incentivam o autocuidado.</p>
            </div>
            
            <div>
              <h4 className="text-[#38bdf8] font-medium mb-1">Ponte com a Terapia</h4>
              <p>Transformamos dados em ações. O aplicativo gera relatórios clínicos completos e estruturados, facilitando a comunicação com psicólogos e terapeutas, permitindo um acompanhamento baseado em evidências concretas sobre o progresso do usuário.</p>
            </div>
          </div>
        </div>
      </div>
    </SubViewLayout>
  );
}
`;

code = code.replace(
  "if (currentSubView === 'about') return <AboutView setSubView={setSubView} isDinoTheme={isDinoTheme} />;",
  "if (currentSubView === 'about') return <AboutView setSubView={setSubView} isDinoTheme={isDinoTheme} />;\n  if (currentSubView === 'about-app') return <AboutAppView setSubView={setSubView} isDinoTheme={isDinoTheme} />;"
);

// Append the component at the end of the file
code = code + aboutAppCode;

fs.writeFileSync('src/views/ProfileView.tsx', code);
