import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const startIdx = code.indexOf('const CarsPanicBackground = ({ phase');
const endIdx = code.indexOf('export function PanicOverlay(');

if (startIdx !== -1 && endIdx !== -1) {
  const newComp = `const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {
  const isInspire = phase === 'Inspire...';
  const isExpire = phase === 'Expire...';

  // 1. Estado de Pulsos Cardíacos Descentralizados
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let currentBPM = 120;
    const targetBPM = 50;
    let timeoutId: NodeJS.Timeout;

    const spawnPulse = () => {
      // Adiciona um novo pulso com coordenadas randômicas
      setPulses((prev) => [
        ...prev.slice(-3), // Mantém apenas os últimos 3 para performance
        {
          id: Date.now(),
          x: Math.random() * 80 + 10, // 10% a 90% da largura
          y: Math.random() * 80 + 10, // 10% a 90% da altura
        },
      ]);

      if (currentBPM > targetBPM) {
        currentBPM -= 1;
      }
      
      const intervalMs = (60 / currentBPM) * 1000;
      timeoutId = setTimeout(spawnPulse, intervalMs);
    };
    
    spawnPulse();

    return () => clearTimeout(timeoutId);
  }, []);

  // 2. Dinâmica da Estrada Sônica
  const waveSpacing = isExpire ? 120 : 30; // Afastadas no Expire, Próximas no Inspire
  const waveScaleY = isExpire ? 0.05 : 1; // Retas no Expire, Onduladas no Inspire
  
  // 3. Dinâmica das Gotas no Vidro
  const dropOpacity = isExpire ? 0 : 1;
  const dropBlur = isExpire ? "blur(8px)" : "blur(0px)";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#020510] to-[#0a1128] overflow-hidden">
      
      {/* Sistema de Pulsações Desfocadas (Cardíaco) */}
      <div className="absolute inset-0 z-0">
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ scale: 0.2, opacity: 0.4 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full bg-[#38bdf8] mix-blend-screen"
            style={{
              top: \`\${pulse.y}%\`,
              left: \`\${pulse.x}%\`,
              filter: "blur(15px)",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Estrada Sônica (Centro) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[30vh] flex flex-col items-center justify-center z-10">
        {/* Onda 1 (Superior) */}
        <motion.div
          animate={{ y: -waveSpacing, scaleY: waveScaleY }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute w-[200%] h-[120px] left-0 origin-bottom"
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 2400 100" preserveAspectRatio="none" className="w-full h-full fill-transparent stroke-[#38bdf8]/30" strokeWidth="3">
              <path d="M 0 50 C 300 100, 300 0, 600 50 C 900 100, 900 0, 1200 50 C 1500 100, 1500 0, 1800 50 C 2100 100, 2100 0, 2400 50" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Linha Tracejada (Pista) */}
        <div className="absolute w-full h-[3px] overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            className="w-[200%] h-full"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.5) 40%, transparent 40%)",
              backgroundSize: "80px 100%",
            }}
          />
        </div>

        {/* Onda 2 (Inferior - Invertida) */}
        <motion.div
          animate={{ y: waveSpacing, scaleY: waveScaleY }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute w-[200%] h-[120px] left-0 origin-top"
        >
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 2400 100" preserveAspectRatio="none" className="w-full h-full fill-transparent stroke-[#38bdf8]/30" strokeWidth="3">
              <path d="M 0 50 C 300 0, 300 100, 600 50 C 900 0, 900 100, 1200 50 C 1500 0, 1500 100, 1800 50 C 2100 0, 2100 100, 2400 50" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Efeito Glassmorphism: Gotas no Vidro */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none" 
        style={{ 
          opacity: dropOpacity, 
          filter: dropBlur, 
          transition: "opacity 2s ease, filter 2s ease" 
        }}
      >
        {[...Array(25)].map((_, i) => {
          const startX = Math.random() * 100;
          const size = 12 + Math.random() * 20; // Tamanhos variados (12px a 32px)
          const duration = 4 + Math.random() * 5;
          const delay = Math.random() * -10; // Espalhamento inicial
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-[45%]"
              style={{
                left: \`\${startX}%\`,
                width: size,
                height: size * 1.3, // Formato levemente alongado (gota escorrendo)
                // Físicas de vidro: Sombra interna de luz, sombra interna escura, desfoque do fundo
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                background: "rgba(255,255,255,0.05)"
              }}
              animate={{
                // Keyframes para simular a gota escorrendo e parando no vidro
                y: ["-10vh", "20vh", "25vh", "60vh", "65vh", "110vh"]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear", // O ease linear interage com os keyframes para dar o "stutter"
                delay
              }}
            >
              {/* Brilho Superior Esquerdo (Highlight) */}
              <div className="absolute top-[10%] left-[15%] w-[35%] h-[35%] bg-white/60 rounded-full blur-[1px]" />
            </motion.div>
          );
        })}
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
