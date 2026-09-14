const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/GuardianView.tsx', 'utf8');

if (!code.includes('PerspectiveCamera')) {
  code = code.replace(/import \{ useGLTF/, 'import { PerspectiveCamera, useGLTF');
}

const dinoBgRegex = /function DinoGuardianBackground[\s\S]*?return \(\s*<>/;
code = code.replace(dinoBgRegex, `function DinoGuardianBackground({ dbLevel }: { dbLevel: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[-2, -4.5, -6]} rotation={[0.2, -0.3, 0]} fov={70} />`);

code = code.replace(/<OrbitControls \s*enableZoom=\{true\} \s*enablePan=\{true\} \s*autoRotate=\{false\}\s*\/>/g, 
  '{!isDinoTheme && <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />}');

fs.writeFileSync('/app/applet/src/views/GuardianView.tsx', code);
