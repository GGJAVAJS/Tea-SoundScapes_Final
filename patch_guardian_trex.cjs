const fs = require('fs');
let guardianCode = fs.readFileSync('/app/applet/src/views/GuardianView.tsx', 'utf8');

guardianCode = guardianCode.replace(/<primitive object=\{scene\} scale=\{2\.5\} position=\{\[0, -5, -13\]\} rotation=\{\[0, 0, 0\]\} \/>/, '<primitive object={scene} scale={3} position={[0, -5, -12]} rotation={[0, 0, 0]} />');
guardianCode = guardianCode.replace(/<primitive object=\{scene\} scale=\{2\.5\} position=\{\[0, -5, -15\]\} rotation=\{\[0, 0, 0\]\} \/>/, '<primitive object={scene} scale={3} position={[0, -5, -12]} rotation={[0, 0, 0]} />');


guardianCode = guardianCode.replace(/<PerspectiveCamera makeDefault position=\{\[0, -4\.5, -9\]\} rotation=\{\[0\.15, 0, 0\]\} fov=\{75\} \/>/, '<PerspectiveCamera makeDefault position={[0, -4.8, -8]} rotation={[0.2, 0, 0]} fov={75} />');

fs.writeFileSync('/app/applet/src/views/GuardianView.tsx', guardianCode);
