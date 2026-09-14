const fs = require('fs');
let code = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');

// 1. Add state
const targetState = "  const [kidsTheme, setKidsTheme] = useState<'dino' | 'space' | 'cars'>('dino');";
const replState = "  const [kidsTheme, setKidsTheme] = useState<'dino' | 'space' | 'cars'>('dino');\n  const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);";
code = code.replace(targetState, replState);

// 2. Change totalSteps
const targetTotalSteps = "const totalSteps = themeMode === 'child' ? 9 : 8;";
const replTotalSteps = "const totalSteps = themeMode === 'child' ? 10 : 8;";
code = code.replace(targetTotalSteps, replTotalSteps);

// 3. Update handleFinish
const targetFinish = "kidsTheme: themeMode === 'child' ? kidsTheme : undefined";
const replFinish = "kidsTheme: themeMode === 'child' ? kidsTheme : undefined,\n      childAutonomyFilter: themeMode === 'child' ? childAutonomyFilter : undefined";
code = code.replace(targetFinish, replFinish);

// 4. Add Step 9 rendering
const targetStepEnd = `          {step === totalSteps && (`;
const replStepEnd = `          {step === 9 && themeMode === 'child' && (
            <motion.div key="stepAutonomy" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col text-center items-center justify-center h-full gap-6">
              <h1 className="text-3xl font-bold text-accent-blue leading-tight">Filtro de Autonomia</h1>
              <p className="text-gray-300 text-lg">A criança fará o registro de suas próprias emoções após o uso do Som Refúgio ou SOS Pânico?</p>
              
              <div className="flex flex-col gap-4 w-full mt-4">
                <button onClick={() => setChildAutonomyFilter(true)} className={\`p-6 rounded-2xl border transition-all text-left flex flex-col gap-1 \${childAutonomyFilter ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'}\`}>
                  <span className={\`font-bold \${childAutonomyFilter ? 'text-accent-blue' : 'text-white'}\`}>Ligado (Sim)</span>
                  <span className="text-sm text-gray-400">Após a crise, a criança vê o termômetro lúdico dos temas para apontar como se sente.</span>
                </button>
                <button onClick={() => setChildAutonomyFilter(false)} className={\`p-6 rounded-2xl border transition-all text-left flex flex-col gap-1 \${!childAutonomyFilter ? 'bg-accent-blue/20 border-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'}\`}>
                  <span className={\`font-bold \${!childAutonomyFilter ? 'text-accent-blue' : 'text-white'}\`}>Desligado (Não)</span>
                  <span className="text-sm text-gray-400">O app pula essa etapa. O registro aguarda silenciosamente no painel dos pais.</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === totalSteps && (`;
code = code.replace(targetStepEnd, replStepEnd);

fs.writeFileSync('src/views/OnboardingView.tsx', code);
console.log('patched onboarding');
