const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// The globe might be too big or misaligned due to absolute inset-0
// We want it to be perfectly centered on mobile.
// Also we'll update the config slightly for a better visual representation on mobile.

code = code.replace(
    /\{isSpaceTheme && \([\s\S]*?<Globe[\s\S]*?\}\} \/>[\s\S]*?<\/div>\s*\)\}/,
    `{isSpaceTheme && (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black">
            <Globe className="relative top-10 w-[120%] max-w-[800px] opacity-60" config={{
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
