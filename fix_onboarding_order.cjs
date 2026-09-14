const fs = require('fs');
let code = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');

// Add states for pin
code = code.replace(
  "const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);",
  `const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');`
);

// update totalSteps
code = code.replace(
  "const totalSteps = themeMode === 'child' ? 10 : 8;",
  "const totalSteps = themeMode === 'child' ? 11 : 8;"
);

// update handleFinish to include pin
code = code.replace(
  "childAutonomyFilter: themeMode === 'child' ? childAutonomyFilter : undefined",
  "childAutonomyFilter: themeMode === 'child' ? childAutonomyFilter : undefined,\n      parentalPin: themeMode === 'child' ? pin : undefined"
);

// Rename step 7 to step 7 (adult) or 9 (child) for refuge sound
code = code.replace(
  /{step === 7 && \(/,
  "{(step === 7 && themeMode === 'adult' || step === 9 && themeMode === 'child') && ("
);

// Rename step 8 to step 7 for kids theme
code = code.replace(
  /{step === 8 && themeMode === 'child' && \(/,
  "{step === 7 && themeMode === 'child' && ("
);

// Rename step 9 to step 8 for autonomy filter, and add a Next button
code = code.replace(
  /<\/div>\s*<\/motion\.div>\s*\)\}\s*\{step === totalSteps/,
  `</div>
              <button 
                onClick={nextStep}
                className="bg-accent-blue text-white font-bold py-4 rounded-full w-full mt-4 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all text-lg"
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
                  onChange={(e) => { setPin(e.target.value.replace(/\\D/g, '')); setPinError(''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl tracking-[1em] focus:outline-none focus:border-accent-blue transition-colors text-white"
                />
                <input 
                  type="password" 
                  maxLength={4}
                  placeholder="Confirme o PIN"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value.replace(/\\D/g, '')); setPinError(''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl tracking-[1em] focus:outline-none focus:border-accent-blue transition-colors text-white"
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
                className="bg-accent-blue text-white font-bold py-4 rounded-full w-full mt-4 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all text-lg"
              >
                Salvar Senha
              </button>
            </motion.div>
          )}
          {step === totalSteps`
);

fs.writeFileSync('src/views/OnboardingView.tsx', code);
