const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

// Update T-Rex scale and position
code = code.replace(/<primitive object=\{scene\} scale=\{3\} position=\{\[0, -5, -12\]\} rotation=\{\[0, 0, 0\]\} \/>/, 
  '<primitive object={scene} scale={2.2} position={[0, -5.5, -22]} rotation={[0, 0, 0]} />');

// Adjust camera to look slightly more up and be a bit lower to ground
code = code.replace(/<PerspectiveCamera makeDefault position=\{\[0, -4\.8, -8\]\} rotation=\{\[0\.2, 0, 0\]\} fov=\{75\} \/>/,
  '<PerspectiveCamera makeDefault position={[0, -5, -8]} rotation={[0.25, 0, 0]} fov={75} />');

fs.writeFileSync('src/views/GuardianView.tsx', code);
