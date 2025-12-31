// components/three/DNAHelixMesh.jsx
import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

function seeded01(seed) {
  const x = Math.sin(seed * 999.123) * 10000
  return x - Math.floor(x)
}

export default function DNAHelixMesh({
  // overall shape
  height = 3.2,
  turns = 1.05,
  radius = 1.05,

  // quality
  segments = 260,
  railRadius = 0.055,
  tubeRadialSegments = 16,

  // rungs
  rungEvery = 20,
  rungRadius = 0.03,     // thickness of rung
  rungInset = 0.98,       // 0..1 (lower => shorter rung)
  rungOpacity = 1,

  // section marker
  sectionSeed = 0,

  // colors
  helixColor = '#d6cfc4',
  activeRungColor = '#c08457',

  // phase shift
  phase = 0,
}) {
  /* ---------------- RAIL GEOMETRY ---------------- */

  const leftGeom = useMemo(() => {
    const pts = []
    const twoPi = Math.PI * 2
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const y = THREE.MathUtils.lerp(-height / 2, height / 2, t)
      const ang = t * turns * twoPi + phase
      pts.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(curve, segments, railRadius, tubeRadialSegments, false)
  }, [height, turns, radius, segments, railRadius, tubeRadialSegments, phase])

  const rightGeom = useMemo(() => {
    const pts = []
    const twoPi = Math.PI * 2
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const y = THREE.MathUtils.lerp(-height / 2, height / 2, t)
      const ang = t * turns * twoPi + Math.PI + phase
      pts.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(curve, segments, railRadius, tubeRadialSegments, false)
  }, [height, turns, radius, segments, railRadius, tubeRadialSegments, phase])

  /* ---------------- RUNG DATA ---------------- */

  const rungData = useMemo(() => {
    const twoPi = Math.PI * 2
    const data = []
    for (let i = 0; i <= segments; i += rungEvery) {
      const t = i / segments
      const y = THREE.MathUtils.lerp(-height / 2, height / 2, t)

      const ang = t * turns * twoPi + phase
      const a = new THREE.Vector3(
        Math.cos(ang) * radius * rungInset,
        y,
        Math.sin(ang) * radius * rungInset
      )

      const b = new THREE.Vector3(
        Math.cos(ang + Math.PI) * radius * rungInset,
        y,
        Math.sin(ang + Math.PI) * radius * rungInset
      )

      data.push({ a, b })
    }
    return data
  }, [height, turns, radius, segments, rungEvery, rungInset, phase])

  const activeRungIndex = useMemo(() => {
    const n = rungData.length
    if (!n) return 0

    // pick only from the middle 60% so it’s always on-screen
    const start = Math.floor(n * 0.30)  // 20% from top
    const end = Math.ceil(n * 0.70)     // 80% from top
    const windowSize = Math.max(1, end - start)

    const r = seeded01(sectionSeed + 12345)
    return start + Math.floor(r * windowSize)
  }, [sectionSeed, rungData.length])


  // Split into normal + active arrays (so we don’t need per-instance colors)
  const { normalRungs, activeRung } = useMemo(() => {
    const normals = []
    let active = null
    for (let i = 0; i < rungData.length; i++) {
      if (i === activeRungIndex) active = rungData[i]
      else normals.push(rungData[i])
    }
    return { normalRungs: normals, activeRung: active }
  }, [rungData, activeRungIndex])

  /* ---------------- INSTANCED SETUP ---------------- */

  const normalRef = useRef()
  const activeRef = useRef()

  useEffect(() => {
    const mesh = normalRef.current
    if (!mesh) return
    mesh.count = normalRungs.length

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)
    const mid = new THREE.Vector3()
    const dir = new THREE.Vector3()

    for (let idx = 0; idx < normalRungs.length; idx++) {
      const { a, b } = normalRungs[idx]

      mid.addVectors(a, b).multiplyScalar(0.5)
      dir.subVectors(b, a)
      const len = dir.length()

      dummy.position.copy(mid)
      dummy.quaternion.setFromUnitVectors(up, dir.normalize())
      // stretch along local Y (aligned to dir)
      dummy.scale.set(1, len, 1)
      dummy.updateMatrix()

      mesh.setMatrixAt(idx, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  }, [normalRungs])

  useEffect(() => {
    const mesh = activeRef.current
    if (!mesh) return
    mesh.count = activeRung ? 1 : 0
    if (!activeRung) return

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)
    const mid = new THREE.Vector3()
    const dir = new THREE.Vector3()

    const { a, b } = activeRung

    mid.addVectors(a, b).multiplyScalar(0.5)
    dir.subVectors(b, a)
    const len = dir.length()

    dummy.position.copy(mid)
    dummy.quaternion.setFromUnitVectors(up, dir.normalize())
    dummy.scale.set(1, len, 1)
    dummy.updateMatrix()

    mesh.setMatrixAt(0, dummy.matrix)
    mesh.instanceMatrix.needsUpdate = true
  }, [activeRung])

  /* ---------------- RENDER ---------------- */

  return (
    <group>
      {/* rails */}
      <mesh geometry={leftGeom}>
        <meshBasicMaterial color={helixColor} />
      </mesh>
      <mesh geometry={rightGeom}>
        <meshBasicMaterial color={helixColor} />
      </mesh>

      {/* normal rungs */}
      <instancedMesh
        key={`normal-${normalRungs.length}-${rungRadius}`}
        ref={normalRef}
        args={[null, null, Math.max(1, normalRungs.length)]}
      >
        {/* Box rungs look like base-pairs and never go “black” */}
        <cylinderGeometry args={[rungRadius, rungRadius, 1, 12, 1, false]} />
        <meshBasicMaterial color={helixColor} transparent opacity={rungOpacity} />
      </instancedMesh>

      {/* active rung */}
      <instancedMesh
        key={`active-${activeRungIndex}-${rungRadius}`}
        ref={activeRef}
        args={[null, null, 1]}
      >
        <cylinderGeometry args={[rungRadius, rungRadius, 1, 12, 1, false]} />
        <meshBasicMaterial color={activeRungColor} transparent opacity={Math.min(1, rungOpacity + 0.1)} />
      </instancedMesh>
    </group>
  )
}
