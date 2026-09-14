const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

code = code.replace("import { Check } from 'lucide-react';", "import { Check, Car } from 'lucide-react';");

const oldCarsBlock = `const CAMERA_POV_POSITION: [number, number, number] = [0, 0.05, 0.35];
const CAMERA_POV_ROTATION: [number, number, number] = [-0.1, 0, 0];

function CarModel() {
  const gltf = useGLTF('/sportcar_concept_chanel_roadster_by_max_hordin_corrigido.glb');
  return (
    <group position={[0, 0, 0]}>
      <primitive object={gltf.scene} scale={[1, 1, 1]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

function InfiniteRoad() {
  const gridGroup = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridGroup.current) {
      gridGroup.current.position.z += delta * 30; // speed
      if (gridGroup.current.position.z > 10) {
        gridGroup.current.position.z = gridGroup.current.position.z % 10;
      }
    }
  });

  return (
    <group position={[0, 0, -50]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <group ref={gridGroup} position={[0, 0.01, 0]}>
         <gridHelper args={[200, 20, '#ffffff', '#555555']} />
      </group>
    </group>
  );
}

const CarsPanicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto bg-[#ffecd2]">
      <ErrorBoundary>
        <Canvas 
          dpr={1} 
          performance={{ min: 0.5 }}
          gl={{ powerPreference: 'high-performance', antialias: false }}
        >
          <Suspense fallback={<Loader />}>
            <PerspectiveCamera makeDefault position={CAMERA_POV_POSITION} rotation={CAMERA_POV_ROTATION} fov={55} />
            <fog attach="fog" args={['#ffecd2', 10, 150]} />
            <ambientLight intensity={1} color="#ffffff" />
            <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
            <Environment preset="city" />
            
            <Sky distance={450000} sunPosition={[0, 2, -50]} inclination={0.1} azimuth={0.25} rayleigh={2} />
            <CarModel />
            <InfiniteRoad />
            
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};`;

const newCarsBlock = `const CarsPanicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-[#030614] overflow-hidden">
      {/* Endel-style abstract blobs */}
      <div className="absolute inset-0 opacity-70 blur-[80px]">
        {/* Blob 1: Deep Blue */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 60, -20, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[30rem] h-[30rem] bg-[#0f2259] rounded-full mix-blend-screen"
        />
        {/* Blob 2: Deep Purple */}
        <motion.div
          animate={{
            scale: [1, 1.3, 0.9, 1],
            x: [0, -50, 40, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[10%] w-[25rem] h-[25rem] bg-[#221245] rounded-full mix-blend-screen"
        />
        {/* Blob 3: Soft Teal/Blue */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1.4, 1],
            x: [0, 40, -50, 0],
            y: [0, 20, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[30%] w-[35rem] h-[35rem] bg-[#0c2e42] rounded-full mix-blend-screen"
        />
      </div>

      {/* Gentle motion lines (speed illusion) */}
      <div className="absolute inset-0 flex flex-col justify-end pb-[20vh] opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: '-30vw', opacity: [0, 1, 1, 0] }}
            transition={{ 
              duration: 6 + (i * 2), 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 1.5
            }}
            className="h-[2px] bg-white/30 rounded-full mb-8"
            style={{ width: \`\${15 + (i * 5)}%\`, alignSelf: 'flex-end' }}
          />
        ))}
      </div>

      {/* Minimalist Car Icon with bobbing effect */}
      <div className="absolute bottom-[12vh] left-0 right-0 flex justify-center items-center">
         <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         >
            <div className="p-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Car className="w-10 h-10 text-white/70" strokeWidth={1.5} />
            </div>
         </motion.div>
      </div>
    </div>
  );
};`;

code = code.replace(oldCarsBlock, newCarsBlock);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
