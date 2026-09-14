import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const vertexShader = `
void main() {
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;

// ---- CAMERA ------------------------------------------------
#define SPEED        1.30    // forward world units per second
#define CAM_H        6.70    // camera altitude
#define PITCH       -0.135   // look tilt (negative = looking down)
#define FOV          0.90    // lens; smaller = more telephoto
#define BOB          0.16    // vertical float amplitude
#define SWAY         0.55    // lateral drift amplitude

// ---- CLOUD BODY --------------------------------------------
#define CLOUD_BOT   -1.00    // slab floor
#define CLOUD_TOP   10.20    // slab ceiling (tallest tower caps here)
#define DECK_TOP     0.58    // normalized top of the flat lower deck
#define TOWER_MIX    0.52    // 0..1 threshold; lower = more towering columns
#define CLOUD_SCALE  0.135   // world -> noise frequency
#define COVERAGE     0.556   // noise threshold; higher = fewer, tighter clouds
#define DECK         0.34    // solid low deck strength
#define EROSION      0.130   // high-freq billow carving
#define DENSITY      2.10    // optical density multiplier

// ---- MARCH (raise for stills, lower for mobile) ------------
#define STEPS        36      // primary samples
#define LIGHT_STEPS  2       // shadow samples toward moon
#define LIGHT_STEP   1.20    // first shadow probe; spacing doubles each tap
#define STEP_NEAR    0.350   // sample spacing at the camera
#define STEP_GROW    0.050   // spacing growth per unit of depth
#define MAX_DIST     48.0
#define ABSORB       0.62
#define LIGHT_ABSORB 0.55
#define HAZE         0.024   // aerial perspective strength
#define EXT_RGB      vec3(1.85, 1.15, 0.60)  // per-channel extinction: blue travels deepest
#define MS_A         0.26    // multiple-scattering octave weight
#define MS_B         0.32    // multiple-scattering octave extinction falloff

// ---- MOON / SKY --------------------------------------------
#define MOON_AZ     -0.135   // + = right of heading
#define MOON_EL      0.112   // + = above horizon
#define MOON_R       0.044   // angular radius (radians)
#define MOON_BRIGHT  2.30
#define STAR_DENSITY 150.0
#define EXPOSURE     1.05

// ============================================================
//  NOISE
// ============================================================
// interleaved gradient noise — much smoother distribution than a plain hash
float ign(vec2 p){
    return fract(52.9829189*fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float hash21(vec2 p){
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x*p.y);
}

float hash31(vec3 p){
    p = fract(p*vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y)*p.z);
}

// smooth 3D value noise -> 0..1
float noise3D(in vec3 p){
    const vec3 s = vec3(113.0, 157.0, 1.0);
    vec3 ip = floor(p);
    vec4 h = vec4(0.0, s.yz, s.y + s.z) + dot(ip, s);
    p -= ip; p = p*p*(3.0 - 2.0*p);
    h = mix(fract(sin(h)*43758.5453), fract(sin(h + s.x)*43758.5453), p.x);
    h.xy = mix(h.xz, h.yw, p.y);
    return mix(h.x, h.y, p.z);
}

float fbm3(vec3 p){
    return noise3D(p)*0.55 + noise3D(p*2.03)*0.28 + noise3D(p*4.11)*0.17;
}

// Henyey-Greenstein phase — drives the silver lining
float hg(float c, float g){
    float g2 = g*g;
    return (1.0 - g2) / (12.5663706*pow(1.0 + g2 - 2.0*g*c, 1.5));
}

vec3 moonDir(){
    return normalize(vec3(MOON_AZ, MOON_EL, 1.0));
}

// ============================================================
//  CLOUD DENSITY FIELD
//  lod 0 = full detail (primary march), lod 1 = cheap (shadow march)
// ============================================================
float cloudMap(vec3 p, int lod){
    float h = clamp((p.y - CLOUD_BOT)/(CLOUD_TOP - CLOUD_BOT), 0.0, 1.0);
    vec3  q = p*CLOUD_SCALE + vec3(iTime*0.012, 0.0, 0.0);

    // large-scale mask decides which columns stay flat deck vs build towers
    float tall = smoothstep(TOWER_MIX, TOWER_MIX + 0.30, noise3D(q*0.40 + 31.0));
    float cap  = mix(DECK_TOP, 1.0, tall);

    float prof = smoothstep(0.0, 0.06, h) * smoothstep(cap, cap - 0.13, h);
    if(prof <= 0.0) return 0.0;

    float f = fbm3(q) + DECK*smoothstep(0.42, 0.0, h);
    float d = f*prof - mix(COVERAGE, COVERAGE*0.88, tall);
    if(d <= 0.0) return 0.0;

    if(lod == 0){
        d -= (noise3D(q*8.5)*0.62 + noise3D(q*19.0)*0.38)*EROSION;
    }
    // crisp the falloff: kills thin translucent veils that read as grain
    return smoothstep(0.0, 0.190, d)*DENSITY;
}

// Returns per-channel transmittance toward the moon. Red extinguishes fastest,
// so shallow edges stay silver while deep interiors shift blue-violet.
vec3 lightTransmit(vec3 p, vec3 ld, float jit){
    float dsum = 0.0, lt = 0.0;
    for(int i = 0; i < LIGHT_STEPS; i++){
        float w = LIGHT_STEP*exp2(float(i));   // doubling spacing reaches deep cheaply
        lt += w;
        dsum += cloudMap(p + ld*(lt - w*jit), 1)*w;
    }
    vec3 o = dsum*LIGHT_ABSORB*EXT_RGB;
    // two extra scattering octaves: softer, deeper light bleed
    return exp(-o) + MS_A*exp(-o*MS_B) + MS_A*MS_A*exp(-o*MS_B*MS_B);
}

// ============================================================
//  SKY : gradient + nebula + stars + moon
// ============================================================
vec3 starField(vec3 rd){
    vec3 p  = rd*STAR_DENSITY;
    vec3 id = floor(p);
    vec3 f  = fract(p) - 0.5;

    float h = hash31(id);
    vec3 off = vec3(hash31(id + 11.3), hash31(id + 27.7), hash31(id + 43.1)) - 0.5;
    float d = length(f - off*0.6);

    float bri  = pow(h, 13.0);
    float core = smoothstep(0.075, 0.0, d);
    float tw   = 0.72 + 0.28*sin(iTime*2.1 + h*90.0);

    vec3 tint = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.94, 0.86), hash31(id + 5.9));
    return tint*core*bri*9.0*tw;
}

vec3 moonGlow(vec3 rd, vec3 ld){
    float ang = acos(clamp(dot(rd, ld), -1.0, 1.0));
    return vec3(0.26, 0.42, 0.85)*pow(max(0.0, 1.0 - ang/(MOON_R*3.0)), 3.0)*0.42
         + vec3(0.10, 0.22, 0.58)*pow(max(0.0, 1.0 - ang/(MOON_R*6.0)), 2.5)*0.08;
}

// gradient + nebula only — reused as the aerial-perspective fog color
vec3 skyBase(vec3 rd){
    float y = clamp(rd.y*0.5 + 0.5, 0.0, 1.0);

    vec3 zenith = vec3(0.00015, 0.00090, 0.0062);
    vec3 mid    = vec3(0.0022, 0.0140, 0.0570);
    vec3 horiz  = vec3(0.0140, 0.0620, 0.1900);

    vec3 c = mix(mid, zenith, smoothstep(0.52, 1.00, y));
    c = mix(horiz, c, smoothstep(0.492, 0.560, y));

    // faint milky-way wisps, upper sky only
    float neb = fbm3(rd*5.0 + 17.0);
    c += vec3(0.0035, 0.0080, 0.0230)*smoothstep(0.52, 0.92, neb)*smoothstep(0.50, 0.86, y);

    return c;
}

vec3 skyColor(vec3 rd, vec3 ld){
    float y = clamp(rd.y*0.5 + 0.5, 0.0, 1.0);
    vec3  c = skyBase(rd);

    c += starField(rd)*smoothstep(0.46, 0.60, y);

    // ---- moon ----
    float ang  = acos(clamp(dot(rd, ld), -1.0, 1.0));
    float disc = smoothstep(MOON_R, MOON_R*0.982, ang);
    if(disc > 0.0){
        vec3 t1 = normalize(cross(ld, vec3(0.0, 1.0, 0.0)));
        vec3 t2 = cross(ld, t1);
        vec2 muv = vec2(dot(rd, t1), dot(rd, t2))/MOON_R;
        float maria = fbm3(vec3(muv*2.4, 0.0));
        float limb  = sqrt(max(1.0 - dot(muv, muv), 0.0));
        vec3 mcol = vec3(0.80, 0.855, 0.95)*(0.68 + 0.42*maria)*(0.80 + 0.30*limb);
        c = mix(c, mcol*MOON_BRIGHT, disc);
    }
    return c + moonGlow(rd, ld);
}

// ============================================================
void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;

    // --- camera: constant heading so the moon never leaves frame
    vec3 ro = vec3(sin(iTime*0.17)*SWAY,
                   CAM_H + sin(iTime*0.31)*BOB,
                   iTime*SPEED);
    vec3 fwd = normalize(vec3(0.0, PITCH, 1.0));
    vec3 rgt = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 upv = cross(fwd, rgt);
    vec3 rd  = normalize(fwd + (uv.x*rgt + uv.y*upv)*FOV);

    vec3 ld = moonDir();

    // --- slab intersection
    float tMin = 0.0, tMax = MAX_DIST;
    if(abs(rd.y) > 1e-4){
        float t0 = (CLOUD_BOT - ro.y)/rd.y;
        float t1 = (CLOUD_TOP - ro.y)/rd.y;
        tMin = max(min(t0, t1), 0.0);
        tMax = min(max(t0, t1), MAX_DIST);
    } else if(ro.y < CLOUD_BOT || ro.y > CLOUD_TOP){
        tMax = -1.0;
    }

    vec3  col   = vec3(0.0);
    float trans = 1.0;

    if(tMax > tMin){
        float jit = mix(hash21(fragCoord), ign(fragCoord), 0.5);
        float t   = tMin;
        float dt  = STEP_NEAR + t*STEP_GROW;
        t += dt*jit;                              // smooth dither kills banding

        float phase = hg(dot(rd, ld), 0.70)*3.0 + 0.95;
        // fog takes the colour of the sky actually behind the ray, so distant
        // cloud near the moon fades silver while cloud away from it fades indigo
        vec3 fogCol = skyBase(rd) + moonGlow(rd, ld)*0.85;

        for(int i = 0; i < STEPS; i++){
            if(t > tMax || trans < 0.02) break;
            dt = STEP_NEAR + t*STEP_GROW;         // fine near, coarse far
            vec3 p = ro + rd*t;

            float dens = cloudMap(p, 0);
            if(dens > 0.002){
                vec3  lt  = lightTransmit(p, ld, jit);
                float pow_ = 1.0 - exp(-dens*2.4);          // powder / edge darkening
                float hN   = clamp((p.y - CLOUD_BOT)/(CLOUD_TOP - CLOUD_BOT), 0.0, 1.0);

                vec3 direct = vec3(0.60, 0.685, 1.02)*lt*phase*1.55;
                vec3 amb    = mix(vec3(0.0005, 0.0032, 0.0320),
                                  vec3(0.0075, 0.0330, 0.2100), hN*hN);
                vec3 shade  = (direct*mix(0.18, 1.0, pow_) + amb);
                shade = mix(shade, fogCol, 1.0 - exp(-t*HAZE));  // aerial perspective

                float a = 1.0 - exp(-dens*dt*ABSORB);
                col   += trans*shade*a;
                trans *= 1.0 - a;
            }
            t += dt;
        }
    }

    col += trans*skyColor(rd, ld);

    // ---- post
    col *= EXPOSURE;
    col  = col/(1.0 + col);                       // reinhard tonemap
    vec2 v = (fragCoord/iResolution.xy - 0.5)*2.0;
    col *= pow(max(1.0 - dot(v*0.38, v*0.38), 0.0), 1.5);
    col  = pow(clamp(col, 0.0, 1.0), vec3(1.0/2.2));

    fragColor = vec4(col, 1.0);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export function NightCloudsShader() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = state.clock.elapsedTime;
      // Multiplying by device pixel ratio if needed, but size is usually logical size.
      // Usually R3F sets size as the canvas size. To be safe, we can use gl.domElement size
      materialRef.current.uniforms.iResolution.value.set(
        state.gl.domElement.width,
        state.gl.domElement.height
      );
    }
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
