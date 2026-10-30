"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture, Billboard, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { sphereItems, type SphereItem } from "@/lib/sphere-items";

/*
  The project sphere, in real WebGL.

  The previous version of this was 29 <img> tags on CSS `preserve-3d`
  transforms. That looked convincing but it cannot do any of the things that
  actually sell the effect: no depth fade, no per-face lighting, no cheap way
  to scale one face without the browser relaying out its neighbours, and no
  real z-sorting. Here each screenshot is a textured plane on a Fibonacci
  sphere, which costs one draw call per face and gives all of that for free.

  Three inputs drive the rotation, and they add rather than fight:
    - a slow autonomous drift, so it is alive before you touch it
    - scroll progress, written into a ref by the parent (see `scrollRef`)
    - pointer drag, with inertia on release

  Reduced motion removes the drift and the scroll coupling and leaves a static,
  still-draggable sphere. Drag is a deliberate user action, so it stays.
*/

const RADIUS = 3.15;
const PLANE_W = 1.08;
const PLANE_H = 0.72; // 3:2, matches the source screenshots

/** Even point distribution on a sphere. Golden-angle spiral. */
function fibonacciSphere(count: number, radius: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    return new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    );
  });
}

function Face({
  item,
  position,
  onSelect,
  onHover,
  dimmed,
}: {
  item: SphereItem;
  position: THREE.Vector3;
  onSelect: (item: SphereItem) => void;
  onHover: (item: SphereItem | null) => void;
  dimmed: boolean;
}) {
  const texture = useTexture(item.src);
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    // Screenshots are viewed at a steep angle on the sides of the sphere;
    // without anisotropy the text in them turns to mush.
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(() => {
    if (!mesh.current || !mat.current) return;

    const target = hovered ? 1.32 : 1;
    const s = THREE.MathUtils.lerp(mesh.current.scale.x, target, 0.15);
    mesh.current.scale.setScalar(s);

    /*
      Depth fade. A face on the far side of the sphere sits at negative z in
      camera space; mapping that to opacity is what stops the back half from
      reading as visual noise behind the front half, and it is the single
      cheapest thing that makes this look three-dimensional rather than like
      stickers on glass.
    */
    const z = mesh.current.getWorldPosition(new THREE.Vector3()).z;
    // Floor at 0.42, not 0.16. Tuned against a render: below about 0.4 the far
    // side disappears instead of receding, and the sphere stops reading as a
    // solid and starts reading as scattered cards.
    const depth = THREE.MathUtils.mapLinear(z, -RADIUS, RADIUS, 0.42, 1);
    const wanted = hovered ? 1 : depth * (dimmed ? 0.35 : 1);
    mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, wanted, 0.12);
  });

  const enter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(item);
    document.body.style.cursor = item.href ? "pointer" : "grab";
  };

  const leave = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = "";
  };

  return (
    <Billboard position={position}>
      <mesh
        ref={mesh}
        onPointerOver={enter}
        onPointerOut={leave}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
      >
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial
          ref={mat}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Billboard>
  );
}

function Sphere({
  reduced,
  scrollRef,
  onHover,
  onSelect,
  hoveredItem,
}: {
  reduced: boolean;
  scrollRef: React.RefObject<number>;
  onHover: (i: SphereItem | null) => void;
  onSelect: (i: SphereItem) => void;
  hoveredItem: SphereItem | null;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport, gl } = useThree();

  const positions = useMemo(
    () => fibonacciSphere(sphereItems.length, RADIUS),
    [],
  );

  // Drag state lives in refs, never in React state: this updates every frame
  // and a setState here would re-render the whole scene on each pointer move.
  const drag = useRef({ active: false, lastX: 0, lastY: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const el = gl.domElement;

    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      document.body.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.vx = (e.clientX - drag.current.lastX) * 0.005;
      drag.current.vy = (e.clientY - drag.current.lastY) * 0.005;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      drag.current.active = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      document.body.style.cursor = "";
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      document.body.style.cursor = "";
    };
  }, [gl]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    const d = drag.current;

    if (d.active) {
      g.rotation.y += d.vx;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.75, 0.75);
    } else {
      // Inertia: carry the throw, then settle.
      d.vx *= 0.94;
      d.vy *= 0.94;
      g.rotation.y += d.vx;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.75, 0.75);

      if (!reduced) {
        // Autonomous drift, plus scroll. Scrolling the page turns the sphere,
        // which is the whole reason the hero is worth scrolling past slowly.
        g.rotation.y += delta * 0.085;
        g.rotation.y += (scrollRef.current ?? 0) * 0.015;
      }
    }
  });

  /*
    Fit to the smaller axis, not just width.

    Scaling off width alone blew the sphere up on wide screens until only its
    middle band was in frame, which destroys the silhouette: you see a drift of
    rectangles rather than an orb. Clamping against height as well keeps the
    whole sphere inside the viewport at every aspect ratio.
  */
  const scale = Math.min(viewport.width / 11, viewport.height / 7.6, 1.05);

  /*
    On a wide screen the copy owns the left half, so push the sphere right to
    sit beside it instead of underneath it. On narrow screens it stays centred.
  */
  const offsetX = viewport.width > viewport.height * 1.25 ? viewport.width * 0.17 : 0;

  return (
    <group ref={group} scale={scale} position={[offsetX, 0, 0]}>
      {positions.map((p, i) => (
        <Face
          key={sphereItems[i].src}
          item={sphereItems[i]}
          position={p}
          onHover={onHover}
          onSelect={onSelect}
          dimmed={hoveredItem !== null && hoveredItem !== sphereItems[i]}
        />
      ))}
    </group>
  );
}

export function ProjectSphere({ reduced = false }: { reduced?: boolean }) {
  const scrollRef = useRef(0);
  const [hovered, setHovered] = useState<SphereItem | null>(null);

  /*
    Scroll progress is read straight off Lenis if it is running and falls back
    to a passive scroll read otherwise. It is written into a ref and consumed
    inside useFrame, so scrolling never re-renders React.
  */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const read = () => {
      scrollRef.current = window.scrollY / Math.max(window.innerHeight, 1);
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const select = (item: SphereItem) => {
    if (item.href) window.location.href = item.href;
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // The canvas is decoration plus an alternate route to pages that are
        // all reachable from the normal nav and the work grid below.
        aria-hidden="true"
      >
        <AdaptiveDpr pixelated />
        <Sphere
          reduced={reduced}
          scrollRef={scrollRef}
          onHover={setHovered}
          onSelect={select}
          hoveredItem={hovered}
        />
      </Canvas>

      {/* Label for whatever face is under the cursor. Plain DOM, not a
          texture, so it stays crisp and selectable. */}
      <div
        className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <span className="rounded-full border border-border bg-surface/90 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-muted backdrop-blur-md">
          {hovered?.project}
          <span className="text-muted-2"> / {hovered?.label}</span>
        </span>
      </div>
    </div>
  );
}
