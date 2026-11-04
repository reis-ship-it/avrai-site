"use client";

import { useEffect, useId, useRef, useState } from "react";

type Three = typeof import("three");

const SEGMENTS = 176;
const SIDES = 14;
const LOOP_COUNT = 3;
const TWO_PI = Math.PI * 2;
const ONYX = "#08090b";
const CHAIN_WEIGHTS = [[1, 0.2, 0.2], [0.2, 1, 0.2], [0.2, 0.2, 1]] as const;
const FALLBACK_ARCS_PER_LOOP = 24;
// Three circles from one Hopf family: every pair is interlocked. A shared
// breathing scale preserves the links while the rings move independently.
const LOOP_LAYOUT = [
  { tilt: 30, phase: -60 },
  { tilt: 35, phase: 155 },
  { tilt: 30, phase: 60 },
].map(({ tilt, phase }) => {
  const tiltRadians = (tilt * Math.PI) / 180;
  const phaseRadians = (phase * Math.PI) / 180;
  return {
    slope: Math.tan(tiltRadians),
    radius: 1 / Math.cos(tiltRadians),
    sinPhase: Math.sin(phaseRadians),
    cosPhase: Math.cos(phaseRadians),
  };
});
// The closest neutral centerlines are about 0.50 world units apart. Keep
// pulled rings close enough that their 0.29-wide tubes never intersect.
const MAX_RING_TUG = 0.035;
const MAX_LINK_OFFSET = 0.035;

type SceneController = {
  cleanup: () => void;
  activate: (keyboard: boolean, clientX?: number, clientY?: number) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pointOnLoop(loop: number, t: number, openness: number) {
  const layout = LOOP_LAYOUT[loop];
  const scale = 1 + 0.024 * (openness - 0.5);
  const radial = layout.slope + layout.radius * Math.cos(t);
  const sine = Math.sin(t);
  return [
    scale * (radial * layout.sinPhase - sine * layout.cosPhase),
    scale * (radial * layout.cosPhase + sine * layout.sinPhase),
    scale * -layout.slope * sine,
  ] as const;
}

// This vector remains visible until WebGL has drawn its first frame, and when
// WebGL is unavailable or the context is lost.
const fallbackArcs = Array.from({ length: LOOP_COUNT * FALLBACK_ARCS_PER_LOOP }, (_, index) => {
  const loop = Math.floor(index / FALLBACK_ARCS_PER_LOOP);
  const arc = index % FALLBACK_ARCS_PER_LOOP;
  const points = Array.from({ length: 9 }, (_, point) =>
    pointOnLoop(loop, ((arc + point / 8) / FALLBACK_ARCS_PER_LOOP) * TWO_PI, 0.82),
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

  const update = (openness: number) => {
    for (let i = 0; i < SEGMENTS; i++) {
      const [x, y, z] = pointOnLoop(loop, (i / SEGMENTS) * TWO_PI, openness);
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
  host: HTMLButtonElement,
  onReady: () => void,
  onUnavailable: () => void,
): SceneController | null {
  let renderer: import("three").WebGLRenderer | undefined;
  let geometries: import("three").BufferGeometry[] = [];
  let material: import("three").MeshPhysicalMaterial | undefined;
  let ringMeshes: import("three").Mesh[] = [];
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
  let breathPhase = 0;
  let lastFrame = 0;
  let lastOpenness = 0.82;
  let scrollTarget = 0;
  let scrollValue = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let dragYawTarget = 0;
  let dragPitchTarget = 0;
  let dragYaw = 0;
  let dragPitch = 0;
  let nudgeStart = -Infinity;
  let nudgeRing = 1;
  let nudgeDirection = 1;
  let suppressClick = false;
  let suppressClickTimer: number | undefined;
  let tugRing: number | null = null;
  let stillNudgeTimer: number | undefined;
  const ringTargetX = [0, 0, 0];
  const ringTargetY = [0, 0, 0];
  const ringVelocityX = [0, 0, 0];
  const ringVelocityY = [0, 0, 0];
  const projectedPoint = new THREE.Vector3();
  let drag: {
    pointerId: number;
    pointerType: string;
    startX: number;
    startY: number;
    startYaw: number;
    startPitch: number;
    ring: number | null;
    active: boolean;
  } | null = null;
  let camera: import("three").PerspectiveCamera;
  let mesh: import("three").Group;
  let scene: import("three").Scene;
  let updateTubes: (openness: number) => void;

  const updateScrollTarget = () => {
    const pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const range = pageHeight - window.innerHeight;
    scrollTarget = range > 0 ? clamp(window.scrollY / range, 0, 1) : 0;
  };

  const nearestRing = (clientX: number, clientY: number) => {
    if (!mesh || !camera || ringMeshes.length !== LOOP_COUNT) return null;
    const rect = host.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    mesh.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    let nearest: number | null = null;
    let bestDistance = 56 * 56;
    let bestDepth = Infinity;

    // Sample projected centerlines only on pointer-down. This also lets a
    // finger select a ring near its edge without raycasting every frame.
    for (let ring = 0; ring < LOOP_COUNT; ring++) {
      for (let sample = 0; sample < 64; sample++) {
        const [x, y, z] = pointOnLoop(ring, (sample / 64) * TWO_PI, lastOpenness);
        projectedPoint.set(x, y, z).applyMatrix4(ringMeshes[ring].matrixWorld).project(camera);
        const dx = (projectedPoint.x * 0.5 + 0.5) * rect.width + rect.left - clientX;
        const dy = (0.5 - projectedPoint.y * 0.5) * rect.height + rect.top - clientY;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance - 16 || (Math.abs(distance - bestDistance) <= 16 && projectedPoint.z < bestDepth)) {
          nearest = ring;
          bestDistance = distance;
          bestDepth = projectedPoint.z;
        }
      }
    }
    return nearest;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (motionQuery.matches || contextLost || disposed || !event.isPrimary || (event.pointerType !== "touch" && event.button !== 0)) return;
    window.clearTimeout(suppressClickTimer);
    suppressClick = false;
    tugRing = nearestRing(event.clientX, event.clientY);
    drag = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      startYaw: dragYawTarget,
      startPitch: dragPitchTarget,
      ring: tugRing,
      active: false,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (motionQuery.matches || contextLost || disposed) return;
    if (drag && event.pointerId === drag.pointerId) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.active) {
        const threshold = drag.pointerType === "touch" ? 9 : 6;
        // Vertical touch gestures remain native page scrolling.
        if (drag.pointerType === "touch" && Math.abs(dy) > Math.abs(dx) * 1.2) return;
        if (Math.hypot(dx, dy) >= threshold) {
          drag.active = true;
          try { host.setPointerCapture(event.pointerId); } catch { /* Pointer may have been cancelled by a native gesture. */ }
        }
      }
      if (drag.active) {
        const width = Math.max(host.clientWidth, 1);
        const height = Math.max(host.clientHeight, 1);
        dragYawTarget = clamp(drag.startYaw + (dx / width) * 1.35, -0.3, 0.3);
        dragPitchTarget = clamp(drag.startPitch + (dy / height) * 1.05, -0.24, 0.24);
        pointerTargetX = 0;
        pointerTargetY = 0;
        ringTargetX.fill(0);
        ringTargetY.fill(0);
        if (drag.ring !== null) {
          const nx = dx / width;
          const ny = -dy / height;
          const length = Math.hypot(nx, ny);
          const magnitude = Math.min(MAX_RING_TUG, length * 0.26);
          const tugX = length ? (nx / length) * magnitude : 0;
          const tugY = length ? (ny / length) * magnitude : 0;
          // Every ring links both others, so each tug reaches the full set.
          for (let ring = 0; ring < LOOP_COUNT; ring++) {
            ringTargetX[ring] = tugX * CHAIN_WEIGHTS[drag.ring][ring];
            ringTargetY[ring] = tugY * CHAIN_WEIGHTS[drag.ring][ring];
          }
        }
        return;
      }
    }
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      const rect = host.getBoundingClientRect();
      pointerTargetX = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1);
      pointerTargetY = clamp(1 - ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2, -1, 1);
    }
  };

  const endDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    suppressClick = drag.active;
    window.clearTimeout(suppressClickTimer);
    if (suppressClick) suppressClickTimer = window.setTimeout(() => {
      suppressClick = false;
      suppressClickTimer = undefined;
    }, 100);
    ringTargetX.fill(0);
    ringTargetY.fill(0);
    if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
    if (drag.pointerType === "touch") {
      pointerTargetX = 0;
      pointerTargetY = 0;
    }
    drag = null;
  };

  const onPointerLeave = () => {
    if (drag?.active) return;
    pointerTargetX = 0;
    pointerTargetY = 0;
    drag = null;
  };

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
    updateScrollTarget();
    if (motionQuery.matches) drawStill();
  };

  const drawStill = (nudge = false) => {
    if (!renderer || !scene || !camera || !mesh || contextLost || disposed) return;
    updateTubes(0.82);
    lastOpenness = 0.82;
    ringMeshes.forEach((ringMesh) => ringMesh.position.set(0, 0, 0));
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0.17, 0.15, -0.1);
    if (nudge) {
      ringMeshes[nudgeRing].position.x = nudgeDirection * 0.018;
      mesh.rotation.y += nudgeDirection * 0.045;
    }
    renderer.render(scene, camera);
    onReady();
  };

  const animate = (now: number) => {
    if (!renderer || !scene || !camera || !mesh || disposed || contextLost) return;
    if (lastFrame && now - lastFrame < 1000 / 30) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.06) : 1 / 30;
    elapsed += dt;
    lastFrame = now;
    pointerX += (pointerTargetX - pointerX) * (1 - Math.exp(-dt * 7));
    pointerY += (pointerTargetY - pointerY) * (1 - Math.exp(-dt * 7));
    scrollValue += (scrollTarget - scrollValue) * (1 - Math.exp(-dt * 4));
    dragYaw += (dragYawTarget - dragYaw) * (1 - Math.exp(-dt * 11));
    dragPitch += (dragPitchTarget - dragPitch) * (1 - Math.exp(-dt * 11));
    breathPhase += dt * (0.52 + 0.2 * scrollValue);
    const openness = 0.5 + 0.5 * Math.sin(breathPhase + 0.9);
    lastOpenness = openness;
    updateTubes(openness);
    const nudgeAge = elapsed - nudgeStart;
    const nudgePhase = nudgeAge / 0.75;
    const nudge = nudgePhase > 0 && nudgePhase < 1
      ? Math.sin(nudgePhase * TWO_PI) * (1 - nudgePhase) * 0.04 * nudgeDirection
      : 0;
    mesh.rotation.set(
      0.17 + 0.11 * Math.sin(elapsed * 0.24) + pointerY * 0.14 + scrollValue * 0.13 + dragPitch,
      0.15 + 0.11 * Math.sin(elapsed * 0.18) + pointerX * 0.17 - scrollValue * 0.16 + dragYaw + nudge * 1.8,
      -0.1 + elapsed * 0.028 + scrollValue * 0.12,
    );
    mesh.position.set(pointerX * 0.09, pointerY * 0.06, 0);

    for (let ring = 0; ring < LOOP_COUNT; ring++) {
      const ringMesh = ringMeshes[ring];
      const stiffness = ring === tugRing ? 105 : 52;
      const damping = ring === tugRing ? 15 : 11;
      const decay = Math.exp(-damping * dt);
      const targetX = ringTargetX[ring] + nudge * CHAIN_WEIGHTS[nudgeRing][ring];
      ringVelocityX[ring] = (ringVelocityX[ring] + (targetX - ringMesh.position.x) * stiffness * dt) * decay;
      ringVelocityY[ring] = (ringVelocityY[ring] + (ringTargetY[ring] - ringMesh.position.y) * stiffness * dt) * decay;
      ringMesh.position.x += ringVelocityX[ring] * dt;
      ringMesh.position.y += ringVelocityY[ring] * dt;
      const displacement = Math.hypot(ringMesh.position.x, ringMesh.position.y);
      if (displacement > MAX_RING_TUG) {
        ringMesh.position.multiplyScalar(MAX_RING_TUG / displacement);
        ringVelocityX[ring] = 0;
        ringVelocityY[ring] = 0;
      }

    }

    // Project all three linked pairs inside the clearance budget, including
    // fast drag reversals. A few passes settle the shared triangle of offsets.
    for (let pass = 0; pass < 3; pass++) {
      for (const [a, b] of [[0, 1], [1, 2], [0, 2]] as const) {
        const first = ringMeshes[a].position;
        const second = ringMeshes[b].position;
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.hypot(dx, dy);
        if (distance <= MAX_LINK_OFFSET) continue;
        const nx = dx / distance;
        const ny = dy / distance;
        const correction = (distance - MAX_LINK_OFFSET) * 0.5;
        first.x -= nx * correction;
        first.y -= ny * correction;
        second.x += nx * correction;
        second.y += ny * correction;
        const outwardVelocity = (ringVelocityX[a] - ringVelocityX[b]) * nx + (ringVelocityY[a] - ringVelocityY[b]) * ny;
        if (outwardVelocity > 0) {
          ringVelocityX[a] -= nx * outwardVelocity * 0.5;
          ringVelocityY[a] -= ny * outwardVelocity * 0.5;
          ringVelocityX[b] += nx * outwardVelocity * 0.5;
          ringVelocityY[b] += ny * outwardVelocity * 0.5;
        }
      }
    }
    renderer.render(scene, camera);
  };

  const updatePlayback = () => {
    if (!renderer || disposed || contextLost) return;
    const shouldPlay = inView && !document.hidden && !motionQuery.matches;
    renderer.setAnimationLoop(shouldPlay ? animate : null);
    lastFrame = 0;
    if (!shouldPlay) {
      if (drag && host.hasPointerCapture(drag.pointerId)) host.releasePointerCapture(drag.pointerId);
      drag = null;
      pointerTargetX = 0;
      pointerTargetY = 0;
      ringTargetX.fill(0);
      ringTargetY.fill(0);
      nudgeStart = -Infinity;
    }
    if (motionQuery.matches) {
      suppressClick = false;
      ringVelocityX.fill(0);
      ringVelocityY.fill(0);
      window.clearTimeout(stillNudgeTimer);
      stillNudgeTimer = undefined;
      if (inView && !document.hidden) drawStill();
    } else if (stillNudgeTimer !== undefined) {
      window.clearTimeout(stillNudgeTimer);
      stillNudgeTimer = undefined;
    }
  };

  const activate = (keyboard: boolean, clientX?: number, clientY?: number) => {
    if (!keyboard && suppressClick) {
      suppressClick = false;
      window.clearTimeout(suppressClickTimer);
      return;
    }
    suppressClick = false;
    if (!renderer || disposed || contextLost || !inView || document.hidden) return;
    nudgeRing = !keyboard && clientX !== undefined && clientY !== undefined
      ? (nearestRing(clientX, clientY) ?? 1)
      : 1;
    nudgeDirection = nudgeRing === 0 ? -1 : 1;
    tugRing = nudgeRing;
    if (motionQuery.matches) {
      // A still pose acknowledges explicit activation without animation.
      window.clearTimeout(stillNudgeTimer);
      drawStill(true);
      stillNudgeTimer = window.setTimeout(() => {
        drawStill();
        stillNudgeTimer = undefined;
      }, 350);
      return;
    }
    if (elapsed - nudgeStart >= 0.75) nudgeStart = elapsed;
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    renderer?.setAnimationLoop(null);
    window.clearTimeout(stillNudgeTimer);
    stillNudgeTimer = undefined;
    drag = null;
    ringTargetX.fill(0);
    ringTargetY.fill(0);
    ringVelocityX.fill(0);
    ringVelocityY.fill(0);
    nudgeStart = -Infinity;
    suppressClick = false;
    onUnavailable();
  };

  const onContextRestored = () => {
    try {
      if (pmrem && environment && material) {
        environmentTarget?.dispose();
        const restoredTarget = pmrem.fromEquirectangular(environment);
        environmentTarget = restoredTarget;
        material.envMap = restoredTarget.texture;
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
    window.clearTimeout(suppressClickTimer);
    window.clearTimeout(stillNudgeTimer);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", updateScrollTarget);
    document.removeEventListener("visibilitychange", updatePlayback);
    motionQuery.removeEventListener("change", updatePlayback);
    host.removeEventListener("pointerdown", onPointerDown);
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerup", endDrag);
    host.removeEventListener("pointercancel", endDrag);
    host.removeEventListener("pointerleave", onPointerLeave);
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
    const environmentMap = environmentTarget.texture;

    const tubes = Array.from({ length: LOOP_COUNT }, (_, loop) => makeTube(THREE, loop));
    geometries = tubes.map((tube) => tube.geometry);
    updateTubes = (openness) => tubes.forEach((tube) => tube.update(openness));
    material = new THREE.MeshPhysicalMaterial({
      color: 0xe6ebf1,
      metalness: 1,
      roughness: 0.11,
      envMap: environmentMap,
      envMapIntensity: 2.05,
      iridescence: 0.88,
      iridescenceIOR: 1.4,
      iridescenceThicknessMinimum: 160,
      iridescenceThicknessMaximum: 500,
      clearcoat: 0.25,
      clearcoatRoughness: 0.08,
    });
    mesh = new THREE.Group();
    ringMeshes = geometries.map((geometry) => new THREE.Mesh(geometry, material));
    ringMeshes.forEach((ringMesh) => mesh.add(ringMesh));
    scene.add(mesh);

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerup", endDrag);
    host.addEventListener("pointercancel", endDrag);
    host.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
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
    return { cleanup, activate };
  } catch {
    cleanup();
    onUnavailable();
    return null;
  }
}

export function KnotScene() {
  const hostRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const fallbackNudgeTimer = useRef<number | undefined>(undefined);
  const gradientId = useId();
  const [ready, setReady] = useState(false);
  const [fallbackNudge, setFallbackNudge] = useState(0);
  const [fallbackStillNudge, setFallbackStillNudge] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || typeof WebGL2RenderingContext === "undefined") return;

    let cancelled = false;
    let controller: SceneController | null = null;
    void import("three")
      .then((THREE) => {
        if (!cancelled) {
          controller = mountScene(THREE, canvas, host, () => setReady(true), () => setReady(false));
          controllerRef.current = controller;
        }
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
      controller?.cleanup();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => () => window.clearTimeout(fallbackNudgeTimer.current), []);

  const activate = (keyboard: boolean, clientX: number, clientY: number) => {
    if (ready && controllerRef.current) {
      controllerRef.current.activate(keyboard, clientX, clientY);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.clearTimeout(fallbackNudgeTimer.current);
      setFallbackStillNudge(true);
      fallbackNudgeTimer.current = window.setTimeout(() => setFallbackStillNudge(false), 350);
    } else {
      setFallbackNudge((nudge) => nudge + 1);
    }
  };

  return (
    <>
    <style>{`.avrai-knot-button:focus-visible { outline: 2px solid #fff; outline-offset: -4px; }`}</style>
    <button
      ref={hostRef}
      type="button"
      className="avrai-knot-button"
      aria-label="Three interlinked chrome loops. Drag a ring to pull the chain, or activate to nudge them."
      onClick={(event) => activate(event.detail === 0, event.clientX, event.clientY)}
      style={{ position: "relative", display: "block", width: "100%", height: "100%", overflow: "hidden", background: ONYX, border: 0, padding: 0, cursor: "pointer", touchAction: "pan-y", appearance: "none" }}
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
          .avrai-knot-fallback-inner { transform-box: view-box; transform-origin: center; }
          @keyframes avrai-knot-fallback-nudge {
            0%, 100% { transform: translateX(0) rotate(0); }
            28% { transform: translate(4px, -1px) rotate(1.5deg); }
            58% { transform: translateX(-2px) rotate(-.7deg); }
          }
          .avrai-knot-fallback-nudge { animation: avrai-knot-fallback-nudge .7s ease-out both; }
          @media (prefers-reduced-motion: reduce) {
            .avrai-knot-fallback-motion { animation: none; }
            .avrai-knot-fallback-nudge { animation: none; }
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
          <g key={`nudge-${fallbackNudge}`} className={`avrai-knot-fallback-inner${fallbackNudge ? " avrai-knot-fallback-nudge" : ""}`} style={fallbackStillNudge ? { transform: "translateX(3px) rotate(1deg)" } : undefined}>
          {fallbackArcs.map((arc, index) => (
            <path key={`shadow-${index}`} d={arc.path} fill="none" stroke="#272e3a" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {fallbackArcs.map((arc, index) => (
            <path key={`chrome-${index}`} d={arc.path} fill="none" stroke={`url(#${gradientId})`} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          </g>
        </g>
      </svg>
    </button>
    </>
  );
}
