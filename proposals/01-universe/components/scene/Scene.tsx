'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ParticleField } from './ParticleField';

type SceneProps = {
  sectionProgress: number;
  /** Real-time universe stream tick — particles react when this changes. */
  streamTick?: number;
};

function CameraDrift() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.z = 1.2 + 0.1 * Math.sin(t * 0.18);
    camera.position.x = 0.065 * Math.sin(t * 0.14);
    camera.position.y = 0.05 * Math.cos(t * 0.16);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneInner({ sectionProgress, streamTick = 0 }: SceneProps) {
  const [mouseNorm, setMouseNorm] = useState<[number, number]>([0, 0]);

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    setMouseNorm([x, y]);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#0a1628', 0.4, 3.0]} />
      <ambientLight intensity={0.06} />
      <pointLight position={[0.3, 0, 0.5]} color="#facc15" intensity={0.22} />
      <pointLight position={[-0.2, 0.2, 0.4]} color="#22d3ee" intensity={0.15} />
      <ParticleField mouseNorm={mouseNorm} sectionProgress={sectionProgress} streamTick={streamTick} />
      <CameraDrift />
    </>
  );
}

function Fallback() {
  return null;
}

export function Scene({ sectionProgress, streamTick = 0 }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1.2], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <Suspense fallback={<Fallback />}>
          <SceneInner sectionProgress={sectionProgress} streamTick={streamTick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
