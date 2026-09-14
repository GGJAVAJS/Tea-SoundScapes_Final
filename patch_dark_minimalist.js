import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const startIdx = code.indexOf('const CarsScene = () => {');
const endIdx = code.indexOf('export function PanicOverlay(');

if (startIdx !== -1 && endIdx !== -1) {
  const newComp = `// Componente para criar as ondas de neblina (montanhas procedurais)
const FogWaves = () => {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (wave1Ref.current) wave1Ref.current.position.y = Math.sin(t * 0.5) * 2 - 2;
    if (wave2Ref.current) wave2Ref.current.position.y = Math.sin(t * 0.3 + 1) * 3 - 5;
    if (wave3Ref.current) wave3Ref.current.position.y = Math.sin(t * 0.2 + 2) * 4 - 8;
  });

  return (
    <group position={[0, 0, -100]}>
      {/* Wave 1 */}
      <mesh ref={wave1Ref} position={[0, 0, 0]}>
        <planeGeometry args={[200, 40, 16, 16]} />
        <meshBasicMaterial color="#1a1a1a" fog={false} />
      </mesh>
      {/* Wave 2 */}
      <mesh ref={wave2Ref} position={[0, -2, -20]}>
        <planeGeometry args={[200, 60, 16, 16]} />
        <meshBasicMaterial color="#111111" fog={false} />
      </mesh>
      {/* Wave 3 */}
      <mesh ref={wave3Ref} position={[0, -4, -40]}>
        <planeGeometry args={[200, 80, 16, 16]} />
        <meshBasicMaterial color="#0a0a0a" fog={false} />
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
      
      <fog attach="fog" args={['#050505', 10, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />

      <FogWaves />

      <group ref={sceneGroup}>
        {/* Estrada */}
        <mesh position={[0, 0, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 200]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        
        {/* Linha Tracejada */}
        <mesh position={[0, 0.05, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 200]} />
          <meshBasicMaterial color="#333333" />
        </mesh>

        {/* Chão lateral */}
        <mesh position={[0, -0.1, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial color="#050505" />
        </mesh>

        {/* Casas (Blocos Dark) */}
        {boxes.map(box => (
          <mesh key={\`box-\${box.id}\`} position={[box.x, box.height / 2, box.z]}>
            <boxGeometry args={[box.width, box.height, box.width]} />
            {/* O MeshStandardMaterial reage à luz suave e ao fog, dando um ar sombrio com bordas levemente iluminadas pela luz direcional */}
            <meshStandardMaterial color="#000000" roughness={0.8} metalness={0.2} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(box.width, box.height, box.width)]} />
              <lineBasicMaterial color="#222222" linewidth={1} />
            </lineSegments>
          </mesh>
        ))}

        {/* Postes */}
        {poles.map(pole => (
          <group key={\`pole-\${pole.id}\`} position={[pole.x, 0, pole.z]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 6, 8]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(0.05, 0.1, 6, 8)]} />
                <lineBasicMaterial color="#333333" linewidth={1} />
              </lineSegments>
            </mesh>
            {/* Luz do poste apagada/muito suave */}
            <mesh position={[0.5 * Math.sign(pole.x), 6, 0]}>
               <boxGeometry args={[1, 0.1, 0.1]} />
               <meshBasicMaterial color="#1a1a1a" />
            </mesh>
          </group>
        ))}
      </group>
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
    <div className="absolute inset-0 z-0 bg-[#050505] overflow-hidden">
      
      {/* Camada 3D - Background Estética Dark */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas gl={{ antialias: false, powerPreference: 'high-performance' }}>
             <CarsScene />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Camada CSS Overlay - Ruído/Film Grain Analógico */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Camada 2D - Gotas Glassmorphism */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none" 
        style={{ 
          opacity: dropOpacity, 
          transition: "opacity 2s ease" 
        }}
      >
        {[...Array(30)].map((_, i) => {
          const startX = Math.random() * 100;
          const size = 10 + Math.random() * 15;
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * -10;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-[45%]"
              style={{
                left: \`\${startX}%\`,
                width: size,
                height: size * 1.4,
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 6px rgba(0,0,0,0.8)",
                backdropFilter: "blur(3px)",
                background: "rgba(255,255,255,0.02)"
              }}
              animate={{
                y: ["-10vh", "30vh", "35vh", "70vh", "75vh", "110vh"]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay
              }}
            >
              <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/20 rounded-full blur-[1px]" />
            </motion.div>
          );
        })}
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
