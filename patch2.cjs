const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/PanicOverlay.tsx', 'utf8');

const tRexModel = `function TyrannosaurusModel() {
  const { scene, animations } = useGLTF('/animated_tyrannosaurus_rex_dinosaur_running_loop.glb');
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) action.play();
  }, [actions]);
  return <primitive object={scene} scale={2} position={[-15, -5, -25]} rotation={[0, Math.PI / 2, 0]} />;
}
`;

const pteroModel = `function PterodactylModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/animated_flying_pteradactal_dinosaur_loop.glb');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) action.play();
  }, [actions]);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime() * 0.4;
      group.current.position.x = Math.cos(t) * 30;
      group.current.position.z = Math.sin(t) * 30;
      group.current.rotation.y = -t;
    }
  });

  return (
    <group ref={group} position={[0, 20, 0]}>
      <primitive object={scene} scale={0.5} />
    </group>
  );
}
`;

const dinoPanicStart = code.indexOf('const DinoPanicBackground = () =>');
code = code.substring(0, dinoPanicStart) + tRexModel + '\n' + pteroModel + '\n' + code.substring(dinoPanicStart);

code = code.replace('<ModelErrorBoundary><StegosaurusModel /></ModelErrorBoundary>', 
  '<ModelErrorBoundary><StegosaurusModel /></ModelErrorBoundary>\\n          <ModelErrorBoundary><TyrannosaurusModel /></ModelErrorBoundary>\\n          <ModelErrorBoundary><PterodactylModel /></ModelErrorBoundary>');

fs.writeFileSync('/app/applet/src/views/PanicOverlay.tsx', code);
