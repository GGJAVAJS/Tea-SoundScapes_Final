import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const regex = /const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';\s+const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';\s+const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';\s+const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;/;

if (code.match(regex)) {
  code = code.replace(regex, '');
  
  const insertRegex = /export function PanicOverlay\(\{ isOpen, onClose, themeMode, kidsTheme, isSmsSent = false \}: PanicOverlayProps\) \{/;
  const replacement = `export function PanicOverlay({ isOpen, onClose, themeMode, kidsTheme, isSmsSent = false }: PanicOverlayProps) {
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';
  const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;
`;
  
  code = code.replace(insertRegex, replacement);
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not matched");
}

