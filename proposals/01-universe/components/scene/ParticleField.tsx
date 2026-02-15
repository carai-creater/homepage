'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 14000;
const COLOR_GOLD = new THREE.Color('#facc15');
const COLOR_CYAN = new THREE.Color('#22d3ee');

type ParticleFieldProps = {
  mouseNorm: [number, number];
  sectionProgress: number;
  /** Real-time "universe stream" tick — when this changes, the field subtly reacts (only AI can "download the universe" and keep it changing). */
  streamTick?: number;
};

export function ParticleField({ mouseNorm, sectionProgress, streamTick = 0 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, phases, speed } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speed = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.PI * 2 * Math.random();
      const r = 0.2 + 0.9 * Math.pow(Math.random(), 0.55);
      const sx = r * Math.sin(phi) * Math.cos(theta);
      const sy = r * Math.sin(phi) * Math.sin(theta);
      const sz = r * Math.cos(phi);
      positions[i * 3 + 0] = sx;
      positions[i * 3 + 1] = sy;
      positions[i * 3 + 2] = sz;

      scales[i] = 0.1 + Math.random() * 0.4;
      phases[i] = Math.PI * 2 * Math.random();
      speed[i] = 0.3 + Math.random() * 0.7;
    }

    return { positions, scales, phases, speed };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    materialRef.current.uniforms.uTime.value = t;
    materialRef.current.uniforms.uMouse.value.set(mouseNorm[0], mouseNorm[1]);
    materialRef.current.uniforms.uSectionProgress.value = sectionProgress;
    materialRef.current.uniforms.uDrift.value = 1.0;
    materialRef.current.uniforms.uStreamTick.value = streamTick;
  });

  const vert = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseInfluence;
    uniform float uSectionProgress;
    uniform float uDrift;
    uniform float uStreamTick;

    attribute float aScale;
    attribute float aPhase;
    attribute float aSpeed;

    varying float vAlpha;
    varying float vScale;
    varying float vPhase;

    void main() {
      vec3 pos = position;

      float streamPulse = 0.015 * sin(uStreamTick * 0.7) + 0.01 * cos(uStreamTick * 0.3);
      float waveX = (0.04 + streamPulse) * sin(2.5 * position.x + uTime * 1.8 + aPhase) + 0.03 * cos(3.0 * position.z + uTime * 1.2 + aPhase * 1.3);
      float waveY = (0.035 + streamPulse * 0.8) * cos(2.8 * position.y + uTime * 1.5 + aPhase * 0.9) + 0.025 * sin(2.2 * position.x + uTime * 1.1 + aPhase);
      float waveZ = 0.03 * sin(2.6 * position.z + uTime * 1.4 + aPhase * 1.1) + streamPulse * 0.5;
      pos.x += waveX;
      pos.y += waveY;
      pos.z += waveZ;

      float rotY = uTime * 0.095;
      float cy = cos(rotY);
      float sy = sin(rotY);
      pos.x = position.x * cy - position.z * sy;
      pos.z = position.x * sy + position.z * cy;
      pos.y = position.y;

      float rollX = uTime * 0.082;
      float cx = cos(rollX);
      float sx = sin(rollX);
      float y2 = pos.y * cx - pos.z * sx;
      float z2 = pos.y * sx + pos.z * cx;
      pos.y = y2;
      pos.z = z2;

      float rollZ = uTime * 0.07;
      float cz = cos(rollZ);
      float sz = sin(rollZ);
      float x2 = pos.x * cz - pos.y * sz;
      float y3 = pos.x * sz + pos.y * cz;
      pos.x = x2;
      pos.y = y3;

      float breathe = 0.03 * sin(uTime * 0.4 + aPhase) + 0.025 * cos(uTime * 0.5 + aPhase * 2.0);
      pos *= 1.0 + breathe;

      float driftScale = aSpeed * uDrift;
      pos.z -= driftScale * 0.068;
      pos.x += driftScale * 0.028 * sin(uTime * 0.38 + aPhase * 3.0);
      pos.y += driftScale * 0.022 * cos(uTime * 0.32 + aPhase * 1.5);

      float parallax = 0.038 * aSpeed * (sin(uTime * 0.45 + aPhase) * pos.x + cos(uTime * 0.4 + aPhase * 0.7) * pos.z);
      pos.x += parallax;
      pos.z += parallax * 0.7;

      vec2 toMouse = uMouse - vec2(pos.x, pos.z);
      float dist = length(toMouse);
      float pull = uMouseInfluence * 0.12 * (1.0 / (1.0 + dist * 2.5));
      pos.x += toMouse.x * pull;
      pos.z += toMouse.y * pull;

      float contract = 1.0 - uSectionProgress * 0.25;
      pos *= contract;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = aScale * (52.0 / -mvPosition.z);

      vAlpha = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 1.35 + aPhase * 2.0));
      vScale = aScale;
      vPhase = aPhase;
    }
  `;

  const frag = `
    uniform vec3 uColor;
    uniform vec3 uColor2;
    uniform float uTime;
    varying float vAlpha;
    varying float vScale;
    varying float vPhase;

    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c) * 2.0;
      float core = 1.0 - smoothstep(0.0, 0.7, d);
      float glow = 1.0 - smoothstep(0.0, 1.25, d);
      float alpha = (core * 0.7 + glow * 0.35) * vAlpha * vScale;

      float q = 0.5 + 0.5 * sin(uTime * 0.9 + vPhase * 2.0);
      vec3 col = mix(uColor, uColor2, q * 0.55);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={PARTICLE_COUNT}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={PARTICLE_COUNT}
          array={phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={PARTICLE_COUNT}
          array={speed}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: 0.5 },
          uSectionProgress: { value: 0 },
          uDrift: { value: 1.0 },
          uStreamTick: { value: 0 },
          uColor: { value: COLOR_GOLD },
          uColor2: { value: COLOR_CYAN },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
