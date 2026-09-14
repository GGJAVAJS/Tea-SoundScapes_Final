const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');

// Add import
code = "import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';\n" + code;

// Replace the Space Theme background in PanicOverlay
code = code.replace(
    /\{isSpaceTheme && \([\s\S]*?<div className="absolute inset-0 z-0 pointer-events-auto">[\s\S]*?<ErrorBoundary>[\s\S]*?<Canvas[\s\S]*?<\/Canvas>[\s\S]*?<\/ErrorBoundary>[\s\S]*?<\/div>[\s\S]*?\)\}/,
    `{isSpaceTheme && (
            <div className="absolute inset-0 z-0 pointer-events-auto">
              <GenerativeArtSceneV3 />
              <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),rgba(0,0,0,0.7))]" />
            </div>
          )}`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
