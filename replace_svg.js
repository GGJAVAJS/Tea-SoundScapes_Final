import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const regex = /\{\/\* Camada 2D - Gotas Glassmorphism \*\/\}[\s\S]*?\{\/\* Camada 2D - Pulsos Cardíacos Desfocados \*\/\}/;

const newRain = `{/* Camada 2D - SVG de Chuva Nativo (Substituído) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center mix-blend-screen"
        style={{ 
          opacity: dropOpacity,
          filter: dropOpacity === 0 ? 'blur(8px)' : 'blur(0px)', 
          transition: "opacity 2s ease, filter 2s ease" 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet" className="w-full h-full opacity-60">
           <defs>
              <linearGradient id="rainGradMinimalist" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="50%" stopColor="#ffffff" />
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
                    fill="url(#rainGradMinimalist)"
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

      {/* Camada 2D - Pulsos Cardíacos Desfocados */}`;

if (code.match(regex)) {
  code = code.replace(regex, newRain);
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not matched");
}
