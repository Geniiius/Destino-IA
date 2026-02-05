/**
 * @file components/ui/Aurora.tsx
 * @description Effet de fond animé Aurora utilisant WebGL/OGL
 * Créé un dégradé fluide et organique avec des couleurs personnalisables
 */

import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec3 dist(vec3 x, vec3 y, bool manhattanDistance) {
  return manhattanDistance ? abs(x - y) : (x - y) * (x - y);
}

vec2 worley(vec2 P, float jitter, bool manhattanDistance) {
  float K = 0.142857142857;
  float Ko = 0.428571428571;
  vec2 Pi = mod(floor(P), 289.0);
  vec2 Pf = fract(P);
  vec3 oi = vec3(-1.0, 0.0, 1.0);
  vec3 of = vec3(-0.5, 0.5, 1.5);
  vec3 px = permute(Pi.x + oi);
  vec3 py = permute(Pi.y + oi);
  vec3 p, ox, oy, dx, dy;
  vec2 F = vec2(1e6);
  
  for(int i = 0; i < 3; i++) {
    p = permute(px[i] + py);
    ox = fract(p * K) - Ko;
    oy = mod(floor(p * K), 7.0) * K - Ko;
    p = mod(p, 289.0);
    dx = Pf.x + 0.5 + jitter * ox - of[i];
    dy = Pf.y + 0.5 + jitter * oy;
    vec3 d = dist(dx, dy, manhattanDistance);
    
    for(int n = 0; n < 3; n++) {
      if(d[n] < F[0]) {
        F[1] = F[0];
        F[0] = d[n];
      } else if(d[n] < F[1]) {
        F[1] = d[n];
      }
    }
  }
  
  return manhattanDistance ? F : sqrt(F);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  
  float t = uTime * 0.1;
  vec2 p1 = vec2(uv.x * 2.0 + t, uv.y * 2.0 + t * 0.5);
  vec2 p2 = vec2(uv.x * 2.0 - t * 0.7, uv.y * 2.0 - t * 0.3);
  
  vec2 F1 = worley(p1 * 3.0, 1.0, false);
  vec2 F2 = worley(p2 * 3.0, 1.0, false);
  
  float noise = (F1.x + F1.y) * 0.5 + (F2.x + F2.y) * 0.5;
  noise = smoothstep(0.3, 0.7, noise);
  
  float wave = sin(uv.x * 3.14159 * 2.0 + t) * 0.5 + 0.5;
  wave = pow(wave, 2.0) * uAmplitude;
  
  vec3 color1 = uColorStops[0];
  vec3 color2 = uColorStops[1];
  vec3 color3 = uColorStops[2];
  
  vec3 color = mix(color1, color2, noise);
  color = mix(color, color3, wave);
  
  color = mix(color, vec3(0.0), (1.0 - uBlend));
  
  fragColor = vec4(color, 1.0);
}
`;

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#10b981', '#3b82f6', '#8b5cf6'],
  blend = 0.6,
  amplitude = 0.8,
  speed = 0.3,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize WebGL
    const renderer = new Renderer({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Convert hex colors to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1]!, 16) / 255,
            parseInt(result[2]!, 16) / 255,
            parseInt(result[3]!, 16) / 255,
          ]
        : [0, 0, 0];
    };

    const colors = colorStops.map(hexToRgb);

    // Create program
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colors.flat() },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uBlend: { value: blend },
      },
    });

    // Create mesh
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    // Animation loop
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      program.uniforms.uTime.value = elapsed * speed;
      renderer.render({ scene: mesh });
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [
        window.innerWidth,
        window.innerHeight,
      ];
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (meshRef.current) {
        meshRef.current.geometry?.remove();
        meshRef.current.program?.remove();
      }
    };
  }, [colorStops, blend, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default Aurora;
