const fs = require('fs');
let code = fs.readFileSync('src/components/ui/globe.tsx', 'utf8');

code = code.replace(
  `const GLOBE_CONFIG: COBEOptions = {`,
  `const GLOBE_CONFIG: Omit<COBEOptions, "onRender"> & { onRender?: (state: Record<string, any>) => void } = {`
);

code = code.replace(
  `config?: COBEOptions`,
  `config?: Omit<COBEOptions, "onRender"> & { onRender?: (state: Record<string, any>) => void }`
);

fs.writeFileSync('src/components/ui/globe.tsx', code);
