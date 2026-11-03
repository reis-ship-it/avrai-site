"use client";

import { useEffect, useId, useRef, useState } from "react";

type Three = typeof import("three");

const SEGMENTS = 176;
const SIDES = 14;
const LOOP_COUNT = 3;
const TWO_PI = Math.PI * 2;
const ONYX = "#08090b";

function pointOnLoop(loop: number, t: number, openness: number, time: number) {
  const breath = openness - 0.5;
  const cosine = Math.cos(t);
  const sine = Math.sin(t);

  if (loop === 1) {
    // The tilted middle ring passes through each outer ring's open center.
    return [
      (0.55 + 0.025 * breath) * cosine,
      0.5 + (0.95 + 0.035 * breath) * sine,
      (0.85 + 0.025 * breath) * cosine + 0.02 * Math.sin(3 * t + time * 0.2),
    ] as const;
  }

  const side = loop === 0 ? -1 : 1;
  const phase = loop === 0 ? 0 : 1.7;
  const radius = 1.03 + 0.06 * breath;
  return [
    side * 0.82 + radius * cosine * (1 + 0.025 * Math.sin(3 * t + phase)),
    -0.4 + radius * sine * (1 + 0.02 * Math.cos(2 * t + phase)),
    side * 0.45 + 0.02 * Math.sin(2 * t + time * 0.25 + phase),
  ] as const;
}

// This vector remains visible until WebGL has drawn its first frame, and when
// WebGL is unavailable or the context is lost.
const fallbackArcs = Array.from({ length: LOOP_COUNT * 12 }, (_, index) => {
  const loop = Math.floor(index / 12);
  const arc = index % 12;
  const points = Array.from({ length: 17 }, (_, point) =>
    pointOnLoop(loop, ((arc + point / 16) / 12) * TWO_PI, 0.82, 0),
  );
  return {
    loop,
    depth: points.reduce((sum, point) => sum + point[2], 0) / points.length,
    path: points
      .map(([x, y], point) => `${point === 0 ? "M" : "L"}${(x * 78).toFixed(2)},${(-y * 78).toFixed(2)}`)
      .join(" "),
  };
}).sort((a, b) => a.depth - b.depth);

function makeEnvironmentCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");

  const backdrop = context.createLinearGradient(0, 0, 0, 512);
  backdrop.addColorStop(0, "#343b4b");
  backdrop.addColorStop(0.42, "#0b1019");
  backdrop.addColorStop(0.6, "#1d2531");
  backdrop.addColorStop(1, "#070a10");
  context.fillStyle = backdrop;
  context.fillRect(0, 0, 1024, 512);

  const panel = (x: number, width: number, color: string, height = 350) => {
    const light = context.createLinearGradient(x, 0, x + width, 0);
    light.addColorStop(0, "transparent");
    light.addColorStop(0.23, color);
    light.addColorStop(0.48, "#f7fbff");
    light.addColorStop(0.62, color);
    light.addColorStop(1, "transparent");
    context.fillStyle = light;
    context.fillRect(x, 42, width, height);
  };

  // These studio panels are only reflected by the knot; none is in the scene.
  panel(32, 190, "#ec80ef");
  panel(250, 110, "#b8f5ff", 410);
  panel(393, 170, "#64e5ff");
  panel(605, 185, "#c186ff", 390);
  panel(826, 150, "#ffce89");

  const rim = context.createLinearGradient(0, 0, 0, 110);
  rim.addColorStop(0, "rgba(245,250,255,.9)");
  rim.addColorStop(1, "rgba(245,250,255,0)");
  context.fillStyle = rim;
  context.fillRect(0, 0, 1024, 110);

  return canvas;
}

function makeTube(THREE: Three, loop: number) {
  const points = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const tangents = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const normals = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const binormals = Array.from({ length: SEGMENTS }, () => new THREE.Vector3());
  const vertexCount = SEGMENTS * SIDES;
  const positions = new Float32Array(vertexCount * 3);
  const vertexNormals = new Float32Array(vertexCount * 3);
  const indices = new Uint16Array(SEGMENTS * SIDES * 6);
  const cosines = Array.from({ length: SIDES }, (_, i) => Math.cos((i / SIDES) * TWO_PI));
  const sines = Array.from({ length: SIDES }, (_, i) => Math.sin((i / SIDES) * TWO_PI));

  for (let i = 0; i < SEGMENTS; i++) {
    const next = (i + 1) % SEGMENTS;
    for (let j = 0; j < SIDES; j++) {
      const nextSide = (j + 1) % SIDES;
      const offset = (i * SIDES + j) * 6;
      const a = i * SIDES + j;
      const b = i * SIDES + nextSide;
      const c = next * SIDES + j;
      const d = next * SIDES + nextSide;
      indices.set([a, b, c, b, d, c], offset);
    }
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(positions, 3);
  const normalAttribute = new THREE.BufferAttribute(vertexNormals, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  normalAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("normal", normalAttribute);
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.5);

  const closingNormal = new THREE.Vector3();
  const closingCross = new THREE.Vector3();

  const update = (openness: number, time: number) => {
    for (let i = 0; i < SEGMENTS; i++) {
      const [x, y, z] = pointOnLoop(loop, (i / SEGMENTS) * TWO_PI, openness, time);
      points[i].set(x, y, z);
    }

    for (let i = 0; i < SEGMENTS; i++) {
      tangents[i]
        .subVectors(points[(i + 1) % SEGMENTS], points[(i - 1 + SEGMENTS) % SEGMENTS])
        .normalize();
    }

    // Parallel transport keeps the cross section smooth as the knot deforms.
    normals[0].set(0, 0, 1).addScaledVector(tangents[0], -tangents[0].z).normalize();
    for (let i = 1; i < SEGMENTS; i++) {
      normals[i]
        .copy(normals[i - 1])
        .addScaledVector(tangents[i], -normals[i - 1].dot(tangents[i]))
        .normalize();
    }

    closingNormal
      .copy(normals[SEGMENTS - 1])
      .addScaledVector(tangents[0], -normals[SEGMENTS - 1].dot(tangents[0]))
      .normalize();
    const seamAngle = Math.atan2(
      closingCross.crossVectors(closingNormal, normals[0]).dot(tangents[0]),
      closingNormal.dot(normals[0]),
    );

    const radius = 0.14 + (1 - openness) * 0.005;
    for (let i = 0; i < SEGMENTS; i++) {
      const baseNormal = normals[i];
      const baseBinormal = binormals[i].crossVectors(tangents[i], baseNormal);
      const correction = (seamAngle * i) / SEGMENTS;
      const sine = Math.sin(correction);
      const cosine = Math.cos(correction);
      const nx = baseNormal.x * cosine + baseBinormal.x * sine;
      const ny = baseNormal.y * cosine + baseBinormal.y * sine;
      const nz = baseNormal.z * cosine + baseBinormal.z * sine;
      const bx = -baseNormal.x * sine + baseBinormal.x * cosine;
      const by = -baseNormal.y * sine + baseBinormal.y * cosine;
      const bz = -baseNormal.z * sine + baseBinormal.z * cosine;

      for (let j = 0; j < SIDES; j++) {
        const ox = nx * cosines[j] + bx * sines[j];
        const oy = ny * cosines[j] + by * sines[j];
        const oz = nz * cosines[j] + bz * sines[j];
        const offset = (i * SIDES + j) * 3;
        positions[offset] = points[i].x + radius * ox;
        positions[offset + 1] = points[i].y + radius * oy;
        positions[offset + 2] = points[i].z + radius * oz;
        vertexNormals[offset] = ox;
        vertexNormals[offset + 1] = oy;
        vertexNormals[offset + 2] = oz;
      }
    }

    positionAttribute.needsUpdate = true;
    normalAttribute.needsUpdate = true;
  };

  return { geometry, update };
}

function mountScene(
  THREE: Three,
  canvas: HTMLCanvasElement,
  host: HTMLDivElement,
  onReady: () => void,
  onUnavailable: () => void,
) {
  let renderer: import("three").WebGLRenderer | undefined;
  let geometries: import("three").BufferGeometry[] = [];
  let material: import("three").MeshPhysicalMaterial | undefined;
  let environment: import("three").CanvasTexture | undefined;
  let environmentTarget: import("three").WebGLRenderTarget | undefined;
  let pmrem: import("three").PMREMGenerator | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let intersectionObserver: IntersectionObserver | undefined;
  let disposed = false;
  let contextLost = false;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let inView = true;
  let elapsed = 0;
  let lastFrame = 0;
  let camera: import("three").PerspectiveCamera;
  let mesh: import("three").Group;
  let scene: import("three").Scene;
  let updateTubes: (openness: number, time: number) => void;

  const resize = () => {
    if (!renderer || !camera || disposed || contextLost) return;
    const width = Math.round(host.clientWidth);
    const height = Math.round(host.clientHeight);
    if (width < 1 || height < 1) return;
    const ratio = Math.max(
      0.75,
      Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_600_000 / (width * height))),
    );
    renderer.setDrawingBufferSize(width, height, ratio);
    camera.aspect = width / height;
    camera.position.z = Math.max(7.65, 7.65 / camera.aspect);
    camera.updateProjectionMatrix();
    if (motionQuery.matches) drawStill();
  };

  const drawStill = () => {
    if (!renderer || !scene || !camera || !mesh || contextLost || disposed) return;
    updateTubes(0.82, 0);
    mesh.rotation.set(0.17, 0.15, -0.1);
    renderer.render(scene, camera);
    onReady();
  };

  const animate = (now: number) => {
    if (!renderer || !scene || !camera || !mesh || disposed || contextLost) return;
    if (lastFrame && now - lastFrame < 1000 / 30) return;
    elapsed += lastFrame ? Math.min((now - lastFrame) / 1000, 0.06) : 0;
    lastFrame = now;
    const openness = 0.5 + 0.5 * Math.sin(elapsed * 0.52 + 0.9);
    updateTubes(openness, elapsed);
    mesh.rotation.set(
      0.17 + 0.11 * Math.sin(elapsed * 0.24),
      0.15 + 0.11 * Math.sin(elapsed * 0.18),
      -0.1 + elapsed * 0.028,
    );
    renderer.render(scene, camera);
  };

  const updatePlayback = () => {
    if (!renderer || disposed || contextLost) return;
    const shouldPlay = inView && !document.hidden && !motionQuery.matches;
    renderer.setAnimationLoop(shouldPlay ? animate : null);
    lastFrame = 0;
    if (motionQuery.matches && inView && !document.hidden) drawStill();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    renderer?.setAnimationLoop(null);
    onUnavailable();
  };

  const onContextRestored = () => {
    try {
      if (pmrem && environment && material) {
        environmentTarget?.dispose();
        environmentTarget = pmrem.fromEquirectangular(environment);
        material.envMap = environmentTarget.texture;
        material.needsUpdate = true;
      }
      contextLost = false;
      resize();
      drawStill();
      updatePlayback();
    } catch {
      contextLost = true;
      onUnavailable();
    }
  };

  const cleanup = () => {
    disposed = true;
    renderer?.setAnimationLoop(null);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", updatePlayback);
    motionQuery.removeEventListener("change", updatePlayback);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    geometries.forEach((geometry) => geometry.dispose());
    material?.dispose();
    environmentTarget?.dispose();
    environment?.dispose();
    pmrem?.dispose();
    renderer?.dispose();
  };

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.65;
    renderer.setClearColor(ONYX, 1);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(ONYX);
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7.65);

    environment = new THREE.CanvasTexture(makeEnvironmentCanvas());
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    pmrem = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmrem.fromEquirectangular(environment);

    const tubes = Array.from({ length: LOOP_COUNT }, (_, loop) => makeTube(THREE, loop));
    geometries = tubes.map((tube) => tube.geometry);
    updateTubes = (openness, time) => tubes.forEach((tube) => tube.update(openness, time));
    material = new THREE.MeshPhysicalMaterial({
      color: 0xe6ebf1,
      metalness: 1,
      roughness: 0.11,
      envMap: environmentTarget.texture,
      envMapIntensity: 2.05,
      iridescence: 0.88,
      iridescenceIOR: 1.4,
      iridescenceThicknessMinimum: 160,
      iridescenceThicknessMaximum: 500,
      clearcoat: 0.25,
      clearcoatRoughness: 0.08,
    });
    mesh = new THREE.Group();
    geometries.forEach((geometry) => mesh.add(new THREE.Mesh(geometry, material)));
    scene.add(mesh);

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    document.addEventListener("visibilitychange", updatePlayback);
    motionQuery.addEventListener("change", updatePlayback);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updatePlayback();
      });
      intersectionObserver.observe(host);
    }

    resize();
    drawStill();
    updatePlayback();
    return cleanup;
  } catch {
    cleanup();
    onUnavailable();
    return () => {};
  }
}

export function KnotScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientId = useId();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || typeof WebGL2RenderingContext === "undefined") return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void import("three")
      .then((THREE) => {
        if (!cancelled) {
          cleanup = mountScene(THREE, canvas, host, () => setReady(true), () => setReady(false));
        }
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Three interlinked reflective chrome loops slowly breathe and rotate against an onyx background"
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: ONYX }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", position: "absolute", inset: 0, width: "100%", height: "100%", opacity: ready ? 1 : 0 }}
      />
      <svg
        className="avrai-knot-fallback-art"
        viewBox="-180 -180 360 360"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: ready ? 0 : 1 }}
      >
        <style>{`
          .avrai-knot-fallback-art { transform-origin: center; }
          @media (min-width: 1241px) {
            .avrai-knot-fallback-art { transform: scale(.82); }
          }
          @keyframes avrai-knot-fallback-breathe {
            0%, 100% { transform: rotate(-8deg) scale(.89, .9); }
            50% { transform: rotate(8deg) scale(1.04, 1.06); }
          }
          .avrai-knot-fallback-motion {
            transform-box: view-box;
            transform-origin: center;
            animation: avrai-knot-fallback-breathe 12s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .avrai-knot-fallback-motion { animation: none; }
          }
        `}</style>
        <defs>
          <linearGradient id={gradientId} x1="-150" y1="-120" x2="150" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#eceff7" />
            <stop offset=".22" stopColor="#b4faff" />
            <stop offset=".45" stopColor="#f6f9ff" />
            <stop offset=".7" stopColor="#e29eff" />
            <stop offset=".88" stopColor="#ffd4a1" />
            <stop offset="1" stopColor="#afc4d8" />
          </linearGradient>
        </defs>
        <g className="avrai-knot-fallback-motion" style={{ animationPlayState: ready ? "paused" : "running" }}>
          {fallbackArcs.map((arc, index) => (
            <path key={`shadow-${index}`} d={arc.path} fill="none" stroke="#272e3a" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {fallbackArcs.map((arc, index) => (
            <path key={`chrome-${index}`} d={arc.path} fill="none" stroke={`url(#${gradientId})`} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      </svg>
    </div>
  );
}
