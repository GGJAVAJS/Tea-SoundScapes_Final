const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// I'll make sure it's fully centered and responsive, keeping the requested code base.
// Adding a radial gradient like in the demo but darker so the text is legible over the globe.

code = code.replace(
    /\{isSpaceTheme && \([\s\S]*?<Globe[\s\S]*?\}\} \/>\s*<\/div>\s*\)\}/,
    `{isSpaceTheme && (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black pb-20">
            <Globe className="relative w-full max-w-[500px] opacity-70" config={{
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
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.4),rgba(0,0,0,0.8))]" />
          </div>
        )}`
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
