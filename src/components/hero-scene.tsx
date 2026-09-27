"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * A small "distributed systems" network graph rendered in real WebGL - a
 * cluster of nodes connected by edges, amber-on-near-black to match the
 * site's single-accent brand. Not decoration for its own sake: it's meant
 * to read as the same kind of graph a platform engineer would draw on a
 * whiteboard, just rendered in 3D.
 */

type Node = { position: [number, number, number]; scale: number };

function seededNodes(count: number): Node[] {
  // Deterministic pseudo-random layout (no Math.random) so server and
  // client agree and the graph doesn't reshuffle on every reload.
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => ({
    position: [
      (rand() - 0.5) * 4.2,
      (rand() - 0.5) * 3.2,
      (rand() - 0.5) * 2.4,
    ],
    scale: 0.14 + rand() * 0.16,
  }));
}

function buildEdges(nodes: Node[], maxDist: number): [Node, Node][] {
  const edges: [Node, Node][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].position;
      const b = nodes[j].position;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d < maxDist) edges.push([nodes[i], nodes[j]]);
    }
  }
  return edges;
}

function NetworkGraph({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => seededNodes(9), []);
  const edges = useMemo(() => buildEdges(nodes, 2.1), [nodes]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (reduced) return;

    // gentle autonomous drift
    group.current.rotation.y += delta * 0.06;

    // subtle pointer-driven parallax tilt, lerped for smoothness
    target.current.x = (state.pointer.x * Math.PI) / 24;
    target.current.y = (state.pointer.y * Math.PI) / 32;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -target.current.y,
      0.04,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      target.current.x * 0.15,
      0.04,
    );
  });

  const scale = Math.min(viewport.width / 6, 1.15);

  return (
    <group ref={group} scale={scale}>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          points={[a.position, b.position]}
          color="#f5a524"
          transparent
          opacity={0.22}
          lineWidth={1}
        />
      ))}
      {nodes.map((n, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : 0.6 + (i % 3) * 0.25}
          rotationIntensity={reduced ? 0 : 0.4}
          floatIntensity={reduced ? 0 : 0.5 + (i % 4) * 0.15}
        >
          <mesh position={n.position} scale={n.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#f5a524"
              emissive="#f5a524"
              emissiveIntensity={i === 0 ? 1.1 : 0.55}
              roughness={0.35}
              metalness={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function HeroScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 2, 4]} intensity={30} color="#f5a524" />
      <pointLight position={[-4, -2, -2]} intensity={8} color="#ffffff" />
      <fog attach="fog" args={["#09090b", 4, 10]} />
      <NetworkGraph reduced={reduced} />
      {!reduced && (
        <Sparkles count={40} scale={5} size={1.4} speed={0.15} opacity={0.35} color="#f5a524" />
      )}
    </Canvas>
  );
}
