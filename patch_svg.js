import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const regex = /\{\/\* Camada 2D - UI de Efeitos Orgânicos \(HTML\/CSS\) \*\/\}/;

const svgLayer = `{/* Camada 2D - Efeito de Chuva Nativo (SVG Generativo do Usuário) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center mix-blend-screen"
        style={{ 
          opacity: phase === 'Expire...' ? 0 : 0.4, 
          filter: phase === 'Expire...' ? 'blur(8px)' : 'blur(0px)', 
          transition: "opacity 2s ease, filter 2s ease" 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
           <defs>
              <linearGradient id="rainGrad2" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="50%" stopColor="#8b5cf6" />
                 <stop offset="100%" stopColor="transparent" />
              </linearGradient>
           </defs>
           <g>
              {[...Array(60)].map((_, i) => {
                const startX = Math.random() * 1080;
                const duration = 0.5 + Math.random() * 1.5;
                const delay = Math.random() * -5;
                const height = 40 + Math.random() * 80;
                
                return (
                  <motion.rect
                    key={\`rain-\${i}\`}
                    x={startX}
                    y={-height}
                    width="2"
                    height={height}
                    fill="url(#rainGrad2)"
                    animate={{
                      y: [ -height, 1080 + height ]
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "linear",
                      delay
                    }}
                  />
                );
              })}
           </g>
        </svg>
      </div>

      {/* Camada 2D - UI de Efeitos Orgânicos (HTML/CSS) */}`;

if (code.match(regex)) {
  code = code.replace(regex, svgLayer);
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not matched");
}
