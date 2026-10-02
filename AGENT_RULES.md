# 🚀 DIRETRIZ DE ARQUITETURA TÉCNICA E PWA: TEA SoundScapes (React Web)

**Atenção Agente Antigravity:** Este documento é a sua **Diretriz Estrita de Arquitetura**. Você é o engenheiro responsável por manter e evoluir o ecossistema "TEA SoundScapes" como um aplicativo Web progressivo (PWA) em React/Vite. Siga estritamente as regras de isolamento de estado, temas e renderização aqui definidas.

---

## 1. Arquitetura e Roteamento (React Web PWA)

A interface atual web é baseada em manipulação de estado (`currentView`, `subView`) e componentes HTML semânticos. Para a arquitetura, você deve adotar uma abordagem estritamente voltada para componentes móveis e roteamento em pilha (Stack).

### 1.1 Primitivas de UI e Componentização
O aplicativo utiliza primitivas HTML semânticas (`<div>`, `<section>`, `<button>`, `<input>`, `<textarea>`) estilizadas rigorosamente com Tailwind CSS. Mantenha a acessibilidade nativa da web e garanta que os botões tenham feedback visual claro.

### 1.2 Roteamento (Roteamento Web)
O roteamento é feito de forma leve através de manipulação de estado (`currentView`, `subView`). O app funciona como um Single Page Application (SPA).

- **Telas Principais (Views):** HomeView, DiaryView, CommunityView, ProfileView e GuardianView.
- **Modals/Overlays:** `PanicOverlay`, `EmergencySmsOverlay` e `GuardianAlertOverlay` são renderizados condicionalmente com `z-index` altíssimo e `AnimatePresence` do `framer-motion` para se sobreporem a toda a aplicação imediatamente.

### 1.3 A Tela Guardião (`GuardianView.tsx`)
A aba "Guardião" (Rede de Apoio e Disparo de Emergência) é a **segunda aba principal** do aplicativo (junto com Home, Diário, Social e Perfil).
Ela possui regras estritas baseadas no Modo Atual (Adulto vs Infantil):
- **Modo Adulto:** Interface extremamente "clean", escura (Slate 950), orientada a acessibilidade para acionamento rápido de mensagens de ajuda e gerenciamento de contatos.
- **Modo Infantil:** A interface é coberta por animações imersivas dependendo do tema:
  - **Tema Espaço Sideral:** `SpaceBloomShader` como fundo imersivo.
  - **Tema Dinossauro:** `MistyLakeShader` como fundo ambiental.
  - **Tema Carros (Semáforo Inteligente):** A tela Guardião não usa um Shader 3D tradicional aqui. Em vez disso, ela é um "Semáforo Inteligente" acoplado ao microfone (`HTML5 Audio / Web Audio API`). 
  - **Estética & Layout:** Fundo asfalto (cinza super escuro). Utiliza formas geométricas limpas lembrando um poste/semáforo (borda preta arredondada com as 3 lentes).
  - **Luz Verde (Ruído Seguro):** Verde neon brilhante (`#22c55e` ou similar) pulsando suavemente com brilho externo (Glow).
  - **Luz Amarela (Atenção):** Amarelo vibrante (`#eab308`), aciona quando o ruído ambiente passa de 40dB.
  - **Luz Vermelha (Perigo):** Vermelho sangue intenso (`#ef4444`), aciona aos 70dB ou mais, e aciona o redirecionamento imediato para a tela SOS Pânico.


### 1.4 Regra de Ouro: Isolamento de Modos (Adulto vs Infantil)
**Tolerância ZERO para State Leakage.** 
O Modo Adulto é minimalista e escuro. O Modo Infantil é temático e lúdico. Ao realizar logout ou trocar de perfil, o estado do Redux/Zustand ou Context API DEVE ser redefinido (`initialState`). A árvore de navegação DEVE sofrer um `reset()`. Cores de fundo infantis não podem, sob nenhuma circunstância, "vazar" para o layout adulto.


### 1.5 Estilização e Animações (Crítico)
O projeto utiliza **TailwindCSS** para estilização. As animações, transições fluidas e *keyframes* são feitas OBRIGATORIAMENTE usando **`framer-motion`** (como `<motion.div>`), garantindo uma UI suave e responsiva.

---

## 2. Detalhamento Faltante: Aba Guardião e Animações Contextuais

Abaixo estão as diretrizes arquiteturais para recursos visuais avançados que DEVEM existir no PWA, abordando telas essenciais da navegação e efeitos customizados.

### 2.1 Tela SOS Pânico (`PanicOverlay.tsx`) - Animações do Tema Carros
Na tela de emergência do Modo Infantil, a criança é guiada por exercícios respiratórios ("Inspire... Segure... Expire...").
- **Tema Carros (Pista Infinita):** A tela SOS Pânico simula o interior de um carro à noite numa rodovia.
  - **Cores & Estilos (Dashboard):** Elementos em laranja fluorescente, azul painel e preto brilhante. As luzes de RPM e velocidade ditam o ritmo da respiração.
  - **Background Animado:** Rodovia/pistas com faixas pontilhadas amarelas/brancas em translação rápida simulando alta velocidade.
  - **Diretriz de Migração:** Utilizando `framer-motion`, mantenha `animate` com `repeat: Infinity` para manter a pista em movimento contínuo. As luzes do "velocímetro/RPM" devem preencher (scale/opacity) do verde ao laranja acompanhando perfeitamente a fase da respiração da criança ("Inspire... Expire...").

### 2.2 Animações do Player Interno (Aba Social / Comunidade)
A Aba Social (`CommunityView`) possui um *Player Interno* exibido no rodapé ao reproduzir um Mixer de Áudio compartilhado por outro usuário.
- **Equalizador Dinâmico:** Quando ativo, a UI pulsa barras de equalizador (coloridas de acordo com a "Cor de Destaque" do mix selecionado).
- **Glow Ativo:** O ícone do áudio em reprodução pisca e expande ondas concêntricas (efeito *ripple*). 
- **Diretriz de Migração:** A lógica de estado que aciona as barras do equalizador e os anéis concêntricos foi feita em Framer Motion na Web. Na Web, mantenha o uso do Framer Motion acionando múltiplos estados para garantir que o player pulse suavemente em 60fps na base da tela sem travar a navegação pela lista da comunidade.


### 2.3 Modificação Exclusiva: Mixer "Ruído Rosa" (Player Interno - Modo Infantil)
O Mixer de "Ruído Rosa" (Pink Noise), quando acionado no **Player Interno da Aba Home no Modo Infantil**, possui comportamentos exclusivos de Engenharia que o diferem das demais faixas:
1. **Síntese Matemática (Audio Engine):** Em vez de tocar apenas um arquivo MP3 estático como os outros sons, o Ruído Rosa web possui uma rotina algorítmica própria que o sintetiza em tempo real para fins terapêuticos perfeitos (usando os filtros de Paul Kellet: `b0 = 0.99886 * b0 + white * 0.0555179`, etc.). O agente deve garantir que, se for reescrever o motor de áudio, preserve essa fidelidade acústica, pois é crucial para o conforto sensorial de usuários com TEA.
2. **Shader Dinâmico e Interativo:** O visualizador atrelado à faixa rosa (`PinkNoiseShader.tsx`) possui um sistema de simulação de partículas responsivo (`baseHue: 330` - tons magenta/rosa brilhantes) com "bloom passes". Este shader interativo sobrepõe as telas do Modo Infantil enquanto o Ruído Rosa for o som dominante. 

---


## 3. Diretriz Crítica de Shaders e WebGL

O aplicativo web depende fortemente de shaders extraídos do Shadertoy/21st.dev para relaxamento e foco.

**Comando de Execução:** Você OBRIGATORIAMENTE utilizará `@react-three/fiber` (versão web) e `three` padrão.

Os códigos GLSL originais (Vertex e Fragment shaders) devem ser **preservados** e injetados em um `THREE.ShaderMaterial`.

Abaixo estão os códigos fontes exatos utilizados no front-end web atual. Extraia os shaders e reescreva o "wrapper" React para utilizar as primitivas nativas.

### Arquivo Original Web: `MistyLakeShader.tsx`
```tsx
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

// Misty Lake. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MsB3WR
//

#define BUMPFACTOR 0.1
#define EPSILON 0.1
#define BUMPDISTANCE 60.

#define time (iTime+285.)

// We don't have iChannel0/iChannel1 textures in this setup out of the box,
// but the original shader relies heavily on them. Let's substitute texture lookups
// with a procedural 3D noise (value noise) or simple fbm so it still works.

float hash( in float n ) {
    return fract(sin(n)*43758.5453);
}

// Procedural 2D noise for substitution
float noise2( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0;
	return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
	           mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
}

// Procedural 3D noise for substitution
float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

// Overload for noise2 to mimic the textureLod lookup
float noise( const in vec2 x ) {
    return noise2(x);
}


mat2 rot(const in float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));	
}

const mat2 m2 = mat2( 0.60, -0.80, 0.80, 0.60 );

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm( in vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

// intersection functions

bool intersectPlane(const in vec3 ro, const in vec3 rd, const in float height, inout float dist) {	
	if (rd.y==0.0) {
		return false;
	}
		
	float d = -(ro.y - height)/rd.y;
	d = min(100000.0, d);
	if( d > 0. && d < dist ) {
		dist = d;
		return true;
    } else {
		return false;
	}
}

// light direction

vec3 lig = normalize(vec3( 0.3,0.5, 0.6));

vec3 bgColor( const in vec3 rd ) {
	float sun = clamp( dot(lig,rd), 0.0, 1.0 );
	vec3 col = vec3(0.5, 0.52, 0.55) - rd.y*0.2*vec3(1.0,0.8,1.0) + 0.15*0.75;
	col += vec3(1.0,.6,0.1)*pow( sun, 8.0 );
	col *= 0.95;
	return col;
}

// coulds functions by inigo quilez

#define CLOUDSCALE (500./(64.*0.03))

float cloudMap( const in vec3 p, const in float ani ) {
	vec3 r = p/CLOUDSCALE;

	float den = -1.8+cos(r.y*5.-4.3);
		
	float f;
	vec3 q = 2.5*r*vec3(0.75,1.0,0.75)  + vec3(1.0,2.0,1.0)*ani*0.15;
    f  = 0.50000*noise( q ); q = q*2.02 - vec3(-1.0,1.0,-1.0)*ani*0.15;
    f += 0.25000*noise( q ); q = q*2.03 + vec3(1.0,-1.0,1.0)*ani*0.15;
    f += 0.12500*noise( q ); q = q*2.01 - vec3(1.0,1.0,-1.0)*ani*0.15;
    f += 0.06250*noise( q ); q = q*2.02 + vec3(1.0,1.0,1.0)*ani*0.15;
    f += 0.03125*noise( q );
	
	return 0.065*clamp( den + 4.4*f, 0.0, 1.0 );
}

vec3 raymarchClouds( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in vec3 fgc, const in float startdist, const in float maxdist, const in float ani ) {
    // dithering	
	float t = startdist+CLOUDSCALE*0.02*hash(rd.x+35.6987221*rd.y+time);//0.1*texture( iChannel0, fragCoord.xy/iResolution.x ).x;
	
    // raymarch	
	vec4 sum = vec4( 0.0 );
	for( int i=0; i<64; i++ ) {
		if( sum.a > 0.99 || t > maxdist ) continue;
		
		vec3 pos = ro + t*rd;
		float a = cloudMap( pos, ani );

        // lighting	
		float dif = clamp(0.1 + 0.8*(a - cloudMap( pos + lig*0.15*CLOUDSCALE, ani )), 0., 0.5);
		vec4 col = vec4( (1.+dif)*fgc, a );
		
		col.rgb *= col.a;
		sum = sum + col*(1.0 - sum.a);	

        // advance ray with LOD
		t += (0.03*CLOUDSCALE)+t*0.012;
	}

    // blend with background	
	sum.xyz = mix( bgc, sum.xyz/(sum.w+0.0001), sum.w );
	
	return clamp( sum.xyz, 0.0, 1.0 );
}

// terrain functions
float terrainMap( const in vec3 p ) {
    // Replaced textureLod with procedural fbm
    float base = noise2((-p.zx*m2)*0.01); 
	return (base*300.) * smoothstep( 820., 1000., length(p.xz) ) - 2. + noise(p.xz*0.5)*15.;
}

vec3 raymarchTerrain( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in float startdist, inout float dist ) {
	float t = startdist;

    // raymarch	
	vec4 sum = vec4( 0.0 );
	bool hit = false;
	vec3 col = bgc;
	
	for( int i=0; i<80; i++ ) {
		if( hit ) break;
		
		t += 8. + t/300.;
		vec3 pos = ro + t*rd;
		
		if( pos.y < terrainMap(pos) ) {
			hit = true;
		}		
	}
	if( hit ) {
		// binary search for hit		
		float dt = 4.+t/400.;
		t -= dt;
		
		vec3 pos = ro + t*rd;	
		t += (0.5 - step( pos.y , terrainMap(pos) )) * dt;		
		for( int j=0; j<2; j++ ) {
			pos = ro + t*rd;
			dt *= 0.5;
			t += (0.5 - step( pos.y , terrainMap(pos) )) * dt;
		}
		pos = ro + t*rd;
		
		vec3 dx = vec3( 100.*EPSILON, 0., 0. );
		vec3 dz = vec3( 0., 0., 100.*EPSILON );
		
		vec3 normal = vec3( 0., 0., 0. );
		normal.x = (terrainMap(pos + dx) - terrainMap(pos-dx) ) / (200. * EPSILON);
		normal.z = (terrainMap(pos + dz) - terrainMap(pos-dz) ) / (200. * EPSILON);
		normal.y = 1.;
		normal = normalize( normal );		

        // procedural replacement for texture iChannel2
		vec3 texColor = vec3(noise2(pos.xz * 0.1), noise2(pos.xz * 0.11), noise2(pos.xz * 0.12));
		col = vec3(0.2) + 0.7*texColor * vec3(1.,.9,0.6);
		
		float veg = 0.3*fbm(pos*0.2)+normal.y;
					
		if( veg > 0.75 ) {
			col = vec3( 0.45, 0.6, 0.3 )*(0.5+0.5*fbm(pos*0.5))*0.6;
		} else 
		if( veg > 0.66 ) {
			col = col*0.6+vec3( 0.4, 0.5, 0.3 )*(0.5+0.5*fbm(pos*0.25))*0.3;
		}
		col *= vec3(0.5, 0.52, 0.65)*vec3(1.,.9,0.8);
		
		vec3 brdf = col;
		
		float diff = clamp( dot( normal, -lig ), 0., 1.);
		
		col = brdf*diff*vec3(1.0,.6,0.1);
		col += brdf*clamp( dot( normal, lig ), 0., 1.)*vec3(0.8,.6,0.5)*0.8;
		col += brdf*clamp( dot( normal, vec3(0.,1.,0.) ), 0., 1.)*vec3(0.8,.8,1.)*0.2;
		
		dist = t;
		t -= pos.y*3.5;
		col = mix( col, bgc, 1.0-exp(-0.0000005*t*t) );
		
	}
	return col;
}

float waterMap( vec2 pos ) {
	vec2 posm = pos * m2;
	
	return abs( fbm( vec3( 8.*posm, time ))-0.5 )* 0.1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
	
	// camera parameters
	vec3 ro = vec3(0.0, 0.5, 0.0);
	vec3 ta = vec3(0.0, 0.45,1.0);
    // Removed iMouse
		
	ta.xz *= rot( mod(iTime * 0.05, 6.2831852) );
    
	// build ray
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.5*ww );

	float fresnel, refldist = 5000., maxdist = 5000.;
	bool reflected = false;
	vec3 normal, col = bgColor( rd );
	vec3 roo = ro, rdo = rd, bgc = col;
	
	if( intersectPlane( ro, rd, 0., refldist ) && refldist < 200. ) {
		ro += refldist*rd;	
		vec2 coord = ro.xz;
		float bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, refldist) );
				
		vec2 dx = vec2( EPSILON, 0. );
		vec2 dz = vec2( 0., EPSILON );
		
		normal = vec3( 0., 1., 0. );
		normal.x = -bumpfactor * (waterMap(coord + dx) - waterMap(coord-dx) ) / (2. * EPSILON);
		normal.z = -bumpfactor * (waterMap(coord + dz) - waterMap(coord-dz) ) / (2. * EPSILON);
		normal = normalize( normal );		
		
		float ndotr = dot(normal,rd);
		fresnel = pow(1.0-abs(ndotr),5.);

		rd = reflect( rd, normal);

		reflected = true;
		bgc = col = bgColor( rd );
	}

	col = raymarchTerrain( ro, rd, col, reflected?(800.-refldist):800., maxdist );
    col = raymarchClouds( ro, rd, col, bgc, reflected?max(0.,min(150.,(150.-refldist))):150., maxdist, time*0.05 );
	
	if( reflected ) {
		col = mix( col.xyz, bgc, 1.0-exp(-0.0000005*refldist*refldist) );
		col *= fresnel*0.9;		
		vec3 refr = refract( rdo, normal, 1./1.3330 );
		intersectPlane( ro, refr, -2., refldist );
        vec3 texColor = vec3(noise2((roo+refldist*refr).xz*0.13), noise2((roo+refldist*refr).xz*0.14), noise2((roo+refldist*refr).xz*0.15));
		col += mix( texColor * 
				   vec3(1.,.9,0.6), vec3(1.,.9,0.8)*0.5, clamp( refldist / 3., 0., 1.) ) 
			   * (1.-fresnel)*0.125;
	}
	
	col = pow( col, vec3(0.7) );
	
	// contrast, saturation and vignetting	
	col = col*col*(3.0-2.0*col);
    col = mix( col, vec3(dot(col,vec3(0.33))), -0.5 );
 	col *= 0.25 + 0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );
	
    col *= 0.4; // Reduz o brilho geral
    fragColor = vec4( col, 1.0 );
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export function MistyLakeShader() {
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

```

### Arquivo Original Web: `NightCloudsShader.tsx`
```tsx
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
#define STEPS        72      // primary samples
#define LIGHT_STEPS  3       // shadow samples toward moon
#define LIGHT_STEP   0.60    // first shadow probe; spacing doubles each tap
#define STEP_NEAR    0.175    // sample spacing at the camera
#define STEP_GROW    0.025   // spacing growth per unit of depth
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

```

### Arquivo Original Web: `PinkNoiseShader.tsx`
```tsx
// @ts-nocheck
import React, { useRef, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION OBJECT V3.0 ---
// This version focuses on a dynamic, interactive particle system.
const config = {
    // Particle system properties
    particles: {
        count: 50000, // Number of particles in the simulation
        size: 0.02,   // Base size of each particle
        boxSize: 5,   // The cubic volume where particles are generated
    },
    // Colors for the scene
    colors: {
        // Using HSL for easier color manipulation and vibrant results
        baseHue: 330, // Base hue for particles (330 is pink/magenta)
        hueVariance: 40, // How much the hue can vary between particles
    },
    // Animation and simulation properties
    simulation: {
        // Curl noise parameters for organic, swirling motion
        noiseSpeed: 0.1,
        noiseScale: 1.2,
        // How strongly the particles are pushed away from the mouse
        mouseRepulsion: 0.005,
        // How quickly particles return to their original path
        friction: 0.95,
    },
    // Post-processing bloom effect for the glow
    bloom: {
        strength: 0.6, // Intensity of the glow
        radius: 0.4,   // How far the glow spreads
        threshold: 0.1,// Brightness threshold to trigger the bloom
    },
    // Camera settings
    camera: {
        initialDistance: 5,
        parallaxIntensity: 0.005,
    }
};

// v3.0: Interactive Particle Nebula Scene
export default function PinkNoiseShader() {
    const mountRef = useRef(null);
    // Refs for Three.js objects that need to be accessed across renders
    const rendererRef = useRef(null);
    const composerRef = useRef(null);
    const cameraRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0)); // Using a Vector2 for mouse position

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- CORE THREE.JS & POST-PROCESSING SETUP ---

        // 1. Scene and Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = config.camera.initialDistance;
        cameraRef.current = camera;

        // 2. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);

        // 3. Post-Processing Composer for Bloom Effect
        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), config.bloom.strength, config.bloom.radius, config.bloom.threshold);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
        composerRef.current = composer;


        // --- PARTICLE SYSTEM CREATION ---
        const particleCount = config.particles.count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3).fill(0); // For physics simulation
        const baseColor = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position particles randomly within a box
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 1] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 2] = (Math.random() - 0.5) * config.particles.boxSize;

            // Assign a unique, vibrant color to each particle
            const hue = (config.colors.baseHue + (Math.random() - 0.5) * config.colors.hueVariance) / 360;
            baseColor.setHSL(hue, 1.0, 0.6);
            colors[i3] = baseColor.r;
            colors[i3 + 1] = baseColor.g;
            colors[i3 + 2] = baseColor.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // --- SHADER MATERIAL FOR PARTICLES ---
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_pointSize: { value: config.particles.size * renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 color;
                varying vec3 vColor;
                uniform float u_pointSize;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = u_pointSize * (10.0 / -mvPosition.z); // Make particles appear smaller further away
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    // Create a soft, circular shape for each particle
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - step(0.5, strength);
                    if (strength < 0.01) discard; // Discard transparent fragments for performance

                    gl_FragColor = vec4(vColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending, // Brightens where particles overlap
            depthWrite: false, // Important for correct blending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);


        // --- ANIMATION & SIMULATION LOOP ---
        let frameId;
        const clock = new THREE.Clock();

        // --- CPU-based Particle Simulation ---
        const curlNoiseFn = (p, speed, scale) => {
            // A simplified JS curl noise is still too slow. We will simulate forces directly.
            const noiseVec = new THREE.Vector3(
                Math.sin(p.y * scale + speed),
                Math.cos(p.z * scale + speed),
                Math.sin(p.x * scale + speed)
            ).normalize();
            return noiseVec;
        };


        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            
            // --- AUDIO REACTIVITY (Simulated Pink Noise) ---
            // Pink noise has equal energy per octave, producing a waterfall-like effect.
            // We simulate audio peaks using a combination of sine waves and procedural noise.
            const pinkNoisePulse = 1.0 + (Math.sin(elapsedTime * 8.0) * 0.1 + Math.sin(elapsedTime * 4.1) * 0.2 + Math.random() * 0.15) * 1.5;
            
            // Apply it to the material uniforms to pulse the particles
            particleMaterial.uniforms.u_pointSize.value = config.particles.size * renderer.getPixelRatio() * pinkNoisePulse * 1.5;

            const positions = particleSystem.geometry.attributes.position.array;
            
            // Update each particle's position based on forces
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                
                // 1. Curl Noise Force for swirling
                const curlForce = curlNoiseFn(p, elapsedTime * config.simulation.noiseSpeed, config.simulation.noiseScale);
                
                // 2. Mouse Repulsion Force
                const mouseForce = new THREE.Vector3();
                const mouseTarget = new THREE.Vector3(mouseRef.current.x * (config.particles.boxSize / 2), mouseRef.current.y * (config.particles.boxSize / 2), 0);
                const distanceToMouse = p.distanceTo(mouseTarget);
                if (distanceToMouse < 2) { // Only react if close to the mouse
                    mouseForce.subVectors(p, mouseTarget).normalize().multiplyScalar(1 / (distanceToMouse + 0.1));
                }

                // Update velocity
                velocities[i3] += (curlForce.x * 0.001 + mouseForce.x * config.simulation.mouseRepulsion);
                velocities[i3 + 1] += (curlForce.y * 0.001 + mouseForce.y * config.simulation.mouseRepulsion);
                velocities[i3 + 2] += (curlForce.z * 0.001 + mouseForce.z * config.simulation.mouseRepulsion);
                
                // Apply friction
                velocities[i3] *= config.simulation.friction;
                velocities[i3 + 1] *= config.simulation.friction;
                velocities[i3 + 2] *= config.simulation.friction;

                // Update position
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Boundary check: wrap particles around the box
                if (Math.abs(positions[i3]) > config.particles.boxSize / 2) positions[i3] *= -1;
                if (Math.abs(positions[i3+1]) > config.particles.boxSize / 2) positions[i3+1] *= -1;
                if (Math.abs(positions[i3+2]) > config.particles.boxSize / 2) positions[i3+2] *= -1;
            }

            particleSystem.geometry.attributes.position.needsUpdate = true; // Crucial!

            // Camera Parallax
            camera.position.x += (mouseRef.current.x * config.camera.parallaxIntensity - camera.position.x) * 0.02;
            camera.position.y += (-mouseRef.current.y * config.camera.parallaxIntensity - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Use the composer to render the scene with post-processing
            composer.render();
            frameId = requestAnimationFrame(animate);
        };
        animate();


        // --- EVENT HANDLERS & CLEANUP ---
        const handleResize = () => {
            const w = currentMount.clientWidth;
            const h = currentMount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            particleGeometry.dispose();
            particleMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
}

```

### Arquivo Original Web: `quantum-nebula.tsx`
```tsx
// @ts-nocheck
import React, { useRef, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION OBJECT V3.0 ---
// This version focuses on a dynamic, interactive particle system.
const config = {
    // Particle system properties
    particles: {
        count: 50000, // Number of particles in the simulation
        size: 0.02,   // Base size of each particle
        boxSize: 5,   // The cubic volume where particles are generated
    },
    // Colors for the scene
    colors: {
        // Using HSL for easier color manipulation and vibrant results
        baseHue: 200, // Base hue for particles (200 is a cyan/blue)
        hueVariance: 20, // How much the hue can vary between particles
    },
    // Animation and simulation properties
    simulation: {
        // Curl noise parameters for organic, swirling motion
        noiseSpeed: 0.1,
        noiseScale: 1.2,
        // How strongly the particles are pushed away from the mouse
        mouseRepulsion: 0.005,
        // How quickly particles return to their original path
        friction: 0.95,
    },
    // Post-processing bloom effect for the glow
    bloom: {
        strength: 0.6, // Intensity of the glow
        radius: 0.4,   // How far the glow spreads
        threshold: 0.1,// Brightness threshold to trigger the bloom
    },
    // Camera settings
    camera: {
        initialDistance: 5,
        parallaxIntensity: 0.005,
    }
};

// v3.0: Interactive Particle Nebula Scene
export default function GenerativeArtSceneV3() {
    const mountRef = useRef(null);
    // Refs for Three.js objects that need to be accessed across renders
    const rendererRef = useRef(null);
    const composerRef = useRef(null);
    const cameraRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0)); // Using a Vector2 for mouse position

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- CORE THREE.JS & POST-PROCESSING SETUP ---

        // 1. Scene and Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = config.camera.initialDistance;
        cameraRef.current = camera;

        // 2. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);

        // 3. Post-Processing Composer for Bloom Effect
        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), config.bloom.strength, config.bloom.radius, config.bloom.threshold);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
        composerRef.current = composer;


        // --- PARTICLE SYSTEM CREATION ---
        const particleCount = config.particles.count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3).fill(0); // For physics simulation
        const baseColor = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position particles randomly within a box
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 1] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 2] = (Math.random() - 0.5) * config.particles.boxSize;

            // Assign a unique, vibrant color to each particle
            const hue = (config.colors.baseHue + (Math.random() - 0.5) * config.colors.hueVariance) / 360;
            baseColor.setHSL(hue, 1.0, 0.6);
            colors[i3] = baseColor.r;
            colors[i3 + 1] = baseColor.g;
            colors[i3 + 2] = baseColor.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // --- SHADER MATERIAL FOR PARTICLES ---
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_pointSize: { value: config.particles.size * renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 color;
                varying vec3 vColor;
                uniform float u_pointSize;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = u_pointSize * (10.0 / -mvPosition.z); // Make particles appear smaller further away
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    // Create a soft, circular shape for each particle
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - step(0.5, strength);
                    if (strength < 0.01) discard; // Discard transparent fragments for performance

                    gl_FragColor = vec4(vColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending, // Brightens where particles overlap
            depthWrite: false, // Important for correct blending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);


        // --- ANIMATION & SIMULATION LOOP ---
        let frameId;
        const clock = new THREE.Clock();

        // --- CPU-based Particle Simulation ---
        const curlNoiseFn = (p, speed, scale) => {
            // A simplified JS curl noise is still too slow. We will simulate forces directly.
            const noiseVec = new THREE.Vector3(
                Math.sin(p.y * scale + speed),
                Math.cos(p.z * scale + speed),
                Math.sin(p.x * scale + speed)
            ).normalize();
            return noiseVec;
        };


        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const positions = particleSystem.geometry.attributes.position.array;
            
            // Update each particle's position based on forces
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                
                // 1. Curl Noise Force for swirling
                const curlForce = curlNoiseFn(p, elapsedTime * config.simulation.noiseSpeed, config.simulation.noiseScale);
                
                // 2. Mouse Repulsion Force
                const mouseForce = new THREE.Vector3();
                const mouseTarget = new THREE.Vector3(mouseRef.current.x * (config.particles.boxSize / 2), mouseRef.current.y * (config.particles.boxSize / 2), 0);
                const distanceToMouse = p.distanceTo(mouseTarget);
                if (distanceToMouse < 2) { // Only react if close to the mouse
                    mouseForce.subVectors(p, mouseTarget).normalize().multiplyScalar(1 / (distanceToMouse + 0.1));
                }

                // Update velocity
                velocities[i3] += (curlForce.x * 0.001 + mouseForce.x * config.simulation.mouseRepulsion);
                velocities[i3 + 1] += (curlForce.y * 0.001 + mouseForce.y * config.simulation.mouseRepulsion);
                velocities[i3 + 2] += (curlForce.z * 0.001 + mouseForce.z * config.simulation.mouseRepulsion);
                
                // Apply friction
                velocities[i3] *= config.simulation.friction;
                velocities[i3 + 1] *= config.simulation.friction;
                velocities[i3 + 2] *= config.simulation.friction;

                // Update position
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Boundary check: wrap particles around the box
                if (Math.abs(positions[i3]) > config.particles.boxSize / 2) positions[i3] *= -1;
                if (Math.abs(positions[i3+1]) > config.particles.boxSize / 2) positions[i3+1] *= -1;
                if (Math.abs(positions[i3+2]) > config.particles.boxSize / 2) positions[i3+2] *= -1;
            }

            particleSystem.geometry.attributes.position.needsUpdate = true; // Crucial!

            // Camera Parallax
            camera.position.x += (mouseRef.current.x * config.camera.parallaxIntensity - camera.position.x) * 0.02;
            camera.position.y += (-mouseRef.current.y * config.camera.parallaxIntensity - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Use the composer to render the scene with post-processing
            composer.render();
            frameId = requestAnimationFrame(animate);
        };
        animate();


        // --- EVENT HANDLERS & CLEANUP ---
        const handleResize = () => {
            const w = currentMount.clientWidth;
            const h = currentMount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            particleGeometry.dispose();
            particleMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
}

```

### Arquivo Original Web: `SoundNebulaShader.tsx`
```tsx
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

```



---

## 4. Banco de Dados e Persistência Local

1. **Preferências Simples (KV Storage):** Para configurações, temas, nome do usuário, permissões, utilize **`localStorage`** ou **`IndexedDB`** para acesso síncrono e veloz.
2. **Dados Estruturados e Diários (SQLite):** Todo o histórico de humor, métricas de sono, anotações de diário e "Resumos Gerados por IA" devem ser migrados do `IndexedDB` para um banco de dados no navegador (IndexedDB).
   - Utilize a biblioteca **`web-sqlite`**.
   - **Esquema Básico Esperado (`diary_entries`):**
     - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
     - `user_email` (TEXT - para garantir o isolamento multitenant no dispositivo)
     - `date` (TEXT - ISO String)
     - `mood` (TEXT - 'happy', 'neutral', 'overwhelmed', etc.)
     - `sleep_hours` (REAL)
     - `text_entry` (TEXT)
     - `gemini_summary` (TEXT - o insight gerado pela IA)

---

## 4. Integração Gemini API (Análise de Diário e Regulação)

As chamadas ao Gemini (via `@google/genai`) são a espinha dorsal do suporte psicológico da aplicação (análise de crise, insights diários).

**Estratégia de Integração:**
- **Local da Chamada:** As requisições para resumir a semana do usuário ou analisar entradas de diário devem ocorrer preferencialmente através de um gateway/backend server (API routes, Cloud Functions).
- **Fallback Client-side (Se estritamente necessário no MVP):** Caso você deva acionar diretamente do app Web/PWA, você utilizará a API `fetch` padrão do React Web, conectando ao REST endpoint do Gemini (ou usando a SDK TypeScript) enviando o prompt instrucional de "Aja como um psicoterapeuta especialista em neurodivergência".
- **Gestão de Chaves:** Em NENHUMA hipótese faça hardcode da `GEMINI_API_KEY`. O app deve consumi-la via `process.env.EXPO_PUBLIC_GEMINI_API_KEY` injetado via Eas Build ou extrair de um `Expo SecureStore`.

---

## 5. Gestão de Assets, Ícones e Permissões

### 5.1 Ícones
Substitua a biblioteca web `lucide-react` imediatamente por **`lucide-react`**.
O agente deve usar as classes do Tailwind para estilizar os ícones do lucide-react (ex: `className="text-white w-6 h-6"`).

### 5.2 Fontes Customizadas
A aplicação exige as fontes: `Poppins` e `Playfair Display`.
- Utilize a biblioteca `web-font`.
- Crie um hook `useFonts` no `App.js`/`App.tsx` raiz (e retorne `null` ou um `<SplashScreen />` usando `web-splash-screen` até o carregamento completo).

### 5.3 Mídias e Áudios flutuantes
- As imagens como do **Tema Espaço Sideral:** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`, `naveet.png`, `et.png`, icones de humor (`happy-astronaut.png`, `astronaut-calm.png`, `alien_neutral.png`, `alien_sad.png`, `alien_rage.png`), 
**Tema Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`, os icones de humor (`dinosaur_happy.png`, `dinosaur_smile.png`, `dinosaur_neutral.png`, `dynosaurus_angry.png`, `dinossaur_rage.png`), 
**Tema Carros:** `race-lights.png`, `speed-meter.png`, `podium-stand.png`, `bandeira_corrida.png`, `carro.png`, `cone.png `, `piloto.png`, `chegada.png`, `cronometro.png`, `helmet.png `, devem ser rigorosamente distribuídas em suas subpastas absolutas (ex: `/themes/space`, `/themes/dinossauro`, `/themes/cars`) dentro da pasta `public/`. Sendo a `public` a raiz de hospedagem estática, as mídias DEVEM ser requisitadas no código usando a tag HTML padrão com caminho absoluto: `<img src="/themes/space/rocekt.png" className="w-24" />`. É TERMINANTEMENTE PROIBIDO o uso de `require()` ou importações estáticas para estas imagens..
- Para o **Mixer de Áudios**, utilize o pacote **`HTML5 Audio / Web Audio API`**. Inicialize as instâncias usando a API Web nativa (`new Audio()` ou Web Audio Context).

### 5.4 Permissões (Hardware)
O fallback HTML5 para varrer permissões (`navigator.permissions`) será inteiramente **apagado**. 
Você deve usar as APIs web correspondentes na View "Permissões e Privacidade":
- Microfone: `HTML5 Audio / Web Audio API` (`Audio.requestPermissionsAsync()`).
- Câmera: `web-camera` (`Camera.requestCameraPermissionsAsync()`).
- Localização: `web-location` (`Location.requestForegroundPermissionsAsync()`).
- Notificações: `web-notifications` (`Notifications.requestPermissionsAsync()`).

---
**Fim das Diretrizes.**
Ao iniciar o trabalho, leia este documento inteiramente e aplique a arquitetura exata descrita acima.

## 6. Paleta de Cores e Identidade Visual (Design System)

A separação dos temas via cor é o que baliza o isolamento lógico das interfaces. Abaixo estão as paletas extraídas do Tailwind que DEVEM ser portadas via `StyleSheet` nativo ou TailwindCSS.

### 6.1 Modo Adulto & Telas Comuns (Login, Setup)
- **Fundo Principal (Background):** Slate/Dark muito profundo (`bg-slate-950`, `#020617` ou Black `#000000`).
- **Cards/Superfícies (Glassmorphism):** Preto com leve transparência (`bg-black/40` ou `rgba(255,255,255,0.05)`), suportando `backdrop-blur`.
- **Cores de Ação (Accent):** Azul Celeste (`#38bdf8` / `accent-blue`). Utilizado em botões primários, sliders e highlights.
- **Botões de Risco (Pânico/Logout):** Vermelhos profundos/brilhantes (ex: `#e11d48`).
- **Modo Pânico (Panic Overlay):** Fundo translúcido avermelhado com fortes animações de "breathing" e botões grandes contrastantes.

### 6.2 Modos Infantis (Temáticos)
As cores não apenas definem a estética, mas injetam-se nas caixas de diálogos, bordas e textos.

- **Dino (Dinossauros):**
  - **Fundo / Container Base:** Marrom Terra Escuro (`#553100`) ou `bg-[#2a1700]` para fundos profundos.
  - **Cor de Ação/Destaque (Accent):** Verde Neon Vibrante (`#80F356`).
- **Space (Espaço Sideral):**
  - **Fundo / Container Base:** Roxo Cósmico Escuro (`#110D1F`) ou Azul Meia-noite.
  - **Cor de Ação/Destaque (Accent):** Roxo Intenso (`#602EC9`) ou Violeta (`#482496`).
- **Cars (Carros):**
  - **Fundo / Container Base:** Cinza Asfalto / Dark.
  - **Cor de Ação/Destaque (Accent):** Amarelo Trânsito/Sinalização (`#FACC15`).

*(Nota ao Agente: Utilize Context API ou um hook como `useTheme` para expor essas variáveis. NÃO interlace classes inline diretamente.)*

---

## 7. Mapeamento Completo de Assets e Ícones

Todo asset estático referenciado no React Web precisará ser movido para a estrutura de pastas exigida pelo Vite (ex: `public/` ou `src/assets/`). A organização DEVE ser estritamente dividida:
- **Sons e Áudios:** Devem ser colocados na raiz da pasta `public` no formato absoluto `/sounds/`. É TERMINANTEMENTE PROIBIDO o uso de `require()` ou importações estáticas para áudios.
- **Imagens dos Temas:** Devem ser organizadas na raiz da pasta `public` no formato absoluto `/themes/`, divididas em subpastas específicas para não haver colisão de nomes. É TERMINANTEMENTE PROIBIDO o uso de `require()` ou importações estáticas para imagens.

### 7.1 Imagens Temáticas (.png)
O App utiliza abundantes imagens 2D (geradas por IA ou vetorizadas) com canal Alpha (`.png`). A estrutura de caminhos é mandatória:

- **Pasta `/themes/space/` (Tema Espaço Sideral):** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`, `naveet.png`, `et.png`, icones de humor (`happy-astronaut.png`, `astronaut-calm.png`, `alien_neutral.png`, `alien_sad.png`, `alien_rage.png`).
- **Pasta `/themes/dinossauro/` (Tema Dinossauros):** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`, os icones de humor (`dinosaur_happy.png`, `dinosaur_smile.png`, `dinosaur_neutral.png`, `dynosaurus_angry.png`, `dinossaur_rage.png`).
- **Pasta `/themes/cars/` (Tema Carros):** `race-lights.png`, `speed-meter.png`, `podium-stand.png`, `bandeira_corrida.png`, `carro.png`, `cone.png `, `piloto.png`, `chegada.png`, `cronometro.png`, `helmet.png `.

> **Comando de Utilização de Imagem (Vite PWA):** 
> As imagens estão na pasta `public/`. O React resolverá os caminhos absolutos a partir da raiz `/`.
> Padrão correto: `<img src="/themes/space/planet-big.png" className="..." />` ou `style={{ backgroundImage: "url('/themes/space/et.png')" }}`.
> É terminantemente proibido o uso de `require()`.

### 7.2 Ícones de Vetor (Lucide)
O sistema web usa amplamente o pacote `lucide-react`. 
- **Contextos Adulto/Sistema:** `User`, `Shield`, `Bell`, `Info`, `Lock`, `Settings`, `LogOut`.
- **Controles do Mixer (Audio) e UI Interna:** `Volume2`, `Play`, `Pause`, `Activity`, `MoreVertical` (3 pontinhos).
- **Player Interno e Ações:** `Heart` (Favoritar), `Repeat` (Looping), `Share2` (Compartilhar), `Download`.
- **Rastreadores:** `Moon` (Sono), `Heart` (Humor/Sentimento), `Book` (Diário).
- **Rede de Apoio:** `Phone`, `MapPin` (Localização).

> **REGRA DE PRESERVAÇÃO ESTRUTURAL:** Os ícones de interface não temáticos (Play, Pause, Coração, Lixeira, Configurações de som, Botão de 3 pontinhos) DEVEM ser preservados como vetores Lucide. Não tente substituí-los por PNGs ou removê-los do código. Eles são vitais para a usabilidade tanto no modo Adulto quanto no Infantil.
> **Comando de Migração de Ícone:**
> Mantenha o pacote `lucide-react`.
> Adicionar tamanho e cor via propriedades explícitas, já que as classes Tailwind não aplicarão regras SVG (ex: `<Mic size={24} color="#38bdf8" />`).

---

## 8. Posicionamento Estrito de Assets (Pixel-Perfect)

**ATENÇÃO:** O usuário exige que as posições originais das imagens flutuantes (Temas Infantis) sejam preservadas com 100% de fidelidade. Você NÃO tem permissão para alterar as coordenadas visuais na conversão para React Web.

- No Web, usamos as classes Tailwind utilitárias (ex: `top-[2%] left-[10%] w-36`).
- Na Web, usamos as classes Tailwind utilitárias ou estilos inline absolutos para mapear exatamente esses valores matemáticos.

**Exemplo - Espaço Sideral (`FloatingSpaceBackground.tsx`):**
- **Planet Big:** `bottom: -10%`, `right: -30%`, largura `w-[32rem]`, z-index `0`
- **Planet 2 (Ringed):** `top: 2%`, `left: 10%`, largura `w-36`, z-index `0`
- **Meteor:** `top: 10%`, `left: -5%`, largura `w-16`, z-index `10`
- **Moon:** `top: 35%`, `right: 15%`, largura `w-16`, z-index `0`
- **Planet 1 (`planet.png`):** `bottom: 10%`, `left: -10%`, largura `w-40`, z-index `0`
- **Satellite:** `top: 12%`, `right: 5%`, largura `w-24`, z-index `10`
- **Rocket:** `bottom: 25%`, `right: 5%`, largura `w-28`, z-index `10`
- **Asteroid 1:** `top: 55%`, `left: 8%`, largura `w-20`, z-index `10`
- **Asteroid 2:** `bottom: 15%`, `left: 30%`, largura `w-14`, z-index `10`
- **Estrela Cadente:** `top: 0`, `right: 0`, largura `w-40`, z-index `0` (animação cruzando a tela `x` e `y`)

**Exemplo - Dinossauros (`FloatingDinoBackground.tsx`):**
- **Nuvens (`cloud.png`):**
  - Nuvem 1: `-top-4`, `-left-4`, largura `w-32`
  - Nuvem 2: `-top-2`, `left-[20%]`, largura `w-32`
  - Nuvem 3: `top-0`, `left-[40%]`, largura `w-32`
  - Nuvem 4: `-top-2`, `right-[15%]`, largura `w-32`
  - Nuvem 5: `-top-4`, `-right-4`, largura `w-32`
- **Fóssil (`fossil.png`):** `top-24`, `left-4`, largura `w-24`
- **Fóssil Rex (`fossil_rex.png`):** `top-[35%]`, `right-2`, largura `w-28`
- **Personagens:**
  - **Dino Fofo:** `bottom-24`, `left-[-10px]`, largura `w-32`, z-index `10`
  - **Dino Alto (T-Rex):** `bottom-16`, `left-[20%]`, largura `w-64`, z-index `0`
  - **Fantasia Dino:** `bottom-28`, `right-[-10px]`, largura `w-32`, z-index `10`
- **Folhagens (Origem Base: `transformOrigin: 'bottom center'`):**
  - **Árvore:** `bottom-[-10px]`, `left-[-30px]`, largura `w-56`, z-index `20`
  - **Floresta:** `bottom-[-20px]`, `right-[-40px]`, largura `w-72`, z-index `20`
  - **Palmeiras 1:** `bottom-8`, `left-16`, largura `w-32`, z-index `30`
  - **Palmeiras 2:** `bottom-12`, `right-16`, largura `w-24`, z-index `30`

**Exemplo - Carros (`FloatingCarsBackground.tsx`):**
- **Bandeira Corrida Esquerda:** `top-[8%]`, `-left-6`, largura `w-32`
- **Bandeira Corrida Direita (Invertida):** `top-[8%]`, `-right-6`, largura `w-32`, escala x `-1` (espelhada)
- **Linha de Chegada (`chegada.png`):** `top-[5%]`, `left-[50%]`, largura `w-36`, deslocamento X `-50%` (centralizada)
- **Carro F1 (`carro.png`):** `top-[40%]`, `-left-8`, largura `w-44`
- **Cronômetro (`cronometro.png`):** `top-[45%]`, `-right-8`, largura `w-36`
- **Piloto (`piloto.png`):** `bottom-[10%]`, `left-[50%]`, largura `w-36`, deslocamento X `-50%` (centralizado), z-index `10`
- **Cones Esquerda (Conjunto de 3):**
  - Cone 1: `bottom-[2%]`, `-left-20`, largura `w-32`, z-index `10`
  - Cone 2: `bottom-[8%]`, `left-4`, largura `w-32`, z-index `10`
  - Cone 3: `bottom-[4%]`, `-left-6`, largura `w-40`, z-index `20`
- **Cones Direita (Conjunto de 3, espelhados `scaleX: -1`):**
  - Cone 1: `bottom-[2%]`, `-right-20`, largura `w-32`, z-index `10`
  - Cone 2: `bottom-[8%]`, `right-4`, largura `w-32`, z-index `10`
  - Cone 3: `bottom-[4%]`, `-right-6`, largura `w-40`, z-index `20`

---

## 9. Detalhamento da Aba Social / Comunidade (`CommunityView.tsx`)

A aba "Comunidade" possui um design complexo, escuro e vibrante, que requer atenção redobrada do agente na migração.

- **Cores de Fundo e Layout:**
  - Fundo principal extremamente escuro: `bg-[#060b13]`.
  - Cabeçalho: Títulos com a fonte `Poppins` em branco puro, e subtítulos em cinza `text-gray-400`.
- **Cenários / Filtros (Foco, Sono, Relaxamento, Infantil, Transporte):**
  - Ícones associados (Lucide): `Circle` (Foco), `Moon` (Sono), `Trees` (Relaxamento), `Baby` (Infantil), `Bus` (Transporte).
  - Quando inativos: Bordas de vidro (`border-white/5`), fundo translucido.
  - Quando ativos: Fundo mais iluminado (`bg-white/10`), borda evidenciada (`border-white/30`).
- **Cards dos Mixers (RecipeCards):**
  - Fundo do cartão: `bg-[#060b13]`.
  - Efeito "Glow" Dinâmico: A cor de cada mix (receita) injeta-se em uma *box-shadow* (`0 0 20px {cor}40`) e num gradiente radial rotativo em background (no Web, manipulado via Framer Motion). Na Web, esse *glow* e rotação devem ser reconstruídos usando `framer-motion` ou `CSS gradients padrão ou framer-motion`.
- **Animações (Equalizador):**
  - Durante o *play* de um mix na comunidade, o ícone central pulsa (escala e opacidade) e as barras (tags) de volume flutuam, gerando um pequeno brilho circular na ponta de cada barra (`box-shadow` dinâmico atrelado à cor da receita). Tudo isso deve ser implementado no Web usando `framer-motion` (via `useTransform` ou `useSpring`).

---

## 10. Regras Lógicas de Importação de Áudio e Criação de Mixers

**A. Importação de Áudio Personalizado (Mixer Principal)**
- **Web Atual:** O usuário clica em "Importar Áudio", o app aciona um input invisível `<input type="file" accept="audio/*">`. O áudio selecionado ganha o prefixo `imported-<timestamp>` e seu `URL.createObjectURL` é carregado pelo Audio Engine, enquanto a interface exibe o `<MathematicalVisualizer>` para preencher a tela com o áudio desconhecido.
- **Migração (React Web):** O agente DEVE remover a tag de input HTML. Ao clicar em Importar Áudio, o sistema acionará obrigatoriamente a biblioteca web **`web-document-picker`** (`getDocumentAsync({ type: 'audio/*' })`). A URI local será salva no estado e montada num player do pacote **`HTML5 Audio / Web Audio API`**.

**B. Publicação de um Mixer Personalizado**
- **Web Atual:** Utiliza o componente `<PublishMixOverlay>`. Ele captura o estado atual de `volumes`, sons ativos, configurações de Equalizador (Bass, Mid, Treble) definidos pelo usuário, pede um Título, uma Categoria, uma Palavra-chave/Cor e salva no cache (`localStorage` via chave `published_community_mixes`).
- **Migração (React Web):** O overlay de publicação deve ser um `Modal` nativo sobreposto. Os dados capturados do painel devem ser preservados e enviados para o **AsyncStorage** (para uso local provisório), permitindo que os mixes customizados surjam imeditamente no fluxo da Aba Social (`CommunityView`), mantendo toda a arquitetura de equalização associada.

**C. Sincronização Semântica de Ícones (Palavras-chave)**
- Ao importar um áudio local ou publicar um mixer na Comunidade, o aplicativo possui uma lógica estrita de atribuição de ícone baseada em **Palavras-Chave (Keywords) presentes no título** digitado pelo usuário.
- O Agente Antigravity DEVE replicar este mapeamento (Regex/Includes) usando os ícones do `lucide-react` ao renderizar as listas de áudio:
  - Se o título contiver "mente", "foco" ou "estudo" -> Ícone `Brain`
  - Se o título contiver "chuva", "tempestade" ou "rain" -> Ícone `CloudRain`
  - Se o título contiver "fogo", "lareira" ou "fire" -> Ícone `Flame`
  - Se o título contiver "vento", "ar" ou "wind" -> Ícone `Wind`
  - Se o título contiver "mar", "oceano" ou "onda" -> Ícone `Waves`
  - Se não houver correspondência, usa o ícone padrão -> Ícone `Music`

### ARQUIVOS COMPLEMENTARES DE SHADERS (WebGL / Shadertoy)

#### Original: `MathematicalVisualizer.tsx`
```tsx
import React, { useEffect, useRef } from 'react';
import { getAnalyser } from '../../lib/audioEngine';

interface Props {
  soundId: string;
}

export const MathematicalVisualizer: React.FC<Props> = ({ soundId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const analyser = getAnalyser(soundId);
    if (!analyser) {
      // If analyser isn't ready yet, maybe we retry or just wait?
      // Since playUrlSound sets it synchronously if buffer is ready, 
      // it might not be ready if it's still fetching.
      // But it's usually ready.
    }

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 128);
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback or retry
        const lateAnalyser = getAnalyser(soundId);
        if (lateAnalyser) {
          lateAnalyser.getByteFrequencyData(dataArray);
        }
      }

      ctx.fillStyle = 'rgba(6, 11, 19, 0.2)'; // fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.3;

      ctx.save();
      ctx.translate(centerX, centerY);
      
      time += 0.01;
      
      ctx.beginPath();
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const angle = (i / dataArray.length) * Math.PI * 2;
        
        // Mathematical modulation
        const r = radius + (percent * radius * 1.5) * Math.sin(angle * 4 + time);
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${(time * 50) % 360}, 80%, 60%, 0.8)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer rings
      ctx.beginPath();
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const angle = (i / dataArray.length) * Math.PI * 2;
        
        const r = radius * 1.5 + (percent * radius * 0.5) * Math.cos(angle * 8 - time * 2);
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${((time * 50) + 180) % 360}, 80%, 60%, 0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [soundId]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

```

#### Original: `light-speed.tsx`
```tsx
import React, { useEffect, useRef, useState } from "react";

const DEFAULT_FRAG = `#version 300 es
precision highp float;
/*********
* made by Matthias Hurrle (@atzedent)
*/
out vec4 O;
uniform float time;
uniform vec2 resolution;

#define FC gl_FragCoord.xy
#define R  resolution
#define T  time
#define hue(a) (.6+.6*cos(6.3*(a)+vec3(0,83,21)))

float rnd(float a) {
  vec2 p = fract(a * vec2(12.9898, 78.233));
  p += dot(p, p*345.);
  return fract(p.x * p.y);
}
vec3 pattern(vec2 uv) {
  vec3 col = vec3(0.);
  for (float i=.0; i++<20.;) {
    float a = rnd(i);
    vec2 n = vec2(a, fract(a*34.56));
    vec2 p = sin(n*(T+7.) + T*.5);
    float d = dot(uv-p, uv-p);
    col += .00125/d * hue(dot(uv,uv) + i*.125 + T);
  }
  return col;
}
void main(void) {
  vec2 uv = (FC - .5 * R) / min(R.x, R.y);
  vec3 col = vec3(0.);
  float s = 2.4;
  float a = atan(uv.x, uv.y);
  float b = length(uv);
  uv = vec2(a * 5. / 6.28318, .05 / tan(b) + T);
  uv = fract(uv) - .5;
  col += pattern(uv * s);
  O = vec4(col, 1.);
}`;

/** Minimal passthrough vertex shader */
const DEFAULT_VERT = `#version 300 es
precision highp float;
in vec2 position;
void main(){
  gl_Position = vec4(position, 0.0, 1.0);
}`;

type Props = {
  /** Tailwind classes controlling size/layout. Defaults to fullscreen. */
  className?: string;
  /** Pause the animation. */
  paused?: boolean;
  /** Multiply time (1 = normal speed). */
  speed?: number;
  /** Override fragment shader if you want to experiment. */
  fragmentSource?: string;
  /** Optional: handle shader compile errors. */
  onShaderError?: (err: string) => void;
};

function LightSpeed({
  className = "relative w-full h-full bg-black overflow-hidden",
  paused = false,
  speed = 1,
  fragmentSource = DEFAULT_FRAG,
  onShaderError,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const buffersRef = useRef<{ vbo: WebGLBuffer | null }>({ vbo: null });
  const uniformsRef = useRef<{ time?: WebGLUniformLocation; resolution?: WebGLUniformLocation }>({});
  const rafRef = useRef<number>(0);

  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = (canvas.getContext("webgl2") as WebGL2RenderingContext) || null;

    if (!gl) {
      setWebglOk(false);
      return;
    }
    setWebglOk(true);
    glRef.current = gl;

    // --- helpers
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(sh) || "Shader compile error";
        gl.deleteShader(sh);
        throw new Error(info);
      }
      return sh;
    };

    const link = (vs: WebGLShader, fs: WebGLShader) => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(prog) || "Program link error";
        gl.deleteProgram(prog);
        throw new Error(info);
      }
      return prog;
    };

    // try compile
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let prog: WebGLProgram | null = null;

    try {
      vs = compile(gl.VERTEX_SHADER, DEFAULT_VERT);
      fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
      prog = link(vs, fs);
    } catch (err: any) {
      onShaderError?.(String(err?.message || err));
      // fallback to default fragment if custom failed
      if (fragmentSource !== DEFAULT_FRAG) {
        try {
          fs = compile(gl.FRAGMENT_SHADER, DEFAULT_FRAG);
          prog = link(vs!, fs);
        } catch (err2: any) {
          onShaderError?.(String(err2?.message || err2));
          setWebglOk(false);
          return;
        }
      } else {
        setWebglOk(false);
        return;
      }
    }

    programRef.current = prog;
    gl.useProgram(prog);

    // full-screen quad
    const vbo = gl.createBuffer();
    buffersRef.current.vbo = vbo;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    const verts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const locPos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    // uniforms
    uniformsRef.current.time = gl.getUniformLocation(prog, "time")!;
    uniformsRef.current.resolution = gl.getUniformLocation(prog, "resolution")!;

    // DPR-aware size
    const resize = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const cssW = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniformsRef.current.resolution!, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);
    resize();

    // render loop
    let start = performance.now();
    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (paused) return;

      const now = (t - start) * 0.001 * (speed || 1);
      gl.useProgram(programRef.current);
      gl.uniform1f(uniformsRef.current.time!, now);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(loop);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", resize);

      if (gl && programRef.current) {
        const p = programRef.current;
        const attachedShaders = gl.getAttachedShaders(p) || [];
        attachedShaders.forEach((s) => gl.deleteShader(s));
        gl.deleteProgram(p);
      }
      if (gl && buffersRef.current.vbo) {
        gl.deleteBuffer(buffersRef.current.vbo);
      }
    };
  }, [fragmentSource, paused, speed, onShaderError]);

  return (
    <div className={className}>
      {!webglOk && (
        <div className="absolute inset-0 grid place-items-center text-center text-neutral-200">
          <div className="max-w-md px-6">
            <h2 className="text-xl font-semibold mb-2">WebGL not supported</h2>
            <p className="text-sm opacity-80">
              Your browser or device doesn’t support WebGL 2.0 or the shader failed to compile.
            </p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

export { LightSpeed };

```

#### Original: `nucleus.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;   // (w, h, dpr)
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  r  = iResolution.xy;
  float t  = iTime;
  vec3  FC = vec3(fragCoord, t);
  vec4  o  = vec4(0.0);

  // --- Nucleus ---
  vec3 p, a;
  float z = 0.0;
  float d = 0.0;

  for (float i = 0.0; i < 100.0; i++)
  {
    p = z * normalize(FC.rgb * 2.0 - r.xyy);
    a = normalize(cos(vec3(4.0, 2.0, 0.0) + t - d * 10.0)); // (d/.1) == d*10
    p.z += 8.0;
    a = a * dot(a, p) - cross(a, p);
    for (float k = 1.0; k < 5.0; k += 1.0) {
      a += sin(a * k + t).yzx / k;
    }
    d = abs(length(a) - 5.0) / 6.0;
    z += d;
    o += vec4(3.0, 8.0, z, 0.0) / max(d, 1e-4) / 9e4;
  }

  fragColor = vec4(o.rgb, 1.0);
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
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
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
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function Nucleus() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // fullscreen triangle
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      // safe cleanup
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }
    gl.useProgram(program);

    // uniforms
    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uFrame = gl.getUniformLocation(program, "iFrame");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    // mouse
    const mouse = { x:0, y:0, l:0, r:0 };
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    }
    function onDown(e: MouseEvent){ if (e.button===0) mouse.l = 1; }
    function onUp  (e: MouseEvent){ if (e.button===0) mouse.l = 0; }
    function onContextMenu(e: MouseEvent){ e.preventDefault(); }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", onContextMenu);

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
    let frame = 0;

    function tick(now: number) {
      const t = (now - start) / 1000;
      frame++;

      gl.useProgram(program);
      applySize();

      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);
      uFrame && gl.uniform1i(uFrame, frame);
      uMouse && gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{
        background: "black",
        cursor: "crosshair",
      }}
    />
  );
}

```

#### Original: `NatureLandscapeShader.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;
uniform sampler2D iChannel0;

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    float a = textureLod( iChannel0, x.xy/256.0 + (p.z+0.0)*120.7123, 0.0 ).x;
    float b = textureLod( iChannel0, x.xy/256.0 + (p.z+1.0)*120.7123, 0.0 ).x;
	return mix( a, b, f.z );
}

const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

float fbm( vec3 p )
{
    float f;
    f  = 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f;
}

float envelope( vec3 p )
{
	float isLake = 1.0-smoothstep( 0.62, 0.72, textureLod( iChannel0, 0.001*p.zx, 0.0).x );
	return 0.1 + isLake*0.9*textureLod( iChannel0, 0.01*p.xz, 0.0 ).x;
}

float mapTerrain( in vec3 pos )
{
	return pos.y - envelope(pos);
}

float raymarchTerrain( in vec3 ro, in vec3 rd )
{
	float maxd = 50.0;
	float precis = 0.001;
    float h = 1.0;
    float t = 0.0;
    for( int i=0; i<80; i++ )
    {
        if( abs(h)<precis||t>maxd ) break;
        t += h;
	    h = mapTerrain( ro+rd*t );
    }

    if( t>maxd ) t=-1.0;
    return t;
}

vec3 lig = normalize( vec3(0.7,0.4,0.2) );

vec3 calcNormal( in vec3 pos )
{
    vec3 eps = vec3(0.02,0.0,0.0);
	return normalize( vec3(
           mapTerrain(pos+eps.xyy) - mapTerrain(pos-eps.xyy),
           0.5*2.0*eps.x,
           mapTerrain(pos+eps.yyx) - mapTerrain(pos-eps.yyx) ) );

}

vec4 mapTrees( in vec3 pos, in vec3 rd )
{
    vec3  col = vec3(0.0);	
	float den = 1.0;

	float kklake = textureLod( iChannel0, 0.001*pos.zx, 0.0).x;
	float isLake = smoothstep( 0.7, 0.71, kklake );
	
	if( pos.y>1.0 || pos.y<0.0 ) 
	{
		den = 0.0;
	}
	else
	{
		
		float h = pos.y;
		float e = envelope( pos );
		float r = clamp(h/e,0.0,1.0);
		
        den = smoothstep( r, 1.0, textureLod(iChannel0, pos.xz*0.15, 0.0).x );
        
		den *= 1.0-0.95*clamp( (r-0.75)/(1.0-0.75) ,0.0,1.0);
		
        float id = textureLod( iChannel0, pos.xz, 0.0).x;
        float oc = pow( r, 2.0 );

		vec3  nor = calcNormal( pos );
		vec3  dif = vec3(1.0)*clamp( dot( nor, lig ), 0.0, 1.0 );
		float amb = 0.5 + 0.5*nor.y;
		
		float w = (2.8-pos.y)/lig.y;
		float c = fbm( (pos+w*lig)*0.35 );
		c = smoothstep( 0.38, 0.6, c );
		dif *= pow( vec3(c), vec3(0.8, 1.0, 1.5 ) );
			
		vec3  brdf = 1.7*vec3(1.5,1.0,0.8)*dif*(0.1+0.9*oc) + 1.3*amb*vec3(0.1,0.15,0.2)*oc;

		vec3 mate = 0.6*vec3(0.5,0.5,0.1);
		mate += 0.3*textureLod( iChannel0, 0.1*pos.xz, 0.0 ).zyx;
		
		col = brdf * mate;

		den *= 1.0-isLake;
	}

	return vec4( col, den );
}


vec4 raymarchTrees( in vec3 ro, in vec3 rd, float tmax, vec3 bgcol, out float resT )
{
	vec4 sum = vec4(0.0);
    float t = tmax;
	for( int i=0; i<512; i++ )
	{
		vec3 pos = ro + t*rd;
		if( sum.a>0.99 || pos.y<0.0  || t>20.0 ) break;
		
		vec4 col = mapTrees( pos, rd );

		col.xyz = mix( col.xyz, bgcol, 1.0-exp(-0.0018*t*t) );
        
		col.rgb *= col.a;

		sum = sum + col*(1.0 - sum.a);	
		
		t += 0.0035*t;
	}
    
    resT = t;

	return clamp( sum, 0.0, 1.0 );
}

vec4 mapClouds( in vec3 p )
{
	float d = 1.0-0.3*abs(2.8 - p.y);
	d -= 1.6 * fbm( p*0.35 );

	d = clamp( d, 0.0, 1.0 );
	
	vec4 res = vec4( d );

	res.xyz = mix( 0.8*vec3(1.0,0.95,0.8), 0.2*vec3(0.6,0.6,0.6), res.x );
	res.xyz *= 0.65;
	
	return res;
}


vec4 raymarchClouds( in vec3 ro, in vec3 rd, in vec3 bcol, float tmax, out float rays, ivec2 px )
{
	vec4 sum = vec4(0, 0, 0, 0);
	rays = 0.0;
    
	float sun = clamp( dot(rd,lig), 0.0, 1.0 );
	float t = 0.1*texelFetch( iChannel0, px&ivec2(255), 0 ).x;
	for(int i=0; i<64; i++)
	{
		if( sum.w>0.99 || t>tmax ) break;
		vec3 pos = ro + t*rd;
		vec4 col = mapClouds( pos );

		float dt = max(0.1,0.05*t);
		float h = (2.8-pos.y)/lig.y;
		float c = fbm( (pos + lig*h)*0.35 );
		//kk += 0.05*dt*(smoothstep( 0.38, 0.6, c ))*(1.0-col.a);
		rays += 0.02*(smoothstep( 0.38, 0.6, c ))*(1.0-col.a)*(1.0-smoothstep(2.75,2.8,pos.y));
	
		
		col.xyz *= vec3(0.4,0.52,0.6);
		
        col.xyz += vec3(1.0,0.7,0.4)*0.4*pow( sun, 6.0 )*(1.0-col.w);
		
		col.xyz = mix( col.xyz, bcol, 1.0-exp(-0.0018*t*t) );
		
		col.a *= 0.5;
		col.rgb *= col.a;

		sum = sum + col*(1.0 - sum.a);	

		t += dt;//max(0.1,0.05*t);
	}
    rays = clamp( rays, 0.0, 1.0 );

	return clamp( sum, 0.0, 1.0 );
}

vec3 path( float time )
{
	return vec3( 32.0*cos(0.2+0.75*.1*time*1.5), 1.2, 32.0*sin(0.1+0.75*0.11*time*1.5) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void moveCamera( float time, out vec3 oRo, out vec3 oTa, out float oCr, out float oFl )
{
    // camera	
	oRo = path( time );
	oTa = path( time+1.0 );
	oTa.y *= 0.2;
	oCr = 0.3*cos(0.07*time);
    oFl = 1.75;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 q = fragCoord.xy / iResolution.xy;
	vec2 p = -1.0 + 2.0*q;
	
    // Mobile aspect ratio fix
    p.x *= iResolution.x / iResolution.y;
	
	float time = 23.5+iTime;
	
    // camera	
	vec3 ro, ta;
    float roll, fl;
    moveCamera( time, ro, ta, roll, fl );
        
	// camera tx
    mat3 cam = setCamera( ro, ta, roll );

    // ray direction
    vec3 rd = normalize( cam * vec3(p.xy,fl) );

    // sky	 
	vec3 col = vec3(0.84,0.95,1.0)*0.77 - rd.y*0.6;
	col *= 0.75;
	float sun = clamp( dot(rd,lig), 0.0, 1.0 );
    col += vec3(1.0,0.7,0.3)*0.3*pow( sun, 6.0 );
	vec3 bcol = col;

    // lakes
    float gt = (0.0-ro.y)/rd.y;
    if( gt>0.0 )
    {
        vec3 pos = ro + rd*gt;

		vec3 nor = vec3(0.0,1.0,0.0);
	    nor.xz  = 0.10*(-1.0 + 2.0*texture( iChannel0, 1.5*pos.xz ).xz);
	    nor.xz += 0.15*(-1.0 + 2.0*texture( iChannel0, 3.2*pos.xz ).xz);
	    nor.xz += 0.20*(-1.0 + 2.0*texture( iChannel0, 6.0*pos.xz ).xz);
	    nor = normalize(nor);

		vec3 ref = reflect( rd, nor );
	    vec3 sref = reflect( rd, vec3(0.0,1.0,0.0) );
		float sunr = clamp( dot(ref,lig), 0.0, 1.0 );

	    float kklake = texture( iChannel0, 0.001*pos.zx).x;
		col = vec3(0.1,0.1,0.0);
        vec3 lcol = vec3(0.2,0.5,0.7);
		col = mix( lcol, 1.1*vec3(0.2,0.6,0.7), 1.0-smoothstep(0.7,0.81,kklake) );
		
		col *= 0.12;

	    float fre = 1.0 - max(sref.y,0.0);
		col += 0.8*vec3(1.0,0.9,0.8)*pow( sunr, 64.0 )*pow(fre,1.0);
		col += 0.5*vec3(1.0,0.9,0.8)*pow( fre, 10.0 );

		float h = (2.8-pos.y)/lig.y;
        float c = fbm( (pos+h*lig)*0.35 );
		col *= 0.4 + 0.6*smoothstep( 0.38, 0.6, c );

	    col *= smoothstep(0.7,0.701,kklake);

	    col.xyz = mix( col.xyz, bcol, 1.0-exp(-0.0018*gt*gt) );
    }

    // terrain	
	float t = raymarchTerrain(ro, rd);
    if( t>0.0 )
	{
        // trees		
        float ot;
        vec4 res = raymarchTrees( ro, rd, t, bcol, ot );
        t = ot;
	    col = col*(1.0-res.w) + res.xyz;
	}

	// sun glow
    col += vec3(1.0,0.5,0.2)*0.35*pow( sun, 3.0 );

    float rays = 0.0;
    // clouds	
    {
	if( t<0.0 ) t=600.0;
    vec4 res = raymarchClouds( ro, rd, bcol, t, rays, ivec2(fragCoord) );
	col = col*(1.0-res.w) + res.xyz;
	}

	col += (1.0-0.8*col)*rays*rays*rays*0.4*vec3(1.0,0.8,0.7);
	col = clamp( col, 0.0, 1.0 );
	
    // gamma	
	col = pow( col, vec3(0.45) );

    // contrast, desat, tint and vignetting	
	col = col*0.1 + 0.9*col*col*(3.0-2.0*col);
	col = mix( col, vec3(col.x+col.y+col.z)*0.33, 0.2 );
	col *= vec3(1.06,1.05,1.0);
    
    // vignetting	
	col *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );

    fragColor = vec4( col, 1.0 );
}

void main() { 
    vec4 color;
    mainImage(color, gl_FragCoord.xy); 
    fragColor = color;
}
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
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
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function NatureLandscapeShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // fullscreen triangle
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      // safe cleanup
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    gl.useProgram(program);

    // uniforms
    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uFrame = gl.getUniformLocation(program, "iFrame");
    const uMouse = gl.getUniformLocation(program, "iMouse");
    const uTex   = gl.getUniformLocation(program, "iChannel0");

    // Create a color noise texture for iChannel0 (Shadertoy's standard organic noise)
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i++) {
        data[i] = Math.random() * 255;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // Use mipmapping since textureLod is used
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // mouse
    const mouse = { x:0, y:0, l:0, r:0 };
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    }
    function onDown(e: MouseEvent){ if (e.button===0) mouse.l = 1; }
    function onUp  (e: MouseEvent){ if (e.button===0) mouse.l = 0; }
    function onContextMenu(e: MouseEvent){ e.preventDefault(); }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", onContextMenu);

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
    let frame = 0;
    function tick(now: number) {
      const t = (now - start) / 1000;
      frame++;
      gl.useProgram(program);
      applySize();

      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);
      uFrame && gl.uniform1i(uFrame, frame);
      uMouse && gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      uTex && gl.uniform1i(uTex, 0);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteTexture(tex); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{
        background: "black"
      }}
    />
  );
}

```

#### Original: `water-shader.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform vec4  iMouse;

const int NUM_STEPS = 8;
const float PI	 	= 3.141592;
const float EPSILON	= 1e-3;
#define EPSILON_NRM (0.1 / iResolution.x)

// sea
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;
const vec3 SEA_BASE = vec3(0.05, 0.15, 0.25);
const vec3 SEA_WATER_COLOR = vec3(0.4, 0.7, 0.8);
#define SEA_TIME (1.0 + iTime * SEA_SPEED)
const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

// math
mat3 fromEuler(vec3 ang) {
	vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
	m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
	m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
	return m;
}
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

// lighting
float diffuse(vec3 n,vec3 l,float p) {
    return pow(dot(n,l) * 0.4 + 0.6,p);
}
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (PI * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

// sky
vec3 getSkyColor(vec3 e) {
    e.y = max(e.y,0.0);
    return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4);
}

// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
    float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
    fresnel = pow(fresnel,3.0) * 0.65;
        
    vec3 reflected = getSkyColor(reflect(eye,n));    
    vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
    
    vec3 color = mix(refracted,reflected,fresnel);
    
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
    
    color += vec3(specular(n,l,eye,60.0));
    
    return color;
}

// tracing
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p);    
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = map(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = map(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = map(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;    
    float time = iTime * 0.15 + iMouse.x*0.01;
        
    // ray
    vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
    vec3 ori = vec3(0.0,3.5,time*5.0);
    vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
    dir = normalize(dir) * fromEuler(ang);
    
    // tracing
    vec3 p;
    heightMapTracing(ori,dir,p);
    vec3 dist = p - ori;
    vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
    vec3 light = normalize(vec3(0.0,1.0,0.8)); 
             
    // color
    vec3 color = mix(
        getSkyColor(dir),
        getSeaColor(p,n,light,dir,dist),
    	pow(smoothstep(0.0,-0.05,dir.y),0.3));
        
    // post
	fragColor = vec4(pow(color,vec3(0.75)), 1.0);
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
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
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
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function WaterShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // fullscreen triangle
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }
    gl.useProgram(program);

    // uniforms
    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    // mouse
    const mouse = { x:0, y:0, l:0, r:0 };
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    }
    function onDown(e: MouseEvent){ if (e.button===0) mouse.l = 1; }
    function onUp  (e: MouseEvent){ if (e.button===0) mouse.l = 0; }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

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
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);
      uMouse && gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{
        background: "black",
      }}
    />
  );
}

```

#### Original: `fire-shader.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;

#define time iTime
#define res iResolution

float bounce;

// signed box
float sdBox(vec3 p,vec3 b)
{
  vec3 d=abs(p)-b;
  return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.));
}

// rotation
void pR(inout vec2 p,float a) 
{
	p=cos(a)*p+sin(a)*vec2(p.y,-p.x);
}

// 3D noise function (IQ)
float noise(vec3 p)
{
	vec3 ip=floor(p);
    p-=ip; 
    vec3 s=vec3(7.0,157.0,113.0);
    vec4 h=vec4(0.,s.yz,s.y+s.z)+dot(ip,s);
    p=p*p*(3.-2.*p); 
    h=mix(fract(sin(h)*43758.5),fract(sin(h+s.x)*43758.5),p.x);
    h.xy=mix(h.xz,h.yw,p.y);
    return mix(h.x,h.y,p.z); 
}

float map(vec3 p)
{	
	p.z-=1.0;
    p*=0.9;
    pR(p.yz,bounce*1.+0.4*p.x);
    return sdBox(p+vec3(0.0,sin(1.6*time),0.0),vec3(20.0, 0.05, 1.2))-.4*noise(8.*p+3.*bounce);
}

//	normal calculation
vec3 calcNormal(vec3 pos)
{
    float eps=0.0001;
	float d=map(pos);
	return normalize(vec3(map(pos+vec3(eps,0,0))-d,map(pos+vec3(0,eps,0))-d,map(pos+vec3(0,0,eps))-d));
}

// 	standard sphere tracing inside and outside
float castRayx(vec3 ro,vec3 rd) 
{
    float function_sign=(map(ro)<0.)?-1.:1.;
    float precis=.0001;
    float h=precis*2.;
    float t=0.;
	for(int i=0;i<120;i++) 
	{
        if(abs(h)<precis||t>12.)break;
		h=function_sign*map(ro+rd*t);
        t+=h;
	}
    return t;
}

// 	refraction
float refr(vec3 pos,vec3 lig,vec3 dir,vec3 nor,float angle,out float t2, out vec3 nor2)
{
    float h=0.;
    t2=2.;
	vec3 dir2=refract(dir,nor,angle);  
 	for(int i=0;i<50;i++) 
	{
		if(abs(h)>3.) break;
		h=map(pos+dir2*t2);
		t2-=h;
	}
    nor2=calcNormal(pos+dir2*t2);
    return(.5*clamp(dot(-lig,nor2),0.,1.)+pow(max(dot(reflect(dir2,nor2),lig),0.),8.));
}

//	softshadow 
float softshadow(vec3 ro,vec3 rd) 
{
    float sh=1.;
    float t=.02;
    float h=.0;
    for(int i=0;i<22;i++)  
	{
        if(t>20.)continue;
        h=map(ro+rd*t);
        sh=min(sh,4.*h/t);
        t+=h;
    }
    return sh;
}

//	main function
void mainImage(out vec4 fragColor,in vec2 fragCoord)
{    
    bounce=abs(fract(0.05*time)-.5)*20.; // triangle function
    
	vec2 uv=fragCoord.xy/res.xy; 
    vec2 p=uv*2.-1.;
   
// 	bouncy cam every 10 seconds
    float wobble=(fract(.1*(time-1.))>=0.9)?fract(-time)*0.1*sin(30.*time):0.;
    
//  camera    
    vec3 dir = normalize(vec3(2.*fragCoord.xy -res.xy, res.y));
    vec3 org = vec3(0,2.*wobble,-3.);  
    
// 	standard sphere tracing:
    vec3 color = vec3(0.);
    vec3 color2 =vec3(0.);
    float t=castRayx(org,dir);
	vec3 pos=org+dir*t;
	vec3 nor=calcNormal(pos);

// 	lighting:
    vec3 lig=normalize(vec3(.2,6.,.5));
//	scene depth    
    float depth=clamp((1.-0.09*t),0.,1.);
    
    vec3 pos2 = vec3(0.);
    vec3 nor2 = vec3(0.);
    if(t<12.0)
    {
    	color2 = vec3(max(dot(lig,nor),0.)  +  pow(max(dot(reflect(dir,nor),lig),0.),16.));
    	color2 *=clamp(softshadow(pos,lig),0.,1.);  // shadow            	
       	float t2;
		color2.rgb +=refr(pos,lig,dir,nor,0.9, t2, nor2)*depth;
        color2-=clamp(.1*t2,0.,1.);				// inner intensity loss
	}      
  
    float tmp = 0.;
    float T = 1.;

//	animation of glow intensity    
    float intensity = 0.1*-sin(.209*time+1.)+0.05; 
	for(int i=0; i<128; i++)
	{
        float density = 0.; float nebula = noise(org+bounce);
        density=intensity-map(org+.5*nor2)*nebula;
		if(density>0.)
		{
			tmp = density / 128.;
            T *= 1. -tmp * 100.;
			if( T <= 0.) break;
		}
		org += dir*0.078;
    }    
	vec3 basecol=vec3(1./1. ,  1./4. , 1./16.);
    T=clamp(T,0.,1.5); 
    color += basecol* exp(4.*(0.5-T) - 0.8);
    color2*=depth;
    color2+= (1.-depth)*noise(6.*dir+0.3*time)*.1;	// subtle mist
    
    fragColor = vec4(vec3(1.*color+0.8*color2)*1.3, 1.0);
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
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
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
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function FireShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // fullscreen triangle
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }
    gl.useProgram(program);

    // uniforms
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
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{
        background: "black",
      }}
    />
  );
}

```

#### Original: `rain-shader.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform vec4  iMouse;
uniform sampler2D iChannel0;

#define S(a, b, t) smoothstep(a, b, t)
// To have full control over the rain, uncomment the HAS_HEART define 
//#define HAS_HEART
#define USE_POST_PROCESSING

vec3 N13(float p) {
   vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
   p3 += dot(p3, p3.yzx + 19.19);
   return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

vec4 N14(float t) {
	return fract(sin(t*vec4(123., 1024., 1456., 264.))*vec4(6547., 345., 8799., 1564.));
}
float N(float t) {
    return fract(sin(t*12345.564)*7658.76);
}

float Saw(float b, float t) {
	return S(0., b, t)*S(1., b, t);
}


vec2 DropLayer2(vec2 uv, float t) {
    vec2 UV = uv;
    
    uv.y += t*0.75;
    vec2 a = vec2(6., 1.);
    vec2 grid = a*2.;
    vec2 id = floor(uv*grid);
    
    float colShift = N(id.x); 
    uv.y += colShift;
    
    id = floor(uv*grid);
    vec3 n = N13(id.x*35.2+id.y*2376.1);
    vec2 st = fract(uv*grid)-vec2(.5, 0);
    
    float x = n.x-.5;
    
    float y = UV.y*20.;
    float wiggle = sin(y+sin(y));
    x += wiggle*(.5-abs(x))*(n.z-.5);
    x *= .7;
    float ti = fract(t+n.z);
    y = (Saw(.85, ti)-.5)*.9+.5;
    vec2 p = vec2(x, y);
    
    float d = length((st-p)*a.yx);
    
    float mainDrop = S(.4, .0, d);
    
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x-x);
    float trail = S(.23*r, .15*r*r, cd);
    float trailFront = S(-.02, .02, st.y-y);
    trail *= trailFront*r*r;
    
    y = UV.y;
    float trail2 = S(.2*r, .0, cd);
    float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
    y = fract(y*10.)+(st.y-.5);
    float dd = length(st-vec2(x, y));
    droplets = S(.3, 0., dd);
    float m = mainDrop+droplets*r*trailFront;
    
    return vec2(m, trail);
}

float StaticDrops(vec2 uv, float t) {
	uv *= 40.;
    
    vec2 id = floor(uv);
    uv = fract(uv)-.5;
    vec3 n = N13(id.x*107.45+id.y*3543.654);
    vec2 p = (n.xy-.5)*.7;
    float d = length(uv-p);
    
    float fade = Saw(.025, fract(t+n.z));
    float c = S(.3, 0., d)*fract(n.z*10.)*fade;
    return c;
}

vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    float s = StaticDrops(uv, t)*l0; 
    vec2 m1 = DropLayer2(uv, t)*l1;
    vec2 m2 = DropLayer2(uv*1.85, t)*l2;
    
    float c = s+m1.x+m2.x;
    c = S(.3, 1., c);
    
    return vec2(c, max(m1.y*l0, m2.y*l1));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
    vec2 UV = fragCoord.xy/iResolution.xy;
    vec3 M = iMouse.xyz/iResolution.xyz;
    float T = iTime+M.x*2.;
    
    #ifdef HAS_HEART
    T = mod(iTime, 102.);
    T = mix(T, M.x*102., M.z>0.?1.:0.);
    #endif
    
    float t = T*.2;
    
    float rainAmount = iMouse.z>0. ? M.y : sin(T*.05)*.3+.7;
    
    float maxBlur = mix(3., 6., rainAmount);
    float minBlur = 2.;
    
    float story = 0.;
    float heart = 0.;
    
    #ifdef HAS_HEART
    story = S(0., 70., T);
    
    t = min(1., T/70.);						// remap drop time so it goes slower when it freezes
    t = 1.-t;
    t = (1.-t*t)*70.;
    
    float zoom= mix(.3, 1.2, story);		// slowly zoom out
    uv *=zoom;
    minBlur = 4.+S(.5, 1., story)*3.;		// more opaque glass towards the end
    maxBlur = 6.+S(.5, 1., story)*1.5;
    
    vec2 hv = uv-vec2(.0, -.1);				// build heart
    hv.x *= .5;
    float s = S(110., 70., T);				// heart gets smaller and fades towards the end
    hv.y-=sqrt(abs(hv.x))*.5*s;
    heart = length(hv);
    heart = S(.4*s, .2*s, heart)*s;
    rainAmount = heart;						// the rain is where the heart is
    
    maxBlur-=heart;							// inside the heart slighly less foggy
    uv *= 1.5;								// zoom out a bit more
    t *= .25;
    #else
    float zoom = -cos(T*.2);
    uv *= .7+zoom*.3;
    #endif
    UV = (UV-.5)*(.9+zoom*.1)+.5;
    
    float staticDrops = S(-.5, 1., rainAmount)*2.;
    float layer1 = S(.25, .75, rainAmount);
    float layer2 = S(.0, .5, rainAmount);
    
    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);
   #ifdef CHEAP_NORMALS
    	vec2 n = vec2(dFdx(c.x), dFdy(c.x));
    #else
    	vec2 e = vec2(.001, 0.);
    	float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
    	float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
    	vec2 n = vec2(cx-c.x, cy-c.x);		// expensive normals
    #endif
    
    #ifdef HAS_HEART
    n *= 1.-S(60., 85., T);
    c.y *= 1.-S(80., 100., T)*.8;
    #endif
    
    float focus = mix(maxBlur-c.y, minBlur, S(.1, .2, c.x));
    vec3 col = textureLod(iChannel0, UV+n, focus).rgb;
    
    #ifdef USE_POST_PROCESSING
    t = (T+3.)*.5;										
    float colFade = sin(t*.2)*.5+.5+story;
    col *= mix(vec3(1.), vec3(.8, .9, 1.3), colFade);	// subtle color shift
    float fade = S(0., 10., T);							// fade in at the start
    float lightning = sin(t*sin(t*10.));				// lighting flicker
    lightning *= pow(max(0., sin(t+sin(t))), 10.);		// lightning flash
    col *= 1.+lightning*fade*mix(1., .1, story*story);	// composite lightning
    col *= 1.-dot(UV-=.5, UV);							// vignette
    											
    #ifdef HAS_HEART
    	col = mix(pow(col, vec3(1.2)), col, heart);
    	fade *= S(102., 97., T);
    #endif
    
    col *= fade;										
    #endif
    
    fragColor = vec4(col, 1.);
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

export default function RainShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    // Triangle
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

    // Uniforms
    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uMouse = gl.getUniformLocation(program, "iMouse");
    const uChan0 = gl.getUniformLocation(program, "iChannel0");

    gl.uniform1i(uChan0, 0);

    // Create and bind texture
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Temporary 1x1 black pixel until image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 25, 30, 255]));

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

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
      gl.deleteTexture(texture);
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

```

#### Original: `UniverseWithinShader.tsx`
```tsx
"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

#define S(a, b, t) smoothstep(a, b, t)
#define NUM_LAYERS 4.

float N21(vec2 p) {
	vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
    a += dot(a, a.yzx + 79.76);
    return fract((a.x + a.y) * a.z);
}

vec2 GetPos(vec2 id, vec2 offs, float t) {
    float n = N21(id+offs);
    float n1 = fract(n*10.);
    float n2 = fract(n*100.);
    float a = t+n;
    return offs + vec2(sin(a*n1), cos(a*n2))*.4;
}

float GetT(vec2 ro, vec2 rd, vec2 p) {
	return dot(p-ro, rd); 
}

float LineDist(vec3 a, vec3 b, vec3 p) {
	return length(cross(b-a, p-a))/length(p-a);
}

float df_line( in vec2 a, in vec2 b, in vec2 p)
{
    vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);	
	return length(pa - ba * h);
}

float line(vec2 a, vec2 b, vec2 uv) {
    float r1 = .04;
    float r2 = .01;
    
    float d = df_line(a, b, uv);
    float d2 = length(a-b);
    float fade = S(1.5, .5, d2);
    
    fade += S(.05, .02, abs(d2-.75));
    return S(r1, r2, d)*fade;
}

float NetLayer(vec2 st, float n, float t) {
    vec2 id = floor(st)+n;

    st = fract(st)-.5;
   
    vec2 p[9];
    int i=0;
    for(float y=-1.; y<=1.; y++) {
    	for(float x=-1.; x<=1.; x++) {
            p[i++] = GetPos(id, vec2(x,y), t);
    	}
    }
    
    float m = 0.;
    float sparkle = 0.;
    
    for(int i=0; i<9; i++) {
        m += line(p[4], p[i], st);

        float d = length(st-p[i]);

        float s = (.005/(d*d));
        s *= S(1., .7, d);
        float pulse = sin((fract(p[i].x)+fract(p[i].y)+t)*5.)*.4+.6;
        pulse = pow(pulse, 20.);

        s *= pulse;
        sparkle += s;
    }
    
    m += line(p[1], p[3], st);
	m += line(p[1], p[5], st);
    m += line(p[7], p[5], st);
    m += line(p[7], p[3], st);
    
    float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;
    sPhase += pow(sin(t*.1)*.5+.5, 50.)*5.;
    m += sparkle*sPhase;
    
    return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
	vec2 M = iMouse.xy/iResolution.xy-.5;
    
    float t = iTime*.1;
    
    float s = sin(t);
    float c = cos(t);
    mat2 rot = mat2(c, -s, s, c);
    vec2 st = uv*rot;  
	M *= rot*2.;
    
    float m = 0.;
    for(float i=0.; i<1.; i+=1./NUM_LAYERS) {
        float z = fract(t+i);
        float size = mix(15., 1., z);
        float fade = S(0., .6, z)*S(1., .8, z);
        
        m += fade * NetLayer(st*size-M*z, i, iTime);
    }
    
	// Mock FFT value instead of texture lookup
	float fft  = 0.5 + 0.1*sin(iTime*2.0); 
    float glow = -uv.y*fft*2.;
   
    vec3 baseCol = vec3(s, cos(t*.4), -sin(t*.24))*.4+.6;
    vec3 col = baseCol*m;
    col += baseCol*glow;
    
    col *= 1.-dot(uv,uv);
    t = mod(iTime, 230.);
    col *= S(0., 20., t)*S(224., 200., t);
    
    fragColor = vec4(col,1);
}

void main() { 
    vec4 color;
    mainImage(color, gl_FragCoord.xy); 
    fragColor = color;
}
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  if (!ok) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh) || "");
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
  const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
  if (!ok) {
    console.error("Program link error:", gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function UniverseWithinShader() {
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
    if (!vs || !fs) {
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    const program = link(gl, vs, fs);
    if (!program) {
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
      return;
    }

    gl.useProgram(program);

    const uRes   = gl.getUniformLocation(program, "iResolution");
    const uTime  = gl.getUniformLocation(program, "iTime");
    const uFrame = gl.getUniformLocation(program, "iFrame");
    const uMouse = gl.getUniformLocation(program, "iMouse");

    const mouse = { x:0, y:0, l:0, r:0 };
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    }
    function onDown(e: MouseEvent){ if (e.button===0) mouse.l = 1; }
    function onUp  (e: MouseEvent){ if (e.button===0) mouse.l = 0; }
    function onContextMenu(e: MouseEvent){ e.preventDefault(); }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", onContextMenu);

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
    let frame = 0;
    function tick(now: number) {
      const t = (now - start) / 1000;
      frame++;
      gl.useProgram(program);
      applySize();

      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      uRes   && gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
      uTime  && gl.uniform1f(uTime, t);
      uFrame && gl.uniform1i(uFrame, frame);
      uMouse && gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);
      
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
      try { ro && ro.disconnect(); } catch {}
      try { gl.deleteProgram(program); } catch {}
      try { gl.deleteShader(vs); } catch {}
      try { gl.deleteShader(fs); } catch {}
      try { gl.deleteBuffer(vbo); } catch {}
      try { gl.deleteVertexArray(vao); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{
        background: "black"
      }}
    />
  );
}

```

#### Original: `SpaceBloomShader.tsx`
```tsx
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

```

#### Original: `space-panic-shader.tsx`
```tsx
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

```


---

## 11. Fluxo Exaustivo de Autenticação e Criação de Conta (Onboarding)

O Agente Antigravity DEVE dominar estritamente o fluxo de entrada do aplicativo passo a passo, pois ele define as barreiras de layout e estado lógico entre o Modo Adulto e o Modo Infantil.

### 11.1 Tela de Login (`AuthView`)
- **Estilo & Fundo:** Porta de entrada neutra e elegante. Possui fundo escuro puro (`bg-[#060b13]`), sem decorações infantis, apenas com dois gradientes radiais borrados ao fundo (`bg-accent-blue/10` blur-100px no top-left, e `bg-accent-purple/10` blur-80px no bottom-right).
- **Tipografia:** Fonte `Poppins` nos cabeçalhos (`TEA SoundScapes`) e `Inter` ou `Plus Jakarta Sans` no corpo.
- **Ação Nativa:** Inputs textuais escuros (glass card com borda `border-white/10`).
- **Navegação:** O botão "Criar conta (Boas-vindas)" deve inicializar o `OnboardingStack`.

### 11.2 Fluxo de Onboarding (Passo a Passo Rigoroso)
A tela `OnboardingView.tsx` gerencia 10 passos sequenciais (alguns bifurcados por modo). O `step` atual guia a renderização.

**Configurações Globais do Onboarding:**
- **Background Fixo:** Fundo escuro absoluto `bg-[#060b13]`.
- **Navegação Interna:** Há um botão "Voltar" nativo flutuando no topo para regredir o passo atual.
- **Animações (Transição entre Passos):** Na Web usamos `motion.div` com `opacity: 0, x: 20` para `opacity: 1, x: 0`. Englobe os sub-passos em views animadas com `framer-motion`.

**Detalhamento Etapa por Etapa:**

- **Etapa 1: Boas Vindas**
  - Solicita apenas o nome (`setName`).
  - Cor do Botão "Começar": Rosa/Vermelho vibrante (`#f43f5e`) com *glow*.
- **Etapa 2: Registro de E-mail**
  - Solicita o e-mail (usado depois no SQLite local para isolar os dados das contas).
  - Possui botões visuais para Outlook, Google e Facebook (mantenha os ícones via imagens locais estáticas).
- **Etapa 3: A ESCOLHA CRÍTICA (Modo Adulto vs. Infantil)**
  - O usuário escolhe entre `setThemeMode('adult')` ou `setThemeMode('child')`.
  - **Se o usuário escolher "Infantil":** O botão inferior de "Avançar" abandona a cor `bg-accent-blue` e ganha um gradiente linear Laranja vibrante (`linear-gradient(90deg, #ff0000 52%, #ff5c00 84%)`) e altera a classe CSS global do body (`document.body.classList.add('child-mode')` -> Isso deve acionar a store do Zustand para ejetar cores diferentes nas próximas telas).
- **Etapa 4: Diagnóstico de Ruído (Onde o barulho incomoda?)**
  - Renderiza uma lista de locais (Transporte, Escola, Trabalho, Shopping, Casa). Múltipla escolha (Array). Cores padrão baseadas no `accent-blue`.
- **Etapa 5: Rede de Apoio (Guardião)**
  - Captura `supportName`, `supportPhone` e uma booleana (`alertSupport`).
  - Uma pergunta crítica embaixo: "Você faz acompanhamento com psicólogo?" (`setHasTherapist`).
- **Etapa 6: Permissão de Microfone**
  - Educa o usuário sobre a segurança do monitoramento de áudio.
  - Na web usamos `navigator.mediaDevices.getUserMedia`. **MIGRAÇÃO:** O Antigravity DEVE converter isso obrigatoriamente para `Audio.requestPermissionsAsync()` do `HTML5 Audio / Web Audio API`.
- **Etapa 7 (Modo Infantil): Escolha o seu Mundo!**
  - *Somente visível se o passo for 7 e `themeMode === 'child'`.*
  - A interface exibe "Qual é o seu mundo favorito? 🌎" com um texto Laranja Forte (`text-[#ff5c00]`).
  - Exibe 3 botões em Grid (Dinossauros com borda Laranja/Verde, Espaço Sideral com borda Indigo/Roxa, Carros com borda Vermelha).
  - O botão "Avançar" continua com a cor Laranja (`bg-[#ff5c00]`).
- **Etapa 8 (Modo Infantil): Filtro de Autonomia**
  - O app pergunta: "A criança fará o registro de suas próprias emoções após o uso do Som Refúgio?".
  - Liga/desliga a booleana `childAutonomyFilter`. Se sim, a tela pós-crise exigirá uma avaliação de humor.
- **Etapa 9 (Infantil) ou Etapa 7 (Adulto): Escolha seu Refúgio (Áudio de Emergência)**
  - O usuário escuta pre-views (Ruído Marrom, Som de Chuva, Som Delta Suave).
  - *Atenção Migração:* O agente precisa invocar `Audio` (HTML5 Audio) ou Web Audio API ao invés do nosso `playSound` web genérico para garantir que o áudio de preview toque na inicialização.
- **Etapa 10 (Somente Modo Infantil): Proteger o Diário 🔒 (PIN Parental)**
  - Obriga a inserção do `pin` e `confirmPin` de 4 dígitos.
  - Os inputs usam espaçamento largo de texto (`tracking-[1em]`) para destacar as bolinhas da senha. **Migração:** O Agente deve assegurar que o teclado nativo acione o `keyboardType="number-pad"` no `<TextInput>`.
- **Etapa Final: Tudo Pronto ✨**
  - Um ícone gigante de confere (verde) anuncia que o cadastro está completo.
  - Salva todos os dados no armazenamento local (Use `IndexedDB` ou `localStorage` atrelado ao email inserido no passo 2).


## 12. Detalhamento da Aba Perfil (`ProfileView`) e Telas EU

A aba "Perfil" ou "Eu" é a área de configurações pessoais, mas no **Modo Infantil** ela não é um formulário sem graça, mas sim um menu imersivo e lúdico. (NOTA CORRETIVA: A tela EU/Perfil é aberta para a criança. O PIN Parental bloqueia o acesso à tela **DIÁRIO**, onde residem informações sensíveis e análises.)

### 12.1 Backgrounds Dinâmicos (Modo Infantil - Tela EU)
As configurações da criança sobrepõem os cenários nativos através de imagens animadas e backgrounds estritos (atrás dos *glass cards* de configuração):
- **Tema Espaço Sideral:**
  - Imagem: `naveet.png` (Nave espacial sendo pilotada).
  - Posição: Deve ser ancorada no topo à direita, flutuando (usando `useSharedValue` em Y: -10 a 10).
- **Tema Dinossauro (`DinoProfileBackground`):**
  - Background: Gradiente linear de Marrom-Terra `rgba(137, 92, 7, 0.5)` para Verde Musgo `rgba(42, 72, 6, 1)`.
  - Nuvens e Fósseis: `cloud.png` no topo do céu, `fossil.png` e `fossil_rex.png` em posições centrais flutuando devagar.
  - Imagem Principal: `dino_fofo.png` posicionado estritamente em `bottom-24` e `left-[-10px]`, pulando/flutuando suavemente no eixo Y.
- **Tema Carros:**
  - Background: Usa os elementos SVGs importados de fundo `race-lights.png` (luzes de largada), `speed-meter.png` e `podium-stand.png` sobrepostos com opacidade de 30% em `absolute inset-0` e translação lenta.
- **Cores dos Cartões (`ProfileView`):** No modo infantil Dinossauro, em vez do fundo de vidro transparente `rgba(255,255,255,0.05)`, os *cards* de configuração (Editar Nome, Adicionar Contato) assumem uma base opaca forte: `#553100` (Marrom). O Agente Antigravity deve rastrear essas trocas lógicas no `StyleSheet`.


---

## 13. Mapeamento de Áudios e Shaders (Mixer Principal)

A tela Inicial (Home) possui o Mixer Principal. Os áudios nativos disponíveis são os mesmos tanto para o **Modo Adulto** quanto para o **Modo Infantil**, garantindo a mesma capacidade terapêutica. No entanto, no **Modo Infantil**, ao reproduzir um áudio, o *Player Interno* reage exibindo um **Shader 3D/WebGL específico** de acordo com a faixa "Dominante". 

Abaixo está o mapeamento estrito das faixas de áudio nativas, seus IDs, e o Shader que o Agente Antigravity DEVE carregar no Modo Infantil:

| Áudio (Mixer Principal) | ID interno | Shader Mapeado (Player Interno - Infantil) |
| :--- | :--- | :--- |
| **Ruído Branco** | `branco` | `Nucleus` (21st.dev) |
| **Ruído Rosa** | `rosa` | `PinkNoiseShader` (Partículas Responsivas Bloom) |
| **Ruído Marrom** | `marrom` | `light-speed` (Fuga espacial em hyperdrive) |
| **Chuva** | `chuva` | `rain-shader` (Gotas procedurais) |
| **Água / Rio** | `agua` | `water-shader` (Reflexos e ondas cáusticas) |
| **Vento** | `vento` | `quantum-nebula` (Padrão: GenerativeArtSceneV3) |
| **Natureza (Floresta)** | `natureza` | `NatureLandscapeShader` (Terreno e folhagens) |
| **Pássaros** | `passaros` | `UniverseWithinShader` (Pássaros/Conexões de rede) |
| **Lareira** | `lareira` | `fire-shader` (Chamas volumétricas) |
| **Áudio Importado** | `imported-<id>`| `MathematicalVisualizer` (Espectro Geométrico) |

*Nota:* No Modo Adulto, a renderização desses shaders é minimizada ou substituída por equalizadores limpos e interfaces minimalistas.

---

## 14. Mapeamento Estrito de Imagens (.png) por Tela e Tema

Para o Modo Infantil, as dezenas de imagens inseridas na pasta `/assets/themes` possuem "endereços" e pastas estritas corretas. O Agente não deve misturá-las. Segue a distribuição exata de onde cada `.png` deve ser renderizado:

### 14.1 Tela INÍCIO (HomeView - Background Flutuante)
Esta tela possui os cenários vivos (flutuantes) por trás do Mixer Principal.
- **Espaço Sideral:** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`. *(Estas imagens ficam em órbita lenta usando translações `useSharedValue`).*
- **Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`.
- **Carros:** `bandeira_corrida.png`, `carro.png`, `cone.png`, `piloto.png`, `chegada.png`, `cronometro.png`.

### 14.2 Tela DIÁRIO (Aba: "Como você está agora?" - Rastreador de Humor)
Nesta tela, a criança seleciona como está se sentindo usando avatares expressivos.
- **Espaço Sideral:** `happy-astronaut.png`, `astronaut-calm.png`, `alien_neutral.png`, `alien_sad.png`, `alien_rage.png`.
- **Dinossauros:** `dinosaur_happy.png`, `dinosaur_smile.png`, `dinosaur_neutral.png`, `dynosaurus_angry.png`, `dinossaur_rage.png`.
- **Carros (EXCEÇÃO):** **NÃO HÁ IMAGENS AQUI.** O tema Carros usa componentes de UI nativos (sliders visuais analógicos de painel, cores de termômetro de motor, etc.) para medir a emoção, sem depender de avatares PNG.

### 14.3 Tela EU (ProfileView / Configurações)
Esta é a tela de perfil e configurações da criança.
- **Espaço Sideral:** `naveet.png` (Nave espacial flutuando no topo da tela).
- **Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`. *(Dino Fofo fica posicionado ancorado no rodapé à esquerda `bottom-24` `left-[-10px]`).*
- **Carros:** `race-lights.png`, `speed-meter.png`, `podium-stand.png`. *(Imagens compõem a estética de pista/pódio atrás das configurações).*


---

## 15. Fluxo Pós-Crise: Termômetro de Humor (Avaliação SOS)

No Modo Infantil, a saída da tela SOS Pânico (`PanicOverlay.tsx`) possui um comportamento estrito atrelado ao **Filtro de Autonomia** (configurado na Etapa 8 da criação de conta). O Agente Antigravity DEVE respeitar essa condicional ao finalizar uma crise.

### 15.1 Lógica de Acionamento (Condicional)
Quando a criança conclui o exercício de respiração (HUD de Carros, Pterodáctilo voando ou Shader Espacial) e a crise é estabilizada:
- O agente deve checar a variável `childAutonomyFilter` (armazenada no estado global Zustand / MMKV).
- **Se `false` (Desligado):** O modal SOS Pânico fecha imediatamente. O aplicativo apenas registra um evento silencioso de "Crise" no banco de dados para os pais lerem depois.
- **Se `true` (Ligado):** A tela SOS Pânico NÃO fecha direto. Ela transiciona internamente para a view do **Termômetro de Humor Lúdico**, exibindo a pergunta: *"Como você se sente agora?"*.

### 15.2 UI/UX do Termômetro Pós-Crise por Tema
O Termômetro reaproveita as mecânicas de avaliação visual da aba Diário, sendo sobreposto como um *Glass Card* ou Modal imersivo:
- **Tema Espaço Sideral:** Exibe horizontalmente os 5 níveis de avatares (ex: do `alien_rage.png` ao `happy-astronaut.png`).
- **Tema Dinossauros:** Exibe os 5 avatares interativos da família T-Rex (ex: do `dinossaur_rage.png` ao `dinosaur_happy.png`).
- **Tema Carros (Tanque de Gasolina/Bateria):** A Exceção de Assets. Em vez de usar avatares felizes/tristes, o tema Carros utiliza a metáfora de um **Tanque de Gasolina** (ou Bateria do Motor) para medir o humor. 
  - **Mecânica:** O Agente Antigravity deve construir um Medidor de Combustível usando `framer-motion` (um semicírculo SVG ou slider customizado como painel analógico). 
  - **Semântica:** O nível "Vazio" ou "Reserva" (Vermelho) representa raiva/cansaço. O nível "Cheio" (Verde brilhante) representa calma/felicidade. A criança arrasta o ponteiro para indicar como o "motor" dela se sente agora.

### 15.3 Ação Final e Persistência
Assim que a criança tocar na sua emoção atual:
1. O aplicativo aciona o `web-sqlite` (ou camada de repositório).
2. Salva um registro na tabela `diary_entries` contendo a emoção escolhida, a tag de que ocorreu após um SOS Pânico, o timestamp e o `user_email`.
3. Ouve-se um *feedback* sonoro positivo de conclusão.
4. O Overlay de Pânico é totalmente desmontado (`unmount`), devolvendo a criança de forma suave (fade-out) para a tela em que ela estava (Home, Social, etc.).


---

## 16. Evolução do Diário Terapêutico: Módulo de Análises & Inteligência Artificial

O aplicativo não deve apenas registrar dados, mas ser uma ferramenta preditiva. O Agente Antigravity DEVE evoluir a aba "Diário" de dados puramente descritivos (o que aconteceu) para **dados analíticos e preditivos** (por que aconteceu e como melhorar), alimentando o modelo da IA (Google Gemini API / `@google/genai`) com os dados do banco local SQLite.

### 16.1 Integração de IA (Modo Dual de System Prompts)
A inteligência artificial processará o histórico de humor do usuário com **DOIS comportamentos estritos e independentes**, dependendo do alvo final da leitura:

#### A) Visão do Usuário (In-App)
- **Onde renderiza:** Um "Card de Insight" ancorado no topo da aba de Análises (dentro do Diário).
- **System Prompt (Regra do Agente):** Empático, encorajador, não-clínico, focado estritamente em autocuidado e prevenção. É expressamente PROIBIDO fornecer diagnósticos médicos. O texto gerado deve ter o limite máximo de 2 linhas.
- **Exemplo de Retorno Exigido:** *"Notei que a 'Multidão' tem sido difícil essa semana. Está tudo bem fazer pausas. Que tal usar seu Som Refúgio hoje?"*
- **Design & Estilo (UI/UX):**
  - **Layout:** Card com bordas suaves (`border-radius: 16px` / `rounded-2xl`), utilizando efeito Glassmorphism suave (fundo translúcido `bg-white/5` ou `bg-white/10` dependendo do tema).
  - **Ícones:** Um ícone de Lâmpada (Luz/Insight) ou Coração, posicionado ao lado do texto.
  - **Cores por Tema:** 
    - *Adulto:* Borda com brilho sutil em Azul Celeste (`border-accent-blue/30`).
    - *Infantil (Dino):* Borda Laranja/Verde (`#ff5c00`).
    - *Infantil (Espaço):* Borda Roxo Cósmico com leve *glow*.
    - *Infantil (Carros):* Borda Amarelo Sinalização.
  - **Tipografia:** Fonte `Inter` ou `Plus Jakarta Sans`, peso médio, tamanho base legível (14px/16px), cor de texto suave e acolhedora (`text-gray-200`).

#### B) Visão do Terapeuta (Exportação PDF)
- **Onde renderiza:** Na função de "Exportar Relatório". A aplicação Web deve gerar um documento usando bibliotecas como bibliotecas Web de exportação PDF (HTML para PDF) e permitir o envio via Web Share API.
- **System Prompt (Regra do Agente):** Analítico, clínico, puramente objetivo, focado em correlações matemáticas, gatilhos de estresse e frequência de ocorrências.
- **Estrutura no Documento:** O agente deve injetar uma seção obrigatória na PRIMEIRA página do PDF chamada **"Resumo Analítico da IA"**, formatada com um parágrafo denso, técnico e estruturado.
- **Exemplo de Retorno Exigido:** *"Padrão identificado: 80% dos eventos de humor baixo (escore 1-2) ocorreram pela manhã, estritamente atrelados ao gatilho 'Transporte e Barulho Urbano'."*
- **Design & Estilo (PDF):**
  - O layout do PDF deve ser estritamente monocromático ou tons de cinza clínicos para facilitar impressão.
  - O "Resumo Analítico da IA" deve estar dentro de uma caixa com borda sólida escura (`border: 1px solid #333`), fonte serifada ou sans-serif sóbria (Arial/Helvetica), espaçamento entrelinhas 1.5, sem nenhum elemento lúdico ou infantil, independentemente do tema da criança.

### 16.2 Privacidade e Contexto da IA
O Agente Antigravity DEVE extrair as entradas do `IndexedDB` (ou localStorage) localmente, formatá-las como um objeto JSON simplificado e injetá-las no payload do prompt para a API do Gemini, garantindo que nenhum dado identitário (nome real, e-mail) seja enviado na string de contexto, apenas os registros das crises, horários, humor (1-5) e gatilhos ativados.

---

## 17. Topologia e Layout Estrito das Telas (UI/UX)

Para que o Agente Antigravity não distorça o design original, abaixo está o raio-x exato do que compõe cada uma das 5 abas principais e seus recursos exclusivos.

### 17.1 Tela INÍCIO (Home / Mixer Principal)
A tela de entrada principal do aplicativo, focada na mesa de som.
- **Botões de Emergência (Globais):** 
  - **Botão "Meu Refúgio":** Aciona imediatamente o som seguro configurado. 
  - **Botão "SOS Pânico":** Botão vermelho/destaque que sobrepõe a interface inteira e leva à tela de exercícios respiratórios. Ambos ficam visíveis de forma proeminente na Home.
- **Mixer Principal (Mesa de Som):** Lista de trilhas de áudio (Chuva, Fogo, Ruído Rosa, etc).
  - **Botão de 3 Pontinhos (MIXER AVANÇADO - EXCLUSIVO ADULTO):** 
    - **Funcionalidade:** No Modo Adulto, existe um botão circular escuro no topo direito da tela Início com o ícone de 3 pontinhos (`MoreVertical`). Ao clicar, o aplicativo abre um Modal ou Painel expansivo chamado "Ajustes do Mixer".
    - **Design do Painel "Ajustes do Mixer":**
      - Fundo escuro (padrão Adulto `#060b13` ou `#111827`) cobrindo quase toda a tela (Full Screen Modal).
      - Cabeçalho: Título "Ajustes do Mixer" e um botão "X" fechar (canto superior direito).
      - **Filtros de Lista (Pills):** Logo abaixo do título, existem dois botões "Pills": "Todos os Sons" e "Sons Ativos". O botão ativo ganha fundo/texto Azul Celeste brilhante, e o inativo fica apagado. Se "Sons Ativos" possuir itens, exibe um ponto verde (led) do lado do texto.
      - **Card Individual por Som (Ex: Chuva, Ruído Branco):**
        - Borda do Card (`border-white/10`).
        - Cabeçalho do Card: Ícone correspondente ao som (ex: nuvem para chuva), Nome do Som, e um pequeno badge "DESLIGADO" (cinza) ou "TOCANDO" (verde escuro). 
        - **Botão de Ligar (Switch):** Um Toggle Switch gigante nativo alinhado à direita no cabeçalho do Card (Azul quando ligado, cinza quando desligado).
        - **Volume Geral:** Um `<input type="range">` cobrindo a largura do card. A bolinha (thumb) e a trilha preenchida devem ser pintadas no tom Azul Celeste (`#38bdf8`).
        - **EQUALIZAÇÃO (FREQUÊNCIAS):** Seção interna do card com título minúsculo cinza. Possui um botão reset "Padrão" à direita.
        - **Sub-Sliders de Frequência:** O card é dividido em 3 blocos menores lado a lado (Graves, Médios, Agudos). Cada um possui o nome, a porcentagem (ex: 50%) e um `<input type="range">` fininho.
          - Cores Obrigatórias das "Bolinhas" (Thumbs) do equalizador: **Graves = Amarelo** (`#eab308`), **Médios = Roxo** (`#a855f7`), **Agudos = Ciano/Azul** (`#06b6d4`).
      - **Rodapé do Painel:** Botão flutuante principal "Concluir" posicionado à direita em Azul Celeste vivo. Ao lado esquerdo, existe um botão secundário menor com o ícone de marca-página "Salvar Mix" (que ao ser clicado vira um check verde escrito "Salvo nos Favoritos!").
  - **REGRA DE ISOLAMENTO (CRÍTICA):** No Modo Infantil, o botão de 3 pontinhos DEVE DESAPARECER completamente (desmontado do DOM/React Tree). A criança só pode ligar/desligar o som, sem acesso a frequências e equalizadores, para evitar distorções sensoriais.
- **Player Interno (Mesa Principal):** Renderizado no topo ou centro ao dar Play em áudios ativos.
  - **Botões do Player Principal:** Exibe controles de "Favoritar" (Salva o combo atual de áudios no BD), "Play/Pause" central, "Parar Tudo" (Stop) e "Salvar Refúgio".
  - **Background do Player:** Onde os Shaders WebGL rodam no Modo Infantil conforme a música dominante.

### 17.2 Tela DIÁRIO (DiaryView)
**Bloqueio Restrito (Modo Infantil):** O acesso a esta tela inteira exige a digitação do PIN Parental de 4 dígitos criado no Onboarding.
Dividida em **TRÊS sub-abas** no topo:

> **Sincronização Visual das Sub-abas (Crucial):** O indicador da sub-aba ativa no topo da tela (seja Registro, Análises ou Relatórios) DEVE herdar a exata mesma cor utilizada no cursor da Navbar (BottomNav) selecionada. 
> - **Tema Espaço Sideral:** Texto e sublinhado ativo em Roxo Galáctico (`#602EC9`).
> - **Tema Dinossauros:** Texto e sublinhado ativo em Verde Ácido (`#80F356`).
> - **Tema Carros:** Texto e sublinhado ativo em Amarelo Sinalização (`#FFE838`).
> - **Modo Adulto:** Azul Celeste padrão (`#38bdf8`).

#### A) Aba "Registro" (O Formulário do Diário)
- **Funcionalidade:** Onde o usuário inputa seu estado atual passando por 4 etapas estruturais: "Como você está agora?", "O que aconteceu?", "O que ajudou você a se acalmar?", e "Observação / Diário".
- **Sincronização Absoluta de Cores (UI Interna):** Todo e qualquer elemento interativo DENTRO deste formulário deve acender, marcar ou ser preenchido com a EXATA cor do tema selecionado (a mesma da Navbar: Azul Celeste, Roxo Galáctico, Verde Ácido ou Amarelo Sinalização). Isso inclui:
  - O cursor/slider numérico (Modo Adulto) ou a borda de seleção do Avatar (Modo Infantil) na seção "Como você está agora?".
  - Os botões (Pills) multi-seleção de "Gatilhos" e "Estratégias". Quando clicados, a borda, o texto e o fundo translúcido assumem a cor do tema.
  - A borda de foco (focus) da caixa de texto de Observações.
  - O Botão de envio no fim da página ("Salvar Registro" no Adulto / "Concluir" no Infantil). Ele terá o fundo translúcido, borda e o Glow (sombra) irradiando estritamente a cor do mundo escolhido.

#### B) Aba "Análises" (Dashboard de Insight IA)
- **Funcionalidade:** Renderiza os gráficos de progressão temporal (Barras/Linhas) baseados nas intensidades logadas. **Possui o Card de Insight da Inteligência Artificial** ancorado no topo, que processa a matriz de dados e devolve análises preditivas (descrito na Seção 16).
- **Design & Fontes:** 
  - Fundo limpo para não conflitar com a leitura de dados. 
  - Fonte dos Insights da IA: A caixa de Insight utiliza estilização Markdown (via lib `react-markdown`), com fonte `Inter` ou nativa de corpo (`sans-serif`), garantindo espaçamento confortável (line-height: 1.5).
  - O gráfico em si recebe highlights (pontos de inflexão) usando a Cor Accent do tema (Azul no adulto, Roxo/Amarelo/Verde no infantil).

#### C) Aba "Relatórios" (Exportação e Histórico)
- **Funcionalidade:** Exibe uma lista em formato de *Cards* com o histórico de PDFs ou relatórios já fechados. Permite baixar (`Download`) ou compartilhar (`Share2`) para o Psicólogo via API nativa de compartilhamento Web (`navigator.share`) (WhatsApp, Email).
- **Design:** Lista vertical contendo filtros (Mais Recentes, Mais Antigos, Mês, Ano).
- **Cores & Interações:** 
  - Os cartões de histórico ficam sob `rgba(255,255,255,0.05)` (Vidro/Glass).
  - O Botão "Compartilhar" ganha contorno e texto Azul Celeste (`#38bdf8`) com fundo translúcido `rgba(56,189,248,0.2)`.
  - O Botão "Excluir" (Lixeira) exige confirmação (*Slide down* ou Modais animadas usando `AnimatePresence`) e se pinta de Vermelho intenso (`#f43f5e`).

### 18.3 Tela SOCIAL (Comunidade)
- **Botão Publicar:** Existe EXCLUSIVAMENTE no Modo Adulto. A criança não tem permissão para publicar áudios.
- **Feed:** Uma lista de rolagem vertical (FlatList) com os *Soundscapes* (Mixes) compartilhados por outros usuários. Utiliza a "Lógica Semântica de Ícones" descrita na seção 10.
- **Player Interno de Rodapé (Comunidade):** Quando o usuário clica em um mix da comunidade, o player interno sobe no rodapé.
  - **Botões e Ações:** Este player específico exibe botões de "Play/Pause", um botão circular de "Loop" (`Repeat` icon) para tocar repetidamente o mix da comunidade, e o botão de "Coração" (`Heart`) que, ao ser clicado, salva o mix de terceiros na biblioteca local do usuário (Favorites).
  - **Animações (Glow/Equalizador):** Como já documentado, possui o equalizador dinâmico com barras pulsantes de acordo com o ritmo, e o ícone central pulsa anéis concêntricos suaves em 60fps usando animações reativas.

### 18.4 Tela GUARDIÃO (Rede de Apoio)
- **Modo Adulto:** Interface limpa, lista de contatos de emergência (Cards minimalistas), botão rápido para enviar SMS/WhatsApp de socorro.
- **Modo Infantil:** Esconde configurações complexas. Foca no monitoramento. Exibe o Semáforo Inteligente (Carros), ou o Fundo de Névoa (Dino), ou a Nebulosa (Espaço).

### 18.5 Tela EU (ProfileView / Configurações)
O centro de gerenciamento (Logoff, Trocar Conta, Editar Perfil).
- **Modo Adulto:** Lista de configurações em "Glass Cards" escuros, fundo limpo.
- **Modo Infantil:** Lista de configurações em "Glass Cards" com a cores principais de determinado tema, Sobreposto com as imagens flutuantes estritas documentadas anteriormente (Nave, Dino Fofo, Pódio). O Logout DEVE forçar a limpeza absoluta do estado global (Zustand/Contexto) para evitar vazamento do tema infantil caso o pai logue em seguida e vice-versa caso acessa deslogue pelo modo adulto para acessar o infantil.

**Funcionalidades Estritas dos Botões da Tela EU (ProfileView):**
O Agente Antigravity DEVE replicar o mapeamento funcional dos menus da tela EU:
1. **Editar Perfil (Nome):** Permite alterar o nome de usuário (exibido nas boas-vindas). 
2. **Faço acompanhamento com psicólogo:** Toggle switch que ativa ou desativa o painel extra de exportação (habilita o envio automático de relatórios em PDF do Diário).
3. **Contatos de Emergência:** Abre uma SubView para Adicionar, Editar ou Excluir números de telefone (usados no botão SOS Pânico e envio de SMS).
4. **Permissões do Sistema:** Gerenciador de acessos essenciais do aparelho. Solicita explicitamente permissão de Localização (GPS para o Guardião) e Notificações (para lembretes de diário e alertas).
5. **Tema Infantil (Apenas se configurado):** Abre a SubView de seleção de MUNDOS (Dinossauro, Carros, Espaço), que já injeta a cor correspondente em toda a UI.
6. **Trocar de Usuário (Logout Seguro):** Botão com destaque leve. Encerra a sessão, volta para AuthView e OBRIGATORIAMENTE executa a função de "Reset Total de Estado" (limpa Contexts/Zustand e navegação).
7. **Apagar Conta (Danger/Pânico):** Botão sublinhado ou vermelho. Exige confirmação ("Tem certeza?"). Exclui definitivamente as chaves locais (`localStorage` ou `IndexedDB`) atreladas àquele `email` (Isolamento de Dados).

---

## 19. Paleta de Cores Temáticas Estritas (Hexadecimais)

O Antigravity DEVE respeitar estritamente estas paletas (utilizando Tailwind classes ou `StyleSheet`), sem inventar cores genéricas.

- **MODO ADULTO (Padrão/Sóbrio):**
  - **Fundo Base:** `#060b13` (Preto/Azul muito profundo).
  - **Cor de Destaque (Accent):** Azul Celeste (`#38bdf8`).
  - **Painéis/Cards:** Transparente com bordas sutis. (Cor base `rgba(255, 255, 255, 0.05)`, Bordas `rgba(255, 255, 255, 0.1)`, Hover `rgba(255, 255, 255, 0.1)` e `0.15` no Active).
  - **Botões Ativos:** Fundo `rgba(56, 189, 248, 0.15)` e Borda `rgba(56, 189, 248, 0.5)` com box-shadow leve.

- **MODO INFANTIL - TEMA DINOSSAUROS:**
  - **Cores Primárias:** Verde Musgo (`#2a4806` ou `rgba(42, 72, 6, 1)`) e Laranja Frio/Marrom (`#895C07` ou `rgba(137, 92, 7, 0.5)` com 50% de opacidade).
  - **Laranja Destaque Geral:** O aplicativo usa o laranja forte na transição para o infantil (`#ff5c00`).
  - **Background EU/Perfil (DinoProfileBackground):** Possui um grandiente linear explícito do Laranja Frio com 50% de opacidade para o Verde Musgo Sólido:
    `background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'`
  - **Painéis Opacos (Eu/Perfil):** A cor sólida opaca injetada para quebrar o vidro transparente padrão é `#553100` (Marrom Terra Sólido).
  - **Bordas e Efeitos:** Brilhos e contornos puxando para o verde selva e laranja âmbar.

- **MODO INFANTIL - TEMA ESPAÇO SIDERAL:**
  - **Cores Primárias:** Roxo Cósmico / Índigo (`#6366f1` a `#a855f7`).
  - **Painéis e Fundos:** Fundos profundamente escuros (espaço).
  - **Bordas e Sombras (Glow):** Fundo Roxo com 20% de opacidade (`bg-indigo-500/20`), Borda Sólida (`border-indigo-500`), Sombra Neon/Glow de 40% (`shadow-[0_0_20px_rgba(99,102,241,0.4)]`). Na tela de perfil o glow da extremidade é puro `box-shadow: 0 0 20px rgba(99,102,241,0.4)`.
  - **Botões:** Indigo vibrante.

- **MODO INFANTIL - TEMA CARROS:**
  - **Fundo Base (EU/Perfil):** Diferente do Adulto que é um Dark Blue, o fundo base para o tema carros usa um **Preto muito profundo com 93% de opacidade** (`backgroundColor: 'rgba(0, 0, 0, 0.93)'`).
  - **Cores Primárias (Seleção e Destaque):** O aplicativo utiliza Amarelo (`#eab308`) como destaque em painéis, mas nos seletores e alertas principais usa o Vermelho. O card de seleção do Onboarding utiliza **Vermelho 20% no fundo** (`bg-red-500/20`), Borda Sólida vermelha e Glow Neon Vermelho de 40% (`shadow-[0_0_20px_rgba(239,68,68,0.4)]`).
  - **Luzes Semáforo (Guardião):** 
    - Verde Seguro: Fundo sólido do neon (`#10b981` ou `bg-emerald-400`), Sombra espalhada (`shadow-[0_0_25px_#10b981]`), Base desligada opaca 40% (`bg-emerald-950/40`).
    - Amarelo Atenção (`#f59e0b` ou `bg-amber-400`), Sombra (`shadow-[0_0_25px_#f59e0b]`), Base desligada 40% (`bg-amber-950/40`).
    - Vermelho Perigo (`#ef4444` ou `bg-red-500`), Sombra (`shadow-[0_0_25px_#ef4444]`), Base desligada 40% (`bg-red-950/40`).


---

## 20. Interações, Hover e Estados de Clique (Feedback Tátil)

O aplicativo web possui uma mecânica de feedback visual rigorosa (usando `:hover` e `:active` no CSS e Tailwind). Como o React Web **não possui hover de mouse**, o Agente Antigravity DEVE traduzir todo esse comportamento para **Estados de Pressão (Press/Touch)** utilizando o componente `<Pressable>` ou animações do `framer-motion` (escala e opacidade).

A regra de ouro do aplicativo é: **Nenhum botão é estático. Todos reagem ao toque.**

### 20.1 Mecânica Global de Escala (Active State)
- Todos os botões clicáveis do aplicativo web usam a classe `active:scale-95` ou `transform: scale(0.98)` no CSS.
- **Botões Web:** O Agente deve estilizar os botões interativos com Tailwind CSS, aplicando `active:scale-95` para transformação de encolhimento de 0.95.

### 20.2 Comportamento Específico por Componente
- **Botões de Emergência (Meu Refúgio e SOS Pânico):** 
  - *Web:* Ganham brilho extra e encolhem (`active:scale-95`). O "SOS Pânico" vibra visualmente.
  - *Mobile:* Devem usar animação de "spring" (mola) no clique para dar peso e urgência. Ao tocar, a sombra (Glow Neon) deve expandir levemente enquanto o botão encolhe.
- **Toggles do Mixer Principal (Ativar/Desativar Sons):**
  - *Web:* Botões de vidro (`glass-card`). No `:hover` passam de fundo `rgba(255, 255, 255, 0.05)` para `0.1` e borda `0.25`. No clique (`:active`), o fundo vai para `0.15` e o botão encolhe. Quando ativados (`glass-card-active`), recebem um brilho azul (`rgba(56, 189, 248, 0.15)`).
  - *Mobile:* Como não há hover, o momento do `pressed` no `<Pressable>` deve engatilhar imediatamente o estado `:active` (fundo `0.15` e `scale(0.98)`). 
- **Aba Social (Mixes da Comunidade e Filtros):**
  - Os botões de Filtro (ex: "Foco", "Relaxamento") no topo da aba Social são "Pills" (pílulas). Quando não selecionados, têm borda sutil e fundo transparente. Ao clicar, dão um "pulo" (`active:scale-95`) e se preenchem com a cor de destaque (Azul no adulto, Laranja/Roxo/Vermelho nos temas infantis).
  - Os Cards de Áudio compartilhados na timeline reagem ficando levemente mais claros (iluminados) ao serem pressionados antes de o áudio começar a tocar no rodapé.
- **Menus e Opções da Tela EU (Configurações):**
  - Itens de lista como "Editar Perfil" ou "Meus Contatos" usam `hover:bg-white/10` e `active:bg-white/10`.
  - *Mobile:* O Agente deve usar `underlayColor` (se usar `TouchableHighlight`) ou alterar o background para `rgba(255,255,255,0.1)` (ou fundo mais escuro nos temas) durante o toque (`pressed`), fornecendo resposta imediata ao dedo do usuário.

---

## 21. Controles Deslizantes (Cursores) do Player Interno Infantil

No Mixer Principal, quando o "Player Interno" é expandido no Modo Infantil, os cursores (thumbs) dos controles de áudio abandonam o visual padronizado e tornam-se elementos lúdicos interativos, customizados por tema.

### 21.1 Imagens dos Cursores de Volume
O Slider de Volume Mestre utiliza imagens estritas como *thumb* (a "bolinha" que o usuário arrasta):
- **Tema Espaço Sideral:** `rocekt.png` (O foguete).
- **Tema Dinossauros:** `fossil_rex` (O Fossil do Rex).
- **Tema Carros (A Exceção Animada):** O cursor de volume NÃO utiliza PNG. É um **carro animado desenhado do zero**.
  - **Implementação Web:** O Agente Antigravity deve construir este cursor utilizando `framer-motion`. O carro deve ser montado via SVG ou `<div>` estilizadas. Conforme o usuário arrasta o cursor (com `onDrag`), o valor `X` deve ser extrapolado para aplicar uma animação de rotação nas rodas do carro, simulando o pneu girando proporcionalmente ao arrasto.

### 21.2 Imagens dos Cursores de Equalização (Mixer Avançado Infantil)
*(Nota: O botão de 3 pontinhos sumiu da tela Inicial, mas dentro do **Player Interno Expandido**, a criança possui controles lúdicos de frequência).*
As três frequências básicas (Graves, Médios, Agudos) utilizam os seguintes assets como *thumb*:
- **Tema Espaço Sideral:**
  - Graves: `et.png`
  - Médios: `et.png`
  - Agudos: `et.png` 
- **Tema Dinossauros:**
  - Graves: `dinosaur_smile.png` 
  - Médios: `dinosaur_smile.png` 
  - Agudos: `dinosaur_smile.png` 
- **Tema Carros:** 
  - Graves: `helmet.png` 
  - Médios: `helmet.png` 
  - Agudos: `helmet.png` 

O Agente deve substituir a propriedade `thumbImage` (se suportada pela lib de slider nativa) ou construir um Slider customizado usando Reanimated (`useAnimatedStyle`) onde a Imagem/View translada sobre a linha do volume.

---

## 22. Barra de Navegação Inferior (Bottom Tabs / Navbar)

A barra de navegação principal (BottomNav) não é um componente estático padrão. Ela possui um design de **Glassmorphism flutuante** com inteligência de cores que mapeia ativamente o Modo e Tema atual do usuário. O Agente Antigravity DEVE construir este componente com `<nav>` e `<button>` HTML, respeitando a fidelidade absoluta dos estilos abaixo.

### 22.1 Estrutura e Ícones (Lucide)
O Navbar contém 5 abas representadas estritamente pelos seguintes ícones (importados da biblioteca `lucide-react`):
1. **Início (Home):** Ícone `Home`
2. **Guardião (Shield):** Ícone `Shield`
3. **Social (Users):** Ícone `Users`
4. **Diário (BarChart2):** Ícone `BarChart2`
5. **Eu (User):** Ícone `User`

### 22.2 Layout e Vidro Flutuante (Glassmorphism)
- **Container Flutuante:** A barra não é colada nas bordas da tela. Ela é um "Pill" flutuante posicionado no rodapé (`bottom-6` ou `paddingBottom: 24`), centralizado com largura máxima (`max-w-md`), contornos totalmente arredondados (`rounded-full`), e recebe uma borda fina de luz `border-white/10`.
- **Dinâmica de Blur (Desfoque):**
  - **Modo Adulto:** Aplica-se um desfoque intenso `blur(12px)` simulando vidro fosco (`glass-card`).
  - **Modo Infantil:** O desfoque é reduzido estritamente para `blur(2px)`. Como os fundos infantis são muito mais vivos (3D shaders, nuvens e pistas), o desfoque intenso geraria "borrões" feios na tela.

### 22.3 Feedback de Seleção e Cores Temáticas Ativas
Ao clicar em uma aba, o ícone aumenta de espessura (de `strokeWidth={1.75}` para `2.5`), o texto da label muda para Branco puro (`text-white font-semibold`), e o aplicativo injeta uma bolha de brilho (Glow Background) e pinta a linha do ícone com a **Cor Exata do Tema Ativo**:

- **Modo Adulto (Padrão):** 
  - Cor do Ícone: Azul Celeste (`#38bdf8`).
  - Glow/Background do Ícone: `bg-accent-blue/20` com `blur-md`.
- **Modo Infantil - Tema Espaço Sideral:** 
  - Cor do Ícone: Roxo Galáctico (`#602EC9`).
  - Glow/Background do Ícone: `bg-[#602EC9]/30`.
- **Modo Infantil - Tema Dinossauros:** 
  - Cor do Ícone: Verde Ácido/Neon (`#80F356` / `rgba(128, 243, 86, 0.95)`).
  - Glow/Background do Ícone: `bg-[#80F356]/25`.
- **Modo Infantil - Tema Carros:** 
  - Cor do Ícone: Amarelo Sinalização (`#FFE838`). *(Nota: É exatamente este amarelo vívido exibido na aba ativa do "Início").*
  - Glow/Background do Ícone: `bg-[#FFE838]/20`.

**Diretriz Arquitetural Web:** Para os textos das labels que possuem tamanho `11px` (`text-[11px]`), use a fonte padrão de UI do app (`Inter` ou font do sistema nativo `system-ui`). Para o Glow/Sombra atrás do ícone selecionado, em vez de CSS filter blur, utilize uma `<View>` em posição absoluta atrás do ícone renderizado, pintada com a cor do tema, baixa opacidade, bordas arredondadas e um leve efeito de elevação ou blur nativo para não comprometer a performance.
