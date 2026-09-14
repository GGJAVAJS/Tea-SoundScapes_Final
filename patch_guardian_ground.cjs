const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// Update trees mapping to lift them up so their base is at 0 relative to group
code = code.replace(
  /<mesh key=\{i\} position=\{\[t\.x, 0, t\.z\]\}>/g,
  '<mesh key={i} position={[t.x, t.scale * 7.5, t.z]}>'
);

// Update RunningForest group position from [0, -5, 0] to [0, -5.2, 0]
code = code.replace(
  /<group ref=\{group\} position=\{\[0, -5, 0\]\}>/g,
  '<group ref={group} position={[0, -5.2, 0]}>'
);

// Add a ground plane to DinoGuardianBackground
const bgMatch = `<RunningForest dbLevel={dbLevel} />
      <TyrannosaurusModel dbLevel={dbLevel} />`;
const bgReplace = `<RunningForest dbLevel={dbLevel} />
      <mesh position={[0, -5.2, -150]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#051008" roughness={1} />
      </mesh>
      <TyrannosaurusModel dbLevel={dbLevel} />`;
code = code.replace(bgMatch, bgReplace);

fs.writeFileSync('src/views/GuardianView.tsx', code);
