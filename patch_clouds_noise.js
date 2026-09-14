import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// Certifique-se de que os imports do postprocessing incluem Noise
if (!code.includes(' Noise ') && code.includes('@react-three/postprocessing')) {
  code = code.replace(
    "import { EffectComposer, Bloom } from '@react-three/postprocessing';",
    "import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';"
  );
}

const startIdx = code.indexOf('// Componente para criar as ondas de neblina (montanhas procedurais)');
const endIdx = code.indexOf('export function PanicOverlay(');

if (startIdx !== -1 && endIdx !== -1) {
  const newComp = `// Componente de Nuvens em Camadas
const FogWaves = () => {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);
  const wave4Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Animação ondulatória contínua e suave para simular nuvens/névoa estilizada
    if (wave1Ref.current) wave1Ref.current.position.y = Math.sin(t * 0.4) * 1.5 - 1;
    if (wave2Ref.current) wave2Ref.current.position.y = Math.sin(t * 0.3 + 1) * 2.5 - 3;
    if (wave3Ref.current) wave3Ref.current.position.y = Math.sin(t * 0.2 + 2) * 3.5 - 6;
    if (wave4Ref.current) wave4Ref.current.position.y = Math.sin(t * 0.15 + 3) * 4.5 - 9;
  });

  return (
    <group position={[0, 0, -120]}>
      {/* Wave 1: Mais próxima, tom de cinza mais claro (para criar a base de neblina) */}
      <mesh ref={wave1Ref} position={[0, 0, 40]}>
        <planeGeometry args={[250, 40, 32, 32]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Wave 2: Cinza médio */}
      <mesh ref={wave2Ref} position={[0, -2, 20]}>
        <planeGeometry args={[250, 60, 32, 32]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
      {/* Wave 3: Grafite escuro */}
      <mesh ref={wave3Ref} position={[0, -4, 0]}>
        <planeGeometry args={[250, 80, 32, 32]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* Wave 4: Mais ao fundo, quase preto puro para sensação extrema de profundidade */}
      <mesh ref={wave4Ref} position={[0, -6, -20]}>
        <planeGeometry args={[250, 100, 32, 32]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
    </group>
  );
};

const CarsScene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneGroup = useRef<THREE.Group>(null);
  
  const [mode, setMode] = useState<1 | 2>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => (prev === 1 ? 2 : 1));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (sceneGroup.current) {
      sceneGroup.current.position.z += 15 * delta;
      if (sceneGroup.current.position.z > 50) {
        sceneGroup.current.position.z = 0;
      }
    }

    if (cameraRef.current) {
      const targetPosition = mode === 1 
        ? new THREE.Vector3(0, 40, 0)
        : new THREE.Vector3(0, 2, 10);
        
      const targetRotation = mode === 1 
        ? new THREE.Euler(-Math.PI / 2, 0, 0)
        : new THREE.Euler(-0.05, 0, 0);
      
      const lerpFactor = 1.5 * delta;

      cameraRef.current.position.lerp(targetPosition, lerpFactor);
      
      const currentQuat = cameraRef.current.quaternion;
      const targetQuat = new THREE.Quaternion().setFromEuler(targetRotation);
      currentQuat.slerp(targetQuat, lerpFactor);
    }
  });

  const boxes = useMemo(() => {
    const items = [];
    for(let i = 0; i < 40; i++) {
      const z = Math.random() * -150;
      const x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 20 + 8); 
      const height = Math.random() * 8 + 3;
      const width = Math.random() * 4 + 2;
      items.push({ id: i, x, z, height, width });
    }
    return items;
  }, []);

  const poles = useMemo(() => {
    const items = [];
    for(let i = 0; i < 20; i++) {
      const z = Math.random() * -150;
      const x = (Math.random() > 0.5 ? 1 : -1) * 6;
      items.push({ id: i, x, z });
    }
    return items;
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 40, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={60} />
      
      {/* Removido o fog genérico, a profundidade será feita visualmente pelas nuvens */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 15, 5]} intensity={1.2} />

      <FogWaves />

      <group ref={sceneGroup}>
        {/* Estrada */}
        <mesh position={[0, 0, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 200]} />
          <meshBasicMaterial color="#080808" />
        </mesh>
        
        {/* Linha Tracejada */}
        <mesh position={[0, 0.05, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 200]} />
          <meshBasicMaterial color="#444444" />
        </mesh>

        {/* Chão lateral */}
        <mesh position={[0, -0.1, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial color="#030303" />
        </mesh>

        {/* Casas (Cinza médio com emissive sutil) */}
        {boxes.map(box => (
          <mesh key={\`box-\${box.id}\`} position={[box.x, box.height / 2, box.z]}>
            <boxGeometry args={[box.width, box.height, box.width]} />
            <meshStandardMaterial 
              color="#333333" 
              emissive="#1a1a1a" // Brilho próprio muito leve 
              roughness={0.9} 
            />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(box.width, box.height, box.width)]} />
              <lineBasicMaterial color="#555555" linewidth={1} />
            </lineSegments>
          </mesh>
        ))}

        {/* Postes (Grafite com emissive sutil) */}
        {poles.map(pole => (
          <group key={\`pole-\${pole.id}\`} position={[pole.x, 0, pole.z]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 6, 8]} />
              <meshStandardMaterial 
                color="#444444" 
                emissive="#222222" 
                roughness={0.8} 
              />
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(0.05, 0.1, 6, 8)]} />
                <lineBasicMaterial color="#666666" linewidth={1} />
              </lineSegments>
            </mesh>
            {/* Luz do poste levemente ligada pra quebrar a escuridão */}
            <mesh position={[0.5 * Math.sign(pole.x), 6, 0]}>
               <boxGeometry args={[1, 0.1, 0.1]} />
               <meshBasicMaterial color="#666666" />
            </mesh>
          </group>
        ))}
      </group>

      <EffectComposer>
        {/* Ruído Cinematográfico (Film Grain) via WebGL para aplicar sobre toda a cena renderizada */}
        <Noise opacity={0.3} premultiply blendFunction={THREE.AdditiveBlending} />
      </EffectComposer>
    </>
  );
};

const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {
  const isExpire = phase === 'Expire...';
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let currentBPM = 120;
    const targetBPM = 50;
    let timeoutId: NodeJS.Timeout;

    const spawnPulse = () => {
      setPulses((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
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

  const dropOpacity = isExpire ? 0 : 0.4;

  return (
    <div className="absolute inset-0 z-0 bg-[#030303] overflow-hidden">
      
      {/* Camada 3D - Background Estética Dark */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas gl={{ antialias: false, powerPreference: 'high-performance' }}>
             <CarsScene />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Camada 2D - SVG de Chuva Nativo (Substituído) */}
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

      {/* Camada 2D - Pulsos Cardíacos Desfocados */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ scale: 0.5, opacity: 0.1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full bg-[#aaaaaa] mix-blend-screen"
            style={{
              top: \`\${pulse.y}%\`,
              left: \`\${pulse.x}%\`,
              filter: "blur(20px)",
              transform: "translate(-50%, -50%)",
            }}
          />
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
