import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// Ensure EffectComposer and Bloom are imported
if (!code.includes('@react-three/postprocessing')) {
  code = code.replace(
    "import * as THREE from 'three';",
    "import * as THREE from 'three';\nimport { EffectComposer, Bloom } from '@react-three/postprocessing';"
  );
}

const startIdx = code.indexOf("const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {");
const endIdx = code.indexOf('export function PanicOverlay(');

if (startIdx !== -1 && endIdx !== -1) {
  const newComp = `const CarsScene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Ref para o grupo do cenário, para fazermos ele se mover no eixo Z
  const sceneGroup = useRef<THREE.Group>(null);
  
  const [mode, setMode] = useState<1 | 2>(1); // 1 = Top-Down, 2 = First-Person

  // Máquina de estados: alterna câmera a cada 20 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => (prev === 1 ? 2 : 1));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    // Animação procedural: Mover o cenário para a câmera para dar ilusão de viagem
    if (sceneGroup.current) {
      sceneGroup.current.position.z += 10 * delta; // Velocidade de 10 unidades por segundo
      if (sceneGroup.current.position.z > 50) {
        sceneGroup.current.position.z = 0; // Loop procedural
      }
    }

    // Interpolação suave da Câmera (Lerp)
    if (cameraRef.current) {
      const targetPosition = mode === 1 
        ? new THREE.Vector3(0, 30, 0) // Alto (Top-down)
        : new THREE.Vector3(0, 1.5, 5); // Baixo (First-Person)
        
      const targetRotation = mode === 1 
        ? new THREE.Euler(-Math.PI / 2, 0, 0) // Olhando pra baixo
        : new THREE.Euler(-0.1, 0, 0); // Olhando para o horizonte
      
      const lerpFactor = 2 * delta;

      cameraRef.current.position.lerp(targetPosition, lerpFactor);
      
      // Interpolando rotação
      const currentQuat = cameraRef.current.quaternion;
      const targetQuat = new THREE.Quaternion().setFromEuler(targetRotation);
      currentQuat.slerp(targetQuat, lerpFactor);
    }
  });

  // Geração de primitivas do cenário
  const boxes = useMemo(() => {
    const items = [];
    for(let i = 0; i < 40; i++) {
      // Distribui ao longo do eixo Z de -100 a 50
      const z = Math.random() * -150;
      // Posiciona nas margens (longe do centro)
      const x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 20 + 5); 
      const height = Math.random() * 5 + 2;
      items.push({ id: i, x, z, height });
    }
    return items;
  }, []);

  const towers = useMemo(() => {
    const items = [];
    for(let i = 0; i < 15; i++) {
      const z = Math.random() * -150;
      const x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10 + 15);
      items.push({ id: i, x, z });
    }
    return items;
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 30, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={60} />
      
      <group ref={sceneGroup}>
        {/* A Estrada Central (Linhas wireframe) */}
        <mesh position={[0, 0.01, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 200, 4, 100]} />
          <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.3} />
        </mesh>

        {/* Chão escuro pra dar contraste */}
        <mesh position={[0, 0, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 200]} />
          <meshBasicMaterial color="#02040a" />
        </mesh>

        {/* Casas / Caixas */}
        {boxes.map(box => (
          <mesh key={\`box-\${box.id}\`} position={[box.x, box.height / 2, box.z]}>
            <boxGeometry args={[3, box.height, 3]} />
            <meshBasicMaterial color="#8b5cf6" wireframe={true} transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Torres de energia (Cilindros finos) */}
        {towers.map(tower => (
          <mesh key={\`tower-\${tower.id}\`} position={[tower.x, 10, tower.z]}>
            <cylinderGeometry args={[0.1, 0.5, 20, 4]} />
            <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} opacity={1.5} />
      </EffectComposer>
    </>
  );
};

const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    /*
    // AUDIO HOOKS - Pronto para Howler.js
    // TODO: Instanciar faixas com Howler.js
    const rainSound = new Howl({ src: ['rain.mp3'], loop: true, volume: 0.4 });
    const pianoSound = new Howl({ src: ['piano.mp3'], loop: true, volume: 0.3 });
    const heartSound = new Howl({ src: ['heartbeat.mp3'] });
    
    rainSound.play();
    pianoSound.play();
    */
    
    let currentBPM = 120; // Começa mais rápido
    const targetBPM = 50; // Termina calmo
    let timeoutId: NodeJS.Timeout;

    const spawnPulse = () => {
      // heartSound.play(); // Dispara o som
      
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

    return () => {
      /*
      rainSound.unload();
      pianoSound.unload();
      heartSound.unload();
      */
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#020510] overflow-hidden">
      
      {/* Camada 3D - Background Generativo */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas gl={{ antialias: false, powerPreference: 'high-performance' }}>
             <CarsScene />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Camada 2D - UI de Efeitos Orgânicos (HTML/CSS) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full bg-[#8b5cf6] mix-blend-screen"
            style={{
              top: \`\${pulse.y}%\`,
              left: \`\${pulse.x}%\`,
              filter: "blur(15px)",
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
