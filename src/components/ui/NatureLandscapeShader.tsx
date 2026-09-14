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
