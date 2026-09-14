const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf-8');

const regex = /<div className="flex gap-2">\s*\{themeMode !== 'child' && \([^<]*<button\s*onClick=\{\(\) => setIsPublishOverlayOpen\(true\)\}[\s\S]*?<\/button>\)\}\s*<\/div>/;

const newHeader = `<div className="flex gap-2">
          {themeMode !== 'child' && (
            <button 
              onClick={() => setIsPublishOverlayOpen(true)} 
              className="px-4 py-2 bg-accent-blue text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 transition-all"
            >
              Publicar
            </button>
          )}
          <button 
            onClick={() => setIsMixerOpen(true)} 
            aria-label="Abrir Mixer"
            className="w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 transition-all text-gray-300 hover:text-white shadow-lg hover:shadow-accent-blue/10"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>`;

code = code.replace(regex, newHeader);
fs.writeFileSync('src/views/HomeView.tsx', code);
