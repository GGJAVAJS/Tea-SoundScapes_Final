const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/PanicOverlay.tsx', 'utf8');

const camRegex = /<PerspectiveCamera makeDefault position=\{\[0, 4, -4\]\} rotation=\{\[-0\.1, Math\.PI, 0\]\} fov=\{75\} \/>/;
code = code.replace(camRegex, '<PerspectiveCamera makeDefault position={[0, 4, 3]} rotation={[-0.2, Math.PI, 0]} fov={75} />');

fs.writeFileSync('/app/applet/src/views/PanicOverlay.tsx', code);
