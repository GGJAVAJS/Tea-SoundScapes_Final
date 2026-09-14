const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

// Add props to DiaryViewProps
const targetProps = "kidsTheme?: 'dino' | 'space' | 'cars' | null;\n}";
const replProps = "kidsTheme?: 'dino' | 'space' | 'cars' | null;\n  isChildAutonomyMode?: boolean;\n  onAutonomyComplete?: () => void;\n}";
code = code.replace(targetProps, replProps);

// Add props to the function signature
const targetFunc = "export function DiaryView({ startView = 'registro', themeMode, kidsTheme }: DiaryViewProps) {";
const replFunc = "export function DiaryView({ startView = 'registro', themeMode, kidsTheme, isChildAutonomyMode, onAutonomyComplete }: DiaryViewProps) {";
code = code.replace(targetFunc, replFunc);

// Adjust handleSaveForm to use onAutonomyComplete if provided
const targetSave = "setActiveTab('analises');\n  };";
const replSave = `if (isChildAutonomyMode && onAutonomyComplete) {
      onAutonomyComplete();
    } else {
      setActiveTab('analises');
    }
  };`;
code = code.replace(targetSave, replSave);

// Remove 'Análises' tab entirely if it's child autonomy mode, or themeMode === 'child'
const targetTabs = `<div className="flex bg-white/5 rounded-full p-1 mb-8 shrink-0">`;
const replTabs = `{isChildAutonomyMode ? null : (
      <div className="flex bg-white/5 rounded-full p-1 mb-8 shrink-0">`;
code = code.replace(targetTabs, replTabs);

const targetTabsEnd = `      </div>

      <AnimatePresence mode="wait">`;
const replTabsEnd = `      </div>
      )}

      <AnimatePresence mode="wait">`;
code = code.replace(targetTabsEnd, replTabsEnd);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('patched diary props and tabs');
