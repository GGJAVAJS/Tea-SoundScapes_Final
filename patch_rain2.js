import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

code = code.replace('{isCarsTheme && <CarsPanicBackground />}', '{isCarsTheme && <CarsPanicBackground phase={phase} />}');

const startIdx = code.indexOf('const CarsPanicBackground = () => {');
const endIdx = code.indexOf('export function PanicOverlay(');

if (startIdx !== -1 && endIdx !== -1) {
  const newComp = `const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {
  const isInspire = phase === 'Inspire...';
  const isExpire = phase === 'Expire...';

  // Audio Hooks (ready for Howler.js)
  useEffect(() => {
    /*
    // TODO: Instanciar faixas com Howler.js
    const rainSound = new Howl({ src: ['rain.mp3'], loop: true, volume: 0.4 });
    const pianoSound = new Howl({ src: ['piano.mp3'], loop: true, volume: 0.3 });
    const heartSound = new Howl({ src: ['heartbeat.mp3'] });
    
    rainSound.play();
    pianoSound.play();
    
    // Lógica para simular redução de BPM da batida do coração
    let currentBPM = 120; // Começa mais rápido (ansiedade)
    const targetBPM = 60; // Termina calmo (relaxamento)
    let timeoutId;
    
    const playHeartbeat = () => {
      heartSound.play();
      if (currentBPM > targetBPM) {
        currentBPM -= 1; // Reduz o BPM gradualmente
      }
      const intervalMs = (60 / currentBPM) * 1000;
      timeoutId = setTimeout(playHeartbeat, intervalMs);
    };
    playHeartbeat();

    return () => {
      rainSound.unload();
      pianoSound.unload();
      heartSound.unload();
      clearTimeout(timeoutId);
    };
    */
  }, []);

  const waveSpacing = isExpire ? 100 : 40; // Mais próximas no Inspire (40px), afastadas no Expire (100px)
  const waveScaleY = isExpire ? 0.1 : 1; // Quase retas no Expire (0.1), onduladas no Inspire (1)
  
  // Rain particles blurring and fading
  const rainOpacity = isExpire ? 0.1 : 0.6;
  const rainBlur = isExpire ? "blur(3px)" : "blur(0px)";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#02040a] to-[#1e293b] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Fundo de Partículas (Chuva Generativa) */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomDuration = 1 + Math.random() * 2;
          const randomDelay = Math.random() * -2; // Start randomly scattered
          return (
            <motion.div
              key={i}
              initial={{ y: '-10vh' }}
              animate={{ 
                y: '110vh', 
                opacity: rainOpacity,
                filter: rainBlur
              }}
              transition={{
                y: { 
                  duration: randomDuration, 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: randomDelay
                },
                opacity: { duration: 1.5 },
                filter: { duration: 1.5 }
              }}
              className="absolute top-0 w-[2px] h-[10px] bg-white rounded-full"
              style={{ left: \`\${randomX}%\` }}
            />
          );
        })}
      </div>

      {/* Batida do Coração (Pulso no Centro) */}
      <div className="absolute inset-0 flex items-center justify-center">
         <motion.div
           animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
           transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
           className="w-48 h-48 bg-white/10 rounded-full"
         />
      </div>

      {/* Linhas de Bézier Ondulantes */}
      <div className="absolute inset-x-0 h-[40vh] flex flex-col items-center justify-center">
        {[-1, 0, 1].map((offset) => (
          <motion.div
            key={offset}
            className="absolute w-[200%] h-[150px] left-0 origin-center"
            animate={{ 
              y: offset * waveSpacing, 
              scaleY: waveScaleY,
            }}
            transition={{
              y: { duration: 2, ease: "easeInOut" },
              scaleY: { duration: 2, ease: "easeInOut" }
            }}
          >
             <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ 
                 duration: isInspire ? 6 : 10, // Acelera levemente no Inspire
                 repeat: Infinity, 
                 ease: "linear" 
               }}
               className="w-full h-full"
             >
                <svg viewBox="0 0 2400 200" preserveAspectRatio="none" className="w-full h-full fill-transparent stroke-white/20" strokeWidth="3">
                  <path d="M 0 100 C 300 200, 300 0, 600 100 C 900 200, 900 0, 1200 100 C 1500 200, 1500 0, 1800 100 C 2100 200, 2100 0, 2400 100" />
                </svg>
             </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

`;

  code = code.substring(0, startIdx) + newComp + code.substring(endIdx);
  fs.writeFileSync('src/views/PanicOverlay.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find start or end index.");
}
