const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

code = code.replace(/<primitive object=\{scene\} scale=\{2\.2\} position=\{\[0, -5\.5, -22\]\} rotation=\{\[0, 0, 0\]\} \/>/, 
  '<primitive object={scene} scale={2.5} position={[0, -5.2, -15]} rotation={[0, 0, 0]} />');

fs.writeFileSync('src/views/GuardianView.tsx', code);
