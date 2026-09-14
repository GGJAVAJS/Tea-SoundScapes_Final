const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// For "Meu Refúgio" button
code = code.replace(
/isRefugeActive\s*\n\s*\?\s*\(isDinoTheme\s*\n\s*\?\s*'bg-\[#553100\] text-\[#FFE838\][^\n]*'\s*\n\s*:\s*'bg-accent-blue text-\[#FFE838\][^\n]*'\)\s*\n\s*:\s*\(isDinoTheme\s*\n\s*\?\s*'bg-\[#553100\] text-\[#FFE838\][^\n]*'\s*\n\s*:\s*'bg-white\/5 hover:bg-white\/15 text-\[#FFE838\][^\n]*'\)/,
`isRefugeActive 
              ? (isDinoTheme 
                  ? 'bg-[#553100] text-[#80F356] shadow-[0_0_20px_rgba(85,49,0,0.6)] border-white/30 hover:brightness-110' 
                  : isSpaceTheme 
                  ? 'bg-[#602EC9] text-white shadow-[0_0_20px_rgba(96,46,201,0.4)] border-transparent hover:brightness-110 hover:shadow-[0_0_25px_rgba(96,46,201,0.6)]'
                  : 'bg-accent-blue text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] border-transparent hover:brightness-110 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]')
              : (isDinoTheme 
                  ? 'bg-[#553100] text-[#80F356] border-white/10 hover:brightness-125 hover:border-[#80F356]/40 hover:shadow-[0_0_15px_rgba(128,243,86,0.2)]'
                  : isSpaceTheme
                  ? 'bg-white/5 hover:bg-white/15 text-[#602EC9] border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(96,46,201,0.25)]'
                  : 'bg-white/5 hover:bg-white/15 text-accent-blue border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]')`
);

fs.writeFileSync('src/views/HomeView.tsx', code);
