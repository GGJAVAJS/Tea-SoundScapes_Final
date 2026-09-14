const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// Replace the EnergyBeam import with Globe import
code = code.replace(
    "import EnergyBeam from '../components/ui/energy-beam';",
    "import { Globe } from '../components/ui/globe';"
);

// Replace EnergyBeam component with Globe
code = code.replace(
    "{isSpaceTheme && <EnergyBeam className=\"absolute inset-0 z-0\" />}",
    `{isSpaceTheme && (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black">
            <Globe className="top-1/2 -translate-y-1/2 scale-150 opacity-50" config={{
              width: 800,
              height: 800,
              onRender: () => {},
              devicePixelRatio: 2,
              phi: 0,
              theta: 0.3,
              dark: 1,
              diffuse: 1.2,
              mapSamples: 16000,
              mapBrightness: 6,
              baseColor: [0.1, 0.1, 0.2],
              markerColor: [0.37, 0.18, 0.78],
              glowColor: [0.1, 0.1, 0.3],
              markers: [
                { location: [14.5995, 120.9842], size: 0.03 },
                { location: [19.076, 72.8777], size: 0.1 },
                { location: [40.7128, -74.006], size: 0.1 }
              ],
            }} />
          </div>
        )}`
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
