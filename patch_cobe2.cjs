const fs = require('fs');
let code = fs.readFileSync('src/components/ui/globe.tsx', 'utf8');

code = code.replace(
  `const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
    })`,
  `const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
    } as any)`
);

fs.writeFileSync('src/components/ui/globe.tsx', code);
