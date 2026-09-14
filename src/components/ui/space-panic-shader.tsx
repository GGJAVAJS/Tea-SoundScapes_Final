"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;

#define BackgroundColor vec3(0.0941, 0.1019, 0.0901)

// --- Procedural Noise Functions ---
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
float smoothNoise(vec2 uv) {
    vec2 lv = fract(uv);
    vec2 id = floor(uv);
    lv = lv*lv*(3.0-2.0*lv);
    float bl = hash(id);
    float br = hash(id+vec2(1.0,0.0));
    float b = mix(bl, br, lv.x);
    float tl = hash(id+vec2(0.0,1.0));
    float tr = hash(id+vec2(1.0,1.0));
    float t = mix(tl, tr, lv.x);
    return mix(b, t, lv.y);
}
float fbm(vec2 uv) {
    float f = 0.;
    f += 0.5000*smoothNoise(uv); uv*=2.02;
    f += 0.2500*smoothNoise(uv); uv*=2.03;
    f += 0.1250*smoothNoise(uv); uv*=2.01;
    f += 0.0625*smoothNoise(uv);
    return f;
}
// ----------------------------------

vec4 generateSphereSurfaceWithMask(vec2 uv, float radius) {
    float radiusSquared = radius * radius;
    float uvLengthSquared = dot(uv, uv);
    float uvLength = sqrt(uvLengthSquared);
    float mask = step(uvLength, radius);
    vec3 surface = vec3(0.0, 0.0, 0.0);
    if(mask > 0.0) {
        surface = vec3(uv / radius, sqrt(radiusSquared - uvLengthSquared));
    } else {
        surface = vec3(uv / uvLength, uvLength - radius);
    }
    return vec4(surface, mask);
}

vec2 generateSphericalUV(vec3 position, float spin) {
    float width = sqrt(1.0 - position.y * position.y);
    float generatrixX = position.x / width;
    vec2 generatrix = vec2(generatrixX, position.y);
    vec2 uv = asin(generatrix) / 3.14159 + vec2(0.5 + spin, 0.5);  
    return vec2(uv);
}

mat3 createRotationMatrix(float pitch, float roll) {
    float cosPitch = cos(pitch);
    float sinPitch = sin(pitch);
    float cosRoll = cos(roll);
    float sinRoll = sin(roll);
    return mat3(
        cosRoll, -sinRoll * cosPitch, sinRoll * sinPitch,
        sinRoll, cosRoll * cosPitch, -cosRoll * sinPitch,
        0.0, sinPitch, cosPitch
    );
}

vec4 atmosphere( vec4 sphereSurfaceWithMask, vec3 lightDirection, vec3 atmosphereColor, float haloWidth, float minAtmosphere, float maxAtmosphere, float falloff){
    vec3 absorbtion = vec3(2.0, 3.0, 4.0);
    float inverseWidth = 1.0 / haloWidth;
    float fresnelBlend = pow(1.0 - sphereSurfaceWithMask.z, falloff);
    float amount = mix(minAtmosphere, maxAtmosphere, fresnelBlend);
    vec3 normal = sphereSurfaceWithMask.xyz;
    if(sphereSurfaceWithMask.w < 0.5) {
        float haloBlend = pow(max(1.0 - sphereSurfaceWithMask.z*inverseWidth, 0.0), 5.0);
        amount = haloBlend * maxAtmosphere;
        normal = vec3(sphereSurfaceWithMask.xy, 0.0);
    }
    float light = max((dot(normal, lightDirection)+0.3)/1.3, 0.0);
    vec3 absorbedLight = vec3( pow(light, absorbtion.x), pow(light, absorbtion.y),pow(light, absorbtion.z) );
    vec3 litAtmosphere =  absorbedLight * atmosphereColor;
    return vec4(litAtmosphere, amount);
}

vec2 QuakeLavaUV(vec2 uv, float amplitude, float frequency, float speed, float time) {
    return uv + vec2(sin(uv.y * frequency + time * speed), cos(uv.x * frequency + time * speed)) * amplitude;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float shorterSide = min(iResolution.x, iResolution.y);
    float aspectRatio = iResolution.x / iResolution.y;
    vec2 offset = iResolution.x > iResolution.y ? vec2(aspectRatio, 1.0) * 0.5 : vec2(1.0, 1.0/aspectRatio) * 0.5;
        
    vec2 uv = (fragCoord / shorterSide - offset );
    float minDimension = min(iResolution.x, iResolution.y);
    float maxDimension = max(iResolution.x, iResolution.y);
    float maxAspectRatio = maxDimension / minDimension;
    vec2 aspectFactor = iResolution.x > iResolution.y ? vec2(maxAspectRatio, 1.0) : vec2(1.0, maxAspectRatio);
    
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 0.8));

    // Jupiter
    vec4 jupiterSurfaceWithMask = generateSphereSurfaceWithMask(uv + vec2(0.2, 0.15), 0.6);
    float jupiterLight = pow(max(dot(lightDirection, jupiterSurfaceWithMask.xyz), 0.0), 0.8);
    vec4 jupiterAtmosphere = atmosphere( jupiterSurfaceWithMask, lightDirection, vec3(1.0, 0.7, 0.4) * 3.0, 0.2, 0.05, 0.6, 2.0);
    float jupiterMask = clamp(jupiterSurfaceWithMask.w, 0.0, 1.0);
    mat3 jupiterRotationMatrix = createRotationMatrix(-0.2, 0.3);
    vec3 rotatedJupiter = jupiterRotationMatrix * (jupiterSurfaceWithMask.xyz * jupiterMask);
    vec2 jupiterUV = generateSphericalUV(rotatedJupiter, iTime*0.02);
    
    vec2 jTexUV = fract((jupiterUV*2.2 + vec2(0.0, 0.8))* aspectFactor)/aspectFactor;
    float jNoise = fbm(vec2(jTexUV.x * 2.0, jTexUV.y * 12.0) + vec2(iTime*0.01, 0.0));
    jNoise += fbm(vec2(jTexUV.x * 5.0, jTexUV.y * 30.0)) * 0.5;
    vec3 jupiterTexture = vec3(jNoise);
    jupiterTexture = vec3(pow(jupiterTexture.x, 3.5), pow(jupiterTexture.y, 6.0), pow(jupiterTexture.z, 8.0))*3.5;
    
    // Io
    vec4 ioSurfaceWithMask = generateSphereSurfaceWithMask(uv + vec2(-0.32, -0.2), 0.07);
    float ioLight = pow(max(dot(lightDirection, ioSurfaceWithMask.xyz), 0.0), 0.4);
    vec4 ioAtmosphere = atmosphere( ioSurfaceWithMask, lightDirection, vec3(1.0, 0.9, 0.8) * 1.5, 0.06, 0.03, 1.0, 4.0);
    float ioMask = clamp(ioSurfaceWithMask.w, 0.0, 1.0);
    mat3 ioRotationMatrix = createRotationMatrix(0.4, -0.1);
    vec3 rotatedIo = ioRotationMatrix * (ioSurfaceWithMask.xyz * ioMask);
    vec2 ioUV = generateSphericalUV(rotatedIo, -iTime*0.05);
    
    vec2 iTexUV = fract((ioUV + vec2(0.0, 0.8))* aspectFactor)/aspectFactor;
    float iNoise = fbm(iTexUV * 15.0);
    vec3 ioTexture = vec3(iNoise);
    ioTexture = vec3(min(pow(1.0 - ioTexture.x, 5.5)*2.0, 1.0));
    
    // Stars
    vec2 starUV = uv + vec2(iTime * 0.005, 0.0);
    float starNoise = hash(floor(starUV * 300.0));
    float starShape = smoothstep(0.5, 0.0, length(fract(starUV * 300.0) - 0.5));
    vec3 stars = vec3(pow(starNoise, 150.0)) * vec3(1.0, 0.6, 0.4) * 8.0 * starShape; 
    
    // Nebula
    vec2 nebulaUV = QuakeLavaUV(uv, 0.04, 0.06, 0.8, iTime);
    float nNoise = fbm(nebulaUV * 4.0);
    vec3 nebulaTexture = vec3(nNoise);
    float nabulaFade = pow(max(1.0 - uv.y, 0.0), 2.5)*0.5;
    vec3 nebulaTint =  vec3(0.9, 0.3, 0.4);
    vec3 nebula = vec3(pow(nebulaTexture.x, 2.0)) * nabulaFade * nebulaTint;
    stars += nebula;
    
    // Combining
    vec3 jupiterWithBackground = mix(stars, jupiterTexture * jupiterLight, jupiterMask);
    vec3 jupiterWithAtmosphere = mix(jupiterWithBackground, jupiterAtmosphere.xyz, jupiterAtmosphere.w);
    vec3 jupiterWithIo = mix(jupiterWithAtmosphere, ioTexture * ioLight, ioMask);
    vec3 jupiterWithIoWithAtmosphere = mix(jupiterWithIo, ioAtmosphere.xyz, ioAtmosphere.w);
    
    vec2 overlayUV = fragCoord.xy/ iResolution.xy;
    vec3 overlayColor = mix(0.3, 0.9, pow(overlayUV.x, 1.7)) * vec3(1.0, 0.35, 0.1)*1.4;
    vec3 imageWithOverlay = mix(jupiterWithIoWithAtmosphere, overlayColor, pow(1.0 - overlayUV.y*0.5, 5.0)*0.7 + 0.1);

    fragColor = vec4(imageWithOverlay, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function SpacePanicShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) return;

    const program = link(gl, vs, fs);
    if (!program) return;
    
    gl.useProgram(program);

    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");

    let ro: ResizeObserver | null = null;
    const applySize = () => {
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    ro = new ResizeObserver(() => applySize());
    ro.observe(canvas);
    applySize();

    let raf = 0;
    let start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;
      gl.useProgram(program);
      applySize();

      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      if (uRes) gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      if (uTime) gl.uniform1f(uTime, t);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ background: "black" }}
    />
  );
}
