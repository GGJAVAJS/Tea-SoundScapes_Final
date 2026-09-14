const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const carsComponents = `

const CAMERA_POV_POSITION: [number, number, number] = [-0.4, 1.1, -0.2];

function CarModel() {
  const gltf = useGLTF('/car_impala_chevy_corrigido.glb');
  return (
    <group position={[0, 0, 0]}>
      <primitive object={gltf.scene} />
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
            <PerspectiveCamera makeDefault position={CAMERA_POV_POSITION} fov={60} />
            <fog attach="fog" args={['#ffecd2', 10, 150]} />
            <ambientLight intensity={1.5} color="#ffffff" />
            <directionalLight position={[10, 20, -20]} intensity={2.5} castShadow />
            <Environment preset="city" />
            
            <Sky distance={450000} sunPosition={[0, 2, -50]} inclination={0.1} azimuth={0.25} rayleigh={2} />
            <CarModel />
            <InfiniteRoad />
            
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};
`;

code = code.replace('export function PanicOverlay', carsComponents + '\nexport function PanicOverlay');

code = code.replace(
  `const isChildTheme = isSpaceTheme || isDinoTheme;`,
  `const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';\n  const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;`
);

code = code.replace(
  `{isDinoTheme && <DinoPanicBackground />}`,
  `{isDinoTheme && <DinoPanicBackground />}\n          {isCarsTheme && <CarsPanicBackground />}`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
