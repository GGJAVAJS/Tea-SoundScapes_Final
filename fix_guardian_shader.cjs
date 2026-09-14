const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// replace Globe import with ShaderDemo_ATC
code = code.replace(
    "import { Globe } from '../components/ui/globe';",
    "import ShaderDemo_ATC from '../components/ui/atc-shader';"
);

// replace Globe component implementation with ShaderDemo_ATC
code = code.replace(
    /\{isSpaceTheme && \([\s\S]*?<Globe[\s\S]*?\}\} \/>[\s\S]*?<\/div>\s*\)\}/,
    `{isSpaceTheme && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <ShaderDemo_ATC />
            {/* Adding the deep space radial gradient for UI legibility over the shader */}
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_150%,rgba(0,0,0,0.1),rgba(0,0,0,0.9))]" />
          </div>
        )}`
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
