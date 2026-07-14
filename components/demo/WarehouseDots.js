'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// A gable-roofed warehouse volume, described as a set of flat faces so we
// can scatter points across its surface (quads as two triangles, plus the
// triangular gable ends).
function buildWarehouseFaces() {
  const W = 17; // width (x)
  const D = 36; // length (z) — long, like the real building
  const H1 = 4.6; // wall height
  const H2 = 3.4; // roof peak height above the wall

  const w = W / 2;
  const d = D / 2;

  const bl = (x, y, z) => new THREE.Vector3(x, y, z);

  // wall corners
  const A0 = bl(-w, 0, -d), A1 = bl(w, 0, -d), A2 = bl(w, 0, d), A3 = bl(-w, 0, d);
  const B0 = bl(-w, H1, -d), B1 = bl(w, H1, -d), B2 = bl(w, H1, d), B3 = bl(-w, H1, d);
  // roof ridge
  const R0 = bl(0, H1 + H2, -d), R1 = bl(0, H1 + H2, d);

  // Each face: { type: 'quad'|'tri', pts: [...], area }
  const quad = (p0, p1, p2, p3) => ({ type: 'quad', pts: [p0, p1, p2, p3] });
  const tri = (p0, p1, p2) => ({ type: 'tri', pts: [p0, p1, p2] });

  const faces = [
    quad(A0, A1, B1, B0), // front wall
    quad(A2, A3, B3, B2), // back wall
    quad(A3, A0, B0, B3), // left wall
    quad(A1, A2, B2, B1), // right wall
    tri(B0, B1, R0), // front gable
    tri(B2, B3, R1), // back gable
    quad(B0, R0, R1, B3), // roof left slope
    quad(B1, B2, R1, R0), // roof right slope (winding kept consistent for area calc only)
  ];

  function faceArea(f) {
    if (f.type === 'tri') {
      const [p0, p1, p2] = f.pts;
      return new THREE.Triangle(p0, p1, p2).getArea();
    }
    const [p0, p1, p2, p3] = f.pts;
    return (
      new THREE.Triangle(p0, p1, p2).getArea() + new THREE.Triangle(p0, p2, p3).getArea()
    );
  }

  return faces.map((f) => ({ ...f, area: faceArea(f) }));
}

function samplePointOnFace(face) {
  if (face.type === 'tri') {
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const [p0, p1, p2] = face.pts;
    return new THREE.Vector3()
      .copy(p0)
      .addScaledVector(new THREE.Vector3().subVectors(p1, p0), u)
      .addScaledVector(new THREE.Vector3().subVectors(p2, p0), v);
  }
  const [p0, p1, p2, p3] = face.pts;
  const u = Math.random();
  const v = Math.random();
  const edge1 = new THREE.Vector3().subVectors(p1, p0);
  const edge2 = new THREE.Vector3().subVectors(p3, p0);
  return new THREE.Vector3().copy(p0).addScaledVector(edge1, u).addScaledVector(edge2, v);
}

const POINT_COUNT = 3000;

// A sparse field scattered well beyond the warehouse volume itself, so the
// dot layer reads as covering the whole viewport (not just a small object
// floating in the center) as sections scroll past with a transparent
// background over it.
const AMBIENT_COUNT = 1100;

function sampleAmbientPoint() {
  return [(Math.random() - 0.5) * 62, (Math.random() - 0.5) * 34 + 5, (Math.random() - 0.5) * 70 - 8];
}

function useAmbientPoints() {
  return useMemo(() => {
    const positions = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const [x, y, z] = sampleAmbientPoint();
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);
}

function useWarehousePoints() {
  return useMemo(() => {
    const faces = buildWarehouseFaces();
    const totalArea = faces.reduce((s, f) => s + f.area, 0);
    const positions = new Float32Array(POINT_COUNT * 3);
    const flicker = new Float32Array(POINT_COUNT);

    let i = 0;
    // Distribute point count proportionally to face area so density looks even.
    const counts = faces.map((f) => Math.max(1, Math.round((f.area / totalArea) * POINT_COUNT)));
    faces.forEach((face, fi) => {
      for (let k = 0; k < counts[fi] && i < POINT_COUNT; k++, i++) {
        const p = samplePointOnFace(face);
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
        flicker[i] = Math.random() * Math.PI * 2;
      }
    });
    // fill any remainder (rounding) by resampling random faces
    while (i < POINT_COUNT) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const p = samplePointOnFace(face);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      flicker[i] = Math.random() * Math.PI * 2;
      i++;
    }
    return { positions, flicker };
  }, []);
}

function WarehousePoints() {
  const { positions, flicker } = useWarehousePoints();
  const ambientPositions = useAmbientPoints();
  const pointsRef = useRef(null);
  const groupRef = useRef(null);
  const ambientRef = useRef(null);
  const material = useRef(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
    }
    if (ambientRef.current) {
      ambientRef.current.rotation.y -= delta * 0.015;
    }
    if (material.current) {
      const t = state.clock.elapsedTime;
      material.current.opacity = 0.72 + Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <>
      <group ref={groupRef} position={[0, -1, 0]}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={POINT_COUNT} array={positions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            ref={material}
            color="#1e7fe0"
            size={0.052}
            sizeAttenuation
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </points>
        {/* A sparse warm-accent layer gives the dot cloud a bit of the
            coporate orange without overwhelming the blue field. */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={Math.floor(POINT_COUNT * 0.06)}
              array={positions.slice(0, Math.floor(POINT_COUNT * 0.06) * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#ff7a29" size={0.06} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
        </points>
      </group>
      {/* Wide, sparse ambient field so the dot layer visibly spans the full
          viewport rather than reading as a small object floating in the
          middle of an otherwise empty background. */}
      <group ref={ambientRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={AMBIENT_COUNT}
              array={ambientPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#1e7fe0" size={0.04} sizeAttenuation transparent opacity={0.4} depthWrite={false} />
        </points>
      </group>
    </>
  );
}

/**
 * Reads scrollRef.current every frame. `p` (0..1) drives the hero reveal
 * camera move; once the hero section has scrolled past, `p` stays at 1
 * and `extra` (raw scrollY beyond the hero) adds a slow side-to-side
 * drift so the field keeps reading as a living parallax layer behind the
 * rest of the page rather than freezing in place.
 */
function CameraRig({ scrollRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = scrollRef?.current?.p ?? 0;
    const extra = scrollRef?.current?.extra ?? 0;
    const e = easeOutCubic(p);
    camera.position.z = lerp(20, 32, e);
    camera.position.y = lerp(4.5, 8.5, e) + Math.sin(extra * 0.0006) * 1.4;
    camera.position.x = Math.sin(extra * 0.00045) * 2.6;
    camera.fov = lerp(52, 44, e);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

export default function WarehouseDots({ scrollRef }) {
  return (
    <group>
      <fog attach="fog" args={['#f4f6f9', 18, 64]} />
      {scrollRef ? <CameraRig scrollRef={scrollRef} /> : null}
      <WarehousePoints />
    </group>
  );
}

export const warehouseDotsCamera = { position: [0, 4.5, 20], fov: 52 };
