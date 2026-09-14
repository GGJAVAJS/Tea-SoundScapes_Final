import { useRef, useEffect } from 'react';

const vertSrc = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragA = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

const vec3 MainColor = vec3(1.0);

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise( in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return -1.0 + 2.0 * res;
}

float noise2D(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 getIChannel1(vec2 uv) {
    float n = noise2D(uv * 15.0) * 0.5 + noise2D(uv * 30.0) * 0.25 + noise2D(uv * 60.0) * 0.125;
    return vec3(n);
}

float saturate(float x) { return clamp(x, 0.0, 1.0); }
vec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }
float rand(vec2 coord) { return saturate(fract(sin(dot(coord, vec2(12.9898, 78.223))) * 43758.5453)); }
float pcurve( float x, float a, float b ) {
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( x, a ) * pow( 1.0-x, b );
}

const float pi = 3.14159265;
float atan2(float y, float x) {
    if (x > 0.0) return atan(y / x);
    else if (x == 0.0) {
        if (y > 0.0) return pi / 2.0;
        else if (y < 0.0) return -(pi / 2.0);
        else return 0.0;
    } else {
        if (y >= 0.0) return atan(y / x) + pi;
        else return atan(y / x) - pi;
    }
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q)-t.y;
}

#define ITERATIONS 80

void Haze(inout vec3 color, vec3 pos, float alpha) {
    vec2 t = vec2(1.0, 0.01);
    float torusDist = length(sdTorus(pos + vec3(0.0, -0.05, 0.0), t));
    float bloomDisc = 1.0 / (pow(torusDist, 2.0) + 0.001);
    vec3 col = MainColor;
    bloomDisc *= length(pos) < 0.5 ? 0.0 : 1.0;
    color += col * bloomDisc * (0.5 / float(ITERATIONS)) * (1.0 - alpha * 1.0);
}

void GasDisc(inout vec3 color, inout float alpha, vec3 pos) {
    float discRadius = 3.2;
    float discWidth = 5.3;
    float discInner = discRadius - discWidth * 0.5;
    float discOuter = discRadius + discWidth * 0.5;
    
    vec3 origin = vec3(0.0, 0.0, 0.0);
    vec3 discNormal = normalize(vec3(0.0, 1.0, 0.0));
    float discThickness = 0.1;

    float distFromCenter = distance(pos, origin);
    float distFromDisc = dot(discNormal, pos - origin);
    float radialGradient = 1.0 - saturate((distFromCenter - discInner) / discWidth * 0.5);
    float coverage = pcurve(radialGradient, 4.0, 0.9);

    discThickness *= radialGradient;
    coverage *= saturate(1.0 - abs(distFromDisc) / discThickness);

    vec3 dustColorLit = MainColor;
    vec3 dustColorDark = vec3(0.0, 0.0, 0.0);

    float dustGlow = 1.0 / (pow(1.0 - radialGradient, 2.0) * 290.0 + 0.002);
    vec3 dustColor = dustColorLit * dustGlow * 8.2;

    coverage = saturate(coverage * 0.7);

    float fade = pow((abs(distFromCenter - discInner) + 0.4), 4.0) * 0.04;
    float bloomFactor = 1.0 / (pow(distFromDisc, 2.0) * 40.0 + fade + 0.00002);
    vec3 b = dustColorLit * pow(bloomFactor, 1.5);
    
    b *= mix(vec3(1.7, 1.1, 1.0), vec3(0.5, 0.6, 1.0), vec3(pow(radialGradient, 2.0)));
    b *= mix(vec3(1.7, 0.5, 0.1), vec3(1.0), vec3(pow(radialGradient, 0.5)));

    dustColor = mix(dustColor, b * 150.0, saturate(1.0 - coverage * 1.0));
    coverage = saturate(coverage + bloomFactor * bloomFactor * 0.1);
    
    if (coverage < 0.01) return;   
    
    vec3 radialCoords;
    radialCoords.x = distFromCenter * 1.5 + 0.55;
    radialCoords.y = atan2(-pos.x, -pos.z) * 1.5;
    radialCoords.z = distFromDisc * 1.5;
    radialCoords *= 0.95;
    
    float speed = 0.06;
    float noise1 = 1.0;
    vec3 rc = radialCoords + 0.0;               rc.y += iTime * speed;
    noise1 *= noise(rc * 3.0) * 0.5 + 0.5;      rc.y -= iTime * speed;
    noise1 *= noise(rc * 6.0) * 0.5 + 0.5;      rc.y += iTime * speed;
    noise1 *= noise(rc * 12.0) * 0.5 + 0.5;     rc.y -= iTime * speed;
    noise1 *= noise(rc * 24.0) * 0.5 + 0.5;     rc.y += iTime * speed;

    float noise2 = 2.0;
    rc = radialCoords + 30.0;
    noise2 *= noise(rc * 3.0) * 0.5 + 0.5;      rc.y += iTime * speed;
    noise2 *= noise(rc * 6.0) * 0.5 + 0.5;      rc.y -= iTime * speed;
    noise2 *= noise(rc * 12.0) * 0.5 + 0.5;     rc.y += iTime * speed;
    noise2 *= noise(rc * 24.0) * 0.5 + 0.5;     rc.y -= iTime * speed;
    noise2 *= noise(rc * 48.0) * 0.5 + 0.5;     rc.y += iTime * speed;
    noise2 *= noise(rc * 92.0) * 0.5 + 0.5;     rc.y -= iTime * speed;

    dustColor *= noise1 * 0.998 + 0.002;
    coverage *= noise2;
    
    radialCoords.y += iTime * speed * 0.5;
    
    dustColor *= pow(getIChannel1(radialCoords.yx * vec2(0.15, 0.27)), vec3(2.0)) * 4.0;

    coverage = saturate(coverage * 1200.0 / float(ITERATIONS));
    dustColor = max(vec3(0.0), dustColor);
    coverage *= pcurve(radialGradient, 4.0, 0.9);

    color = (1.0 - alpha) * dustColor * coverage + color;
    alpha = (1.0 - alpha) * coverage + alpha;
}

vec3 rotate(vec3 p, float x, float y, float z) {
    mat3 matx = mat3(1.0, 0.0, 0.0, 0.0, cos(x), sin(x), 0.0, -sin(x), cos(x));
    mat3 maty = mat3(cos(y), 0.0, -sin(y), 0.0, 1.0, 0.0, sin(y), 0.0, cos(y));
    mat3 matz = mat3(cos(z), sin(z), 0.0, -sin(z), cos(z), 0.0, 0.0, 0.0, 1.0);
    p = matx * p; p = matz * p; p = maty * p;
    return p;
}

void RotateCamera(inout vec3 eyevec, inout vec3 eyepos) {
    // Default angles for when mouse is inactive, creating a nice cinematic angle
    vec3 angle = vec3(0.05, 1.35, -0.45);
    eyevec = rotate(eyevec, angle.x, angle.y, angle.z);
    eyepos = rotate(eyepos, angle.x, angle.y, angle.z);
}

void WarpSpace(inout vec3 eyevec, inout vec3 raypos) {
    vec3 origin = vec3(0.0, 0.0, 0.0);
    float singularityDist = distance(raypos, origin);
    float warpFactor = 1.0 / (pow(singularityDist, 2.0) + 0.000001);
    vec3 singularityVector = normalize(origin - raypos);
    float warpAmount = 5.0;
    eyevec = normalize(eyevec + singularityVector * warpFactor * warpAmount / float(ITERATIONS));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;
    vec2 uveye = uv;
    
    vec3 eyevec = normalize(vec3((uveye * 2.0 - 1.0) * vec2(aspect, 1.0), 3.2));
    vec3 eyepos = vec3(0.0, -0.0, -10.0);
    
    eyepos.x += 0.35 * 3.0 - 1.5; // Default mouse X positioning
    
    const float far = 15.0;
    RotateCamera(eyevec, eyepos);
    
    vec3 color = vec3(0.0, 0.0, 0.0);
    float dither = rand(uv) * 2.0;
    float alpha = 0.0;
    vec3 raypos = eyepos + eyevec * dither * far / float(ITERATIONS);
    
    for (int i = 0; i < ITERATIONS; i++) {        
        WarpSpace(eyevec, raypos);
        raypos += eyevec * far / float(ITERATIONS);
        GasDisc(color, alpha, raypos);
        Haze(color, raypos, alpha);
    }
    
    // Original multiplied by 0.0001. We multiply by 0.02 to fit in 0..1 RGB range and avoid needing HDR framebuffers on mobile.
    color *= 0.15;
    fragColor = vec4(saturate(color), 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;

const fragB = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
out vec4 fragColor;

vec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }

vec3 ColorFetch(vec2 coord) {
    return texture(iChannel0, coord).rgb;   
}

vec3 Grab(vec2 coord, const float octave, const vec2 offset) {
    float scale = exp2(octave);
    coord /= scale;
    coord -= offset;
    return ColorFetch(coord);
}

vec2 CalcOffset(float octave) {
    vec2 offset = vec2(0.0);
    vec2 padding = vec2(10.0) / iResolution.xy;
    offset.x = -min(1.0, floor(octave / 3.0)) * (0.25 + padding.x);
    offset.y = -(1.0 - (1.0 / exp2(octave))) - padding.y * octave;
    offset.y += min(1.0, floor(octave / 3.0)) * 0.35;
    return offset;   
}

vec3 GetBloom(vec2 coord) {
    vec3 bloom = vec3(0.0);
    // Simplified grab passes (approximating the multiple buffer blurs)
    bloom += Grab(coord, 1.0, vec2(CalcOffset(0.0))) * 1.0;
    bloom += Grab(coord, 2.0, vec2(CalcOffset(1.0))) * 1.5;
    bloom += Grab(coord, 3.0, vec2(CalcOffset(2.0))) * 1.0;
    bloom += Grab(coord, 4.0, vec2(CalcOffset(3.0))) * 1.5;
    return bloom;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec3 color = ColorFetch(uv);
    color += GetBloom(uv) * 0.08;
    
    // Because we multiplied by 0.02 in Pass A (instead of 0.0001), we do NOT need to multiply by 200.0 here!
    // The final result is already equivalent to the original 200.0 * 0.0001 = 0.02 multiplier.
    color *= 1.0; 
    
    //Tonemapping and color grading
    color = pow(color, vec3(1.5));
    color = color / (1.0 + color);
    color = pow(color, vec3(1.0 / 1.5));
    
    color = mix(color, color * color * (3.0 - 2.0 * color), vec3(1.0));
    color = pow(color, vec3(1.3, 1.20, 1.0));    

	color = saturate(color * 1.01);
    color = pow(color, vec3(0.7 / 2.2));

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;

export function SpaceBloomShader() {
  const ref = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const pre = preRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    
    if (!gl) { 
        pre.textContent = "WebGL2 not available"; 
        return; 
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!; 
      gl.shaderSource(sh, src); 
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) || "compile error");
      return sh;
    };

    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) || "link error");
      return p;
    };

    let progA: WebGLProgram, progB: WebGLProgram;
    try { 
        progA = link(vertSrc, fragA); 
        progB = link(vertSrc, fragB); 
    } catch(e: any) { 
        (pre.textContent as any) = "Shader error:\n" + e.message; 
        console.error("Shader error:", e.message);
        return; 
    }

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1, 1,  -1, 1,  1,-1,  1, 1,
    ]), gl.STATIC_DRAW);
    
    const vaoA = gl.createVertexArray();
    gl.bindVertexArray(vaoA);
    gl.enableVertexAttribArray(0); 
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const fbo = gl.createFramebuffer();
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    const uResA  = gl.getUniformLocation(progA, "iResolution");
    const uTimeA = gl.getUniformLocation(progA, "iTime");
    const uMouseA = gl.getUniformLocation(progA, "iMouse");

    const uResB  = gl.getUniformLocation(progB, "iResolution");
    const uTimeB = gl.getUniformLocation(progB, "iTime");
    const uTexB  = gl.getUniformLocation(progB, "iChannel0");
    
    let width = 0, height = 0;
    const resize = () => {
      // Usar dpr baixo (0.5 - 0.75) porque a renderização de raymarching (Buffer A) com 80 iterações é MUITO pesada para mobile!
      const dpr = Math.min(0.65, window.devicePixelRatio || 1);
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
      if (width !== w || height !== h) { 
          width = w; height = h;
          canvas.width = w; canvas.height = h; 
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
    };

    const onResize = () => { resize(); };
    window.addEventListener("resize", onResize, {passive:true});
    resize();
    
    let raf = 0;
    const t0 = performance.now();
    
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      
      // Pass 1: Render Black Hole to FBO
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, width, height);
      gl.useProgram(progA);
      gl.uniform2f(uResA, width, height);
      gl.uniform1f(uTimeA, t);
      gl.uniform2f(uMouseA, 0.0, 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Pass 2: Render Bloom and Tonemap to Screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(progB);
      gl.uniform2f(uResB, width, height);
      gl.uniform1f(uTimeB, t);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTexB, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => { 
        cancelAnimationFrame(raf); 
        window.removeEventListener("resize", onResize); 
    };
  }, []);

  return (
    <div style={{position:"absolute", inset: 0}}>
      <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block", background:"#000" }} />
      <pre ref={preRef} style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)", fontSize:"20px", color:"#f00", whiteSpace:"pre-wrap", zIndex:50, pointerEvents: "none"}}/>
    </div>
  );
}
