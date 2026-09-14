const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf-8');

code = code.replace(
  'function AboutAppView({ setSubView, isDinoTheme }: any) {',
  'function AboutAppView({ setSubView, isDinoTheme, isSpaceTheme, isCarsTheme }: any) {\n  const accentColor = isSpaceTheme ? "text-[#602EC9]" : isDinoTheme ? "text-[#80F356]" : isCarsTheme ? "text-[#FACC15]" : "text-[#38bdf8]";'
);

code = code.replace(
  /className="text-\[#38bdf8\] font-medium mb-1"/g,
  'className={`${accentColor} font-medium mb-1`}'
);

code = code.replace(
  "if (currentSubView === 'about-app') return <AboutAppView setSubView={setSubView} isDinoTheme={isDinoTheme} />;",
  "if (currentSubView === 'about-app') return <AboutAppView setSubView={setSubView} isDinoTheme={isDinoTheme} isSpaceTheme={themeMode === 'child' && kidsTheme === 'space'} isCarsTheme={themeMode === 'child' && kidsTheme === 'cars'} />;"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
