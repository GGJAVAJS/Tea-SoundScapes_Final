const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/GuardianView.tsx', 'utf8');

const tRexGuardianCode = `
function RunningForest({ dbLevel }: { dbLevel: number }) {
  const trees = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      x: (Math.random() - 0.5) * 60, // Width spread
      z: -100 - Math.random() * 200, // Depth spread
      scale: 1 + Math.random() * 3,
      speed: 20 + Math.random() * 10
    })).filter(t => Math.abs(t.x) > 5); // Keep a path in the middle
  }, []);

  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const speedMultiplier = 1 + Math.max(0, (dbLevel - 30) / 40);
      group.current.children.forEach((child, i) => {
        const treeData = trees[i];
        child.position.z += treeData.speed * speedMultiplier * delta;
        if (child.position.z > 20) {
          child.position.z = -200 - Math.random() * 50;
        }
      });
    }
  });

  return (
    <group ref={group} position={[0, -5, 0]}>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]}>
          <coneGeometry args={[t.scale * 2, t.scale * 15, 5]} />
          <meshStandardMaterial color="#0a1f10" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function TyrannosaurusModel({ dbLevel }: { dbLevel: number }) {
  const { scene, animations } = useGLTF('/animated_tyrannosaurus_rex_dinosaur_running_loop.glb');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) {
      action.play();
    }
  }, [actions]);

  useFrame(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) {
      const intensity = Math.max(0, (dbLevel - 30) / 40);
      action.setEffectiveTimeScale(1 + intensity * 0.5);
    }
  });

  return <primitive object={scene} scale={2.5} position={[0, -5, -15]} rotation={[0, 0, 0]} />;
}

function DinoGuardianBackground({ dbLevel }: { dbLevel: number }) {
  return (
    <>
      <color attach="background" args={['#051008']} />
      <fog attach="fog" args={['#051008', 10, 100]} />
      <ambientLight intensity={0.5} color="#2b4f3b" />
      <directionalLight position={[10, 20, -20]} intensity={1.5} color="#8cbabf" castShadow />
      
      <RunningForest dbLevel={dbLevel} />
      <TyrannosaurusModel dbLevel={dbLevel} />
    </>
  );
}
`;

// Insert the code just before function GuardianView
const insertIndex = code.indexOf('export function GuardianView');
code = code.substring(0, insertIndex) + tRexGuardianCode + '\n' + code.substring(insertIndex);

// Replace {isDinoTheme && <MeteorModel dbLevel={dbLevel} />} with our background
// And make sure to handle background color conditionally
code = code.replace("{isDinoTheme && <MeteorModel dbLevel={dbLevel} />}", "{isDinoTheme && <DinoGuardianBackground dbLevel={dbLevel} />}");

// Also replace the default background color if it's space theme, else the child inside DinoGuardianBackground will override it anyway. 
// Wait, multiple <color attach="background" /> inside Canvas might conflict. Let's just conditionally render the default one.
code = code.replace("<color attach=\"background\" args={['#000000']} />", "{!isDinoTheme && <color attach=\"background\" args={['#000000']} />}");

fs.writeFileSync('/app/applet/src/views/GuardianView.tsx', code);
