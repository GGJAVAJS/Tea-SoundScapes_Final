import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

// Add onPanic to GuardianViewProps
code = code.replace(
  "kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;",
  "kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;\n  onPanic?: () => void;"
);

// Add onPanic to destructuring
code = code.replace(
  "  themeMode, kidsTheme \n}: GuardianViewProps) {",
  "  themeMode, kidsTheme, onPanic\n}: GuardianViewProps) {"
);

// Add useEffect for triggering panic at 70dB
const panicEffect = `
  useEffect(() => {
    if (isCarsTheme && dbLevel >= 70 && onPanic) {
      onPanic();
    }
  }, [dbLevel, isCarsTheme, onPanic]);
`;

const isCarsThemeIndex = code.indexOf("const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;");
code = code.slice(0, isCarsThemeIndex + 64) + panicEffect + code.slice(isCarsThemeIndex + 64);

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
