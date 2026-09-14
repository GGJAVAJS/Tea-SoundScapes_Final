const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/PanicOverlay.tsx', 'utf8');

const replacement = `<Sky distance={450000} sunPosition={[50, 100, -50]} inclination={0.2} azimuth={0.25} rayleigh={2} />
          
          <Clouds material="basic">
            <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#ffffff" position={[0, 80, -100]} />
            <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#f0f0f0" position={[80, 60, -50]} />
            <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#e0e0e0" position={[-80, 70, -80]} />
          </Clouds>`;

code = code.replace('<Sky distance={450000} sunPosition={[50, 100, -50]} inclination={0.2} azimuth={0.25} rayleigh={2} />', replacement);

fs.writeFileSync('/app/applet/src/views/PanicOverlay.tsx', code);
