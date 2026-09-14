const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// We need to import EnergyBeam at the top
code = "import EnergyBeam from '../components/ui/energy-beam';\n" + code;

// Now, replace the Canvas logic
// Before: {!isCarsTheme && ( ... <Canvas ...> ... </Canvas> )}
// After: 
// {isSpaceTheme && <EnergyBeam className="absolute inset-0 z-0" />}
// {!isCarsTheme && !isSpaceTheme && ( ... <Canvas ...> ... </Canvas> )}

code = code.replace(/\{!isCarsTheme && \(/, "{isSpaceTheme && <EnergyBeam className=\"absolute inset-0 z-0\" />}\n        {!isCarsTheme && !isSpaceTheme && (");

fs.writeFileSync('src/views/GuardianView.tsx', code);
