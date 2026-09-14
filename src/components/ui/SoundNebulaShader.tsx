import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SoundNebulaShaderProps {
  dominantSoundId: string | null;
}

export function SoundNebulaShader({ dominantSoundId }: SoundNebulaShaderProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // We map the dominant sound to a specific color and speed.
  const config = useMemo(() => {
    switch (dominantSoundId) {
      case 'chuva': return { color: new THREE.Color(0.2, 0.5, 0.9), speed: 0.8, noiseScale: 1.5, type: 0.0 };
      case 'vento': return { color: new THREE.Color(0.8, 0.9, 1.0), speed: 1.2, noiseScale: 0.8, type: 1.0 };
      case 'lareira': return { color: new THREE.Color(1.0, 0.4, 0.1), speed: 0.5, noiseScale: 2.0, type: 2.0 };
      case 'agua': return { color: new THREE.Color(0.0, 0.6, 0.8), speed: 0.6, noiseScale: 1.2, type: 3.0 };
      case 'passaros': return { color: new THREE.Color(0.3, 0.8, 0.4), speed: 0.4, noiseScale: 1.0, type: 4.0 };
      case 'natureza': return { color: new THREE.Color(0.1, 0.6, 0.2), speed: 0.3, noiseScale: 1.1, type: 4.0 };
      case 'branco': return { color: new THREE.Color(0.9, 0.9, 0.9), speed: 1.0, noiseScale: 3.0, type: 5.0 };
      case 'rosa': return { color: new THREE.Color(1.0, 0.5, 0.7), speed: 0.7, noiseScale: 2.5, type: 5.0 };
      case 'marrom': return { color: new THREE.Color(0.6, 0.4, 0.2), speed: 0.4, noiseScale: 4.0, type: 5.0 };
      default: return { color: new THREE.Color(0.3, 0.3, 0.5), speed: 0.2, noiseScale: 1.0, type: 0.0 };
    }
  }, [dominantSoundId]);

  const targetColorRef = useRef(config.color);
  const currentColorRef = useRef(config.color.clone());

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Interpolate colors smoothly when sound changes
      targetColorRef.current = config.color;
      currentColorRef.current.lerp(targetColorRef.current, 0.05);
      material.uniforms.uBaseColor.value.copy(currentColorRef.current);
      
      // Interpolate speed
      material.uniforms.uSpeed.value = THREE.MathUtils.lerp(material.uniforms.uSpeed.value, config.speed, 0.05);
      material.uniforms.uType.value = THREE.MathUtils.lerp(material.uniforms.uType.value, config.type, 0.05);
    }
  });

  const particleCount = 25000;
  
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const rnd = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      rnd[i] = Math.random();
    }
    return [pos, rnd];
  }, [particleCount]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: currentColorRef.current },
        uSpeed: { value: config.speed },
        uType: { value: config.type }, // To drive different animation logic based on sound
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uType;
        
        attribute float randoms;
        varying vec3 vColor;
        varying float vAlpha;

        // Simplex 3D Noise (simplified)
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_*ns.x + ns.yyyy;
          vec4 y = y_*ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vec3 pos = position;
            float t = uTime * uSpeed;
            
            // Base turbulent noise for all sounds
            float noiseX = snoise(vec3(pos.x, pos.y, t * 0.5));
            float noiseY = snoise(vec3(pos.y, pos.z, t * 0.5));
            float noiseZ = snoise(vec3(pos.z, pos.x, t * 0.5));
            
            // Movement logic driven by uType
            if (uType < 0.5) {
                // Rain (falling down, blueish)
                pos.y -= mod(t * 3.0 + randoms * 10.0, 6.0) - 3.0;
                pos.x += noiseX * 0.2;
            } else if (uType < 1.5) {
                // Wind (sweeping horizontally)
                pos.x += mod(t * 4.0 + randoms * 5.0, 6.0) - 3.0;
                pos.y += noiseY * 0.5;
                pos.z += noiseZ * 0.5;
            } else if (uType < 2.5) {
                // Fire (rising up, chaotic)
                pos.y += mod(t * 2.0 + randoms * 5.0, 6.0) - 3.0;
                pos.x += noiseX * 0.8;
                pos.z += noiseY * 0.8;
            } else if (uType < 3.5) {
                // Water (wavy, pulsating)
                pos.y += sin(pos.x * 2.0 + t) * 0.5;
                pos.x += cos(pos.y * 2.0 + t) * 0.5;
            } else {
                // Birds/Nature/Noise (Swirling organic quantum nebula)
                vec3 curl = vec3(
                    snoise(vec3(pos.x, pos.y, t)),
                    snoise(vec3(pos.y, pos.z, t)),
                    snoise(vec3(pos.z, pos.x, t))
                );
                pos += curl * 0.5;
            }

            // Wrap around
            pos.x = mod(pos.x + 3.0, 6.0) - 3.0;
            pos.y = mod(pos.y + 3.0, 6.0) - 3.0;
            pos.z = mod(pos.z + 3.0, 6.0) - 3.0;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (15.0 * randoms + 5.0) * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            vAlpha = (1.0 - smoothstep(0.0, 3.0, length(pos))) * (0.3 + 0.7 * randoms);
        }
      `,
      fragmentShader: `
        uniform vec3 uBaseColor;
        varying float vAlpha;
        
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Soft glow
            float alpha = (0.5 - dist) * 2.0 * vAlpha;
            
            gl_FragColor = vec4(uBaseColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randoms"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}
