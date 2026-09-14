import fs from 'fs';

let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf-8');

// 1. Add isCarsTheme to DiaryView
code = code.replace(
  "const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';",
  "const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';\n  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';"
);

// 2. Add isCarsTheme to RegistroView and AnalisesView tags
code = code.replace(
  /<RegistroView onSave=\{handleSaveForm\} isDinoTheme=\{isDinoTheme\} isSpaceTheme=\{isSpaceTheme\} \/>/g,
  "<RegistroView onSave={handleSaveForm} isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme} />"
);

code = code.replace(
  /<AnalisesView isDinoTheme=\{isDinoTheme\} isSpaceTheme=\{isSpaceTheme\}/g,
  "<AnalisesView isDinoTheme={isDinoTheme} isSpaceTheme={isSpaceTheme} isCarsTheme={isCarsTheme}"
);

// 3. Update component signatures
code = code.replace(
  "function RegistroView({ onSave, isDinoTheme, isSpaceTheme }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean }) {",
  "function RegistroView({ onSave, isDinoTheme, isSpaceTheme, isCarsTheme }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {"
);

code = code.replace(
  "function AnalisesView({ isDinoTheme, isSpaceTheme,",
  "function AnalisesView({ isDinoTheme, isSpaceTheme, isCarsTheme,"
);

code = code.replace(
  "records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean }) {",
  "records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {"
);

// 4. Update the ternary expressions
function replacer(match, spaceGrp, dinoGrp, defaultGrp) {
  // Determine carsGrp based on spaceGrp and defaultGrp
  let carsGrp = "";
  
  if (spaceGrp.includes("bg-[#FFE838]/25 text-white")) {
    carsGrp = "'bg-[#A80505] text-white border border-[#A80505] shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (spaceGrp.includes("bg-[#FFE838]/25 text-[#FFE838]")) {
    carsGrp = "'bg-[#A80505] text-white border border-[#A80505] shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (spaceGrp.includes("hover:text-[#FFE838] hover:bg-[#FFE838]/10")) {
    carsGrp = "'text-gray-400 hover:text-[#A80505] hover:bg-[#A80505]/20'";
  } else if (spaceGrp.includes("bg-[#FFE838]/40")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (spaceGrp.includes("border-[#FFE838]/79 shadow-[0_0_15px_rgba(255,232,56,0.79)]")) {
    carsGrp = "'border-[#A80505] shadow-[0_0_15px_rgba(168,5,5,0.79)]'";
  } else if (spaceGrp.includes("bg-[#FFE838]/20 border border-[#FFE838]/79 text-[#FFE838]")) {
    carsGrp = "'bg-[#A80505] border border-[#A80505] text-white shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (spaceGrp.includes("hover:border-[#FFE838]/79 hover:text-[#FFE838] hover:bg-[#FFE838]/10")) {
    carsGrp = "'bg-white/5 text-gray-300 border border-white/10 hover:border-[#A80505] hover:text-[#A80505] hover:bg-[#A80505]/20'";
  } else if (spaceGrp.includes("text-[#FFE838]") && match.includes("Check")) {
    carsGrp = "'text-white'";
  } else if (spaceGrp.includes("text-[#FFE838]") || spaceGrp.includes("text-[#FFE838]")) {
    carsGrp = "'text-[#A80505]'";
  } else if (spaceGrp.includes("bg-[#FFE838]/20 hover:bg-[#FFE838]/30")) {
    carsGrp = "'bg-[#A80505] hover:bg-[#8b0404] border border-[#A80505] shadow-[0_0_18px_rgba(168,5,5,0.4)]'";
  } else if (spaceGrp.includes("focus:border-[#FFE838]/79")) {
    carsGrp = "'focus:border-[#A80505] focus:ring-1 focus:ring-[#A80505] hover:border-[#A80505]/50'";
  } else if (spaceGrp.includes("bg-[#FFE838]/10")) {
    carsGrp = "'bg-[#A80505]/20'";
  } else if (spaceGrp.includes("bg-[#FFE838]")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (spaceGrp.includes("bg-[#FFE838]/50")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (spaceGrp.includes("bg-[#FFE838]/20 text-[#FFE838] ring-[#FFE838]/50")) {
    carsGrp = "'bg-[#A80505] text-white ring-[#A80505]/50'";
  } else if (spaceGrp.includes("hover:bg-[#FFE838]/30")) {
    carsGrp = "'hover:bg-[#A80505]'";
  } else {
    // generic fallback
    carsGrp = "'text-[#A80505]'";
  }

  return `isCarsTheme ? ${carsGrp} : ${spaceGrp} ? ${spaceGrp} : isDinoTheme ? ${dinoGrp} : ${defaultGrp}`;
}

// Regular expression to find and replace the ternary chains
// It handles: isSpaceTheme ? A : isDinoTheme ? B : C
const regex = /isSpaceTheme \? ('[^']*') : isDinoTheme \? ('[^']*') : ('[^']*')/g;

code = code.replace(regex, (match, p1, p2, p3) => {
  let carsGrp = "";
  if (p1.includes("bg-[#FFE838]/25 text-white")) {
    carsGrp = "'bg-[#A80505] text-white border border-[#A80505] shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (p1.includes("bg-[#FFE838]/25 text-[#FFE838]")) {
    carsGrp = "'bg-[#A80505] text-white border border-[#A80505] shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (p1.includes("hover:text-[#FFE838] hover:bg-[#FFE838]/10")) {
    carsGrp = "'text-gray-400 hover:text-white hover:bg-[#A80505]'";
  } else if (p1.includes("bg-[#FFE838]/40")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (p1.includes("border-[#FFE838]/79 shadow-[0_0_15px_rgba(255,232,56,0.79)]")) {
    carsGrp = "'border-[#A80505] shadow-[0_0_15px_rgba(168,5,5,0.79)]'";
  } else if (p1.includes("bg-[#FFE838]/20 border border-[#FFE838]/79 text-[#FFE838]")) {
    carsGrp = "'bg-[#A80505] border border-[#A80505] text-white shadow-[0_0_12px_rgba(168,5,5,0.5)]'";
  } else if (p1.includes("hover:border-[#FFE838]/79 hover:text-[#FFE838] hover:bg-[#FFE838]/10")) {
    carsGrp = "'bg-white/5 text-gray-300 border border-white/10 hover:border-[#A80505] hover:text-white hover:bg-[#A80505]'";
  } else if (p1.includes("text-[#FFE838]") && match.includes("Check")) {
    carsGrp = "'text-white'";
  } else if (p1.includes("text-[#FFE838]")) {
    carsGrp = "'text-[#A80505]'";
  } else if (p1.includes("bg-[#FFE838]/20 hover:bg-[#FFE838]/30")) {
    carsGrp = "'bg-[#A80505] hover:bg-[#8b0404] border border-[#A80505] shadow-[0_0_18px_rgba(168,5,5,0.4)]'";
  } else if (p1.includes("focus:border-[#FFE838]/79")) {
    carsGrp = "'focus:border-[#A80505] focus:ring-1 focus:ring-[#A80505] hover:border-[#A80505]/50'";
  } else if (p1.includes("bg-[#FFE838]/10")) {
    carsGrp = "'bg-[#A80505]/20'";
  } else if (p1.includes("bg-[#FFE838]")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (p1.includes("bg-[#FFE838]/50")) {
    carsGrp = "'bg-[#A80505]'";
  } else if (p1.includes("bg-[#FFE838]/20 text-[#FFE838] ring-[#FFE838]/50")) {
    carsGrp = "'bg-[#A80505] text-white ring-[#A80505]/50'";
  } else if (p1.includes("hover:bg-[#FFE838]/30")) {
    carsGrp = "'hover:bg-[#A80505]'";
  } else {
    carsGrp = "'text-[#A80505]'";
  }

  return `isCarsTheme ? ${carsGrp} : isSpaceTheme ? ${p1} : isDinoTheme ? ${p2} : ${p3}`;
});

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log("Replaced successfully!");
