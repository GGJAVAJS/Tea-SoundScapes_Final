const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = "  const [isRefugeOpen, setIsRefugeOpen] = useState(false);";
const replState = "  const [isRefugeOpen, setIsRefugeOpen] = useState(false);\n  const [isPostCrisisDiaryOpen, setIsPostCrisisDiaryOpen] = useState(false);\n  const [childAutonomyFilter, setChildAutonomyFilter] = useState(true);";
code = code.replace(targetState, replState);

// Fetching childAutonomyFilter on mount
const targetLoad = "const initialKidsTheme = data.kidsTheme || 'dino';";
const replLoad = "const initialKidsTheme = data.kidsTheme || 'dino';\n          setChildAutonomyFilter(data.childAutonomyFilter !== false);";
code = code.replace(targetLoad, replLoad);

// Also need to set childAutonomyFilter upon onboarding complete
const targetOnboardFinish = "setActiveRefugeSound(data.refugeSound || null);";
const replOnboardFinish = "setActiveRefugeSound(data.refugeSound || null);\n      setChildAutonomyFilter(data.childAutonomyFilter !== false);";
code = code.replace(targetOnboardFinish, replOnboardFinish);

// Refuge overlay onClose
const targetRefugeClose = "onClose={() => setIsRefugeOpen(false)}";
const replRefugeClose = `onClose={() => {
            setIsRefugeOpen(false);
            if (themeMode === 'child' && childAutonomyFilter) {
              setIsPostCrisisDiaryOpen(true);
            }
          }}`;
code = code.replace(targetRefugeClose, replRefugeClose);

// Panic overlay onClose
const targetPanicClose = "onClose={() => setIsPanicOpen(false)}";
const replPanicClose = `onClose={() => {
            setIsPanicOpen(false);
            if (themeMode === 'child' && childAutonomyFilter) {
              setIsPostCrisisDiaryOpen(true);
            }
          }}`;
code = code.replace(targetPanicClose, replPanicClose);

// Post crisis overlay rendering
const targetRenderPanic = "<PanicOverlay";
const replRenderPanic = `{isPostCrisisDiaryOpen && (
          <div className="fixed inset-0 z-[100] bg-[#060b13] overflow-y-auto">
             <div className="max-w-md mx-auto p-6 pt-12 relative min-h-screen">
                <button 
                  onClick={() => setIsPostCrisisDiaryOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white"
                >
                  ✕
                </button>
                <h1 className="text-3xl font-bold text-white mb-8">Muito bem!</h1>
                <DiaryView 
                  startView="registro" 
                  themeMode={themeMode} 
                  kidsTheme={kidsTheme} 
                  isChildAutonomyMode={true} 
                  onAutonomyComplete={() => setIsPostCrisisDiaryOpen(false)} 
                />
             </div>
          </div>
        )}
        <PanicOverlay`;
code = code.replace(targetRenderPanic, replRenderPanic);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app crisis logic');
