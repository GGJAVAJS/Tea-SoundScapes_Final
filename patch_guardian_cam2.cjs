const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/GuardianView.tsx', 'utf8');

const oldRegex = /<PerspectiveCamera makeDefault position=\{\[-2, -4\.5, -6\]\} rotation=\{\[0\.2, -0\.3, 0\]\} fov=\{70\} \/>/;
code = code.replace(oldRegex, '<PerspectiveCamera makeDefault position={[0, -4, -8]} rotation={[0.4, 0, 0]} fov={70} />');

fs.writeFileSync('/app/applet/src/views/GuardianView.tsx', code);
