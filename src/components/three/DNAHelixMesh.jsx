// components/three/DNAHelixMesh.jsx
import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

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
  rungRadius = 0.03,
  rungInset = 1, // 0..1 (lower => shorter rung)
  rungOpacity = 1,

  // section marker
  sectionSeed = 0,

  // colors
  helixColor = '#6f7f7a',
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

  // middle window (keeps it on-screen)
  const start = Math.floor(n * 0.30)
  const end = Math.ceil(n * 0.70)
  const windowSize = Math.max(1, end - start)

  // rungData index increases bottom->top, so for TOP->BOTTOM we count backwards
  const step = sectionSeed % windowSize
  return (end - 1) - step
}, [sectionSeed, rungData.length])


  const { normalRungs, activeRung } = useMemo(() => {
    const normals = []
    let active = null
    for (let i = 0; i < rungData.length; i++) {
      if (i === activeRungIndex) active = rungData[i]
      else normals.push(rungData[i])
    }
    return { normalRungs: normals, activeRung: active }
  }, [rungData, activeRungIndex])

  /* ---------------- RUNG GEOMETRY: POINTED CAPSULE ---------------- */
  // Shape like your image: cone + cylinder + cone (sharp tips). Base height=1 along Y.
  const rungGeom = useMemo(() => {
    const tipFrac = 0.05 // tweak 0.15..0.30 (bigger = longer cone tips)
    const tipH = tipFrac
    const cylH = 1 - 2 * tipH

    const radial = 14
    const baseRadius = 0.5 // we scale thickness via instance scale

    const cyl = new THREE.CylinderGeometry(baseRadius, baseRadius, cylH, radial, 1, false)

    const coneTop = new THREE.ConeGeometry(baseRadius, tipH, radial, 1, false)
    coneTop.translate(0, cylH / 2 + tipH / 2, 0)

    const coneBottom = new THREE.ConeGeometry(baseRadius, tipH, radial, 1, false)
    coneBottom.rotateX(Math.PI)
    coneBottom.translate(0, -(cylH / 2 + tipH / 2), 0)

    const g = mergeGeometries([cyl, coneTop, coneBottom], true)
    g.computeVertexNormals()

    cyl.dispose()
    coneTop.dispose()
    coneBottom.dispose()

    return g
  }, [])

  /* ---------------- RUNG SPLIT + ACTIVE HALF ---------------- */

  // thickness scale (x/z); tune down if too fat
  const segThickness = rungRadius * 2.5

  // choose which half of ACTIVE rung is highlighted: 'first' (A->mid) or 'second' (mid->B)
  const activeHalf = useMemo(() => {
    return seeded01(sectionSeed + 999) > 0.5 ? 'first' : 'second'
  }, [sectionSeed])

  /* ---------------- INSTANCED SETUP ---------------- */

  const normalFirstRef = useRef()
  const normalSecondRef = useRef()
  const activeFirstRef = useRef()
  const activeSecondRef = useRef()

  // Normal rungs: split each rung into 2 segments along length (A->mid, mid->B)
  useEffect(() => {
    const m1 = normalFirstRef.current
    const m2 = normalSecondRef.current
    if (!m1 || !m2) return

    m1.count = normalRungs.length
    m2.count = normalRungs.length

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)

    const midAB = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const c1 = new THREE.Vector3()
    const c2 = new THREE.Vector3()

    for (let i = 0; i < normalRungs.length; i++) {
      const { a, b } = normalRungs[i]

      dir.subVectors(b, a)
      const len = dir.length()
      if (len < 1e-6) continue

      const dirN = dir.clone().normalize()
      midAB.addVectors(a, b).multiplyScalar(0.5)

      // centers of halves
      c1.addVectors(a, midAB).multiplyScalar(0.5)
      c2.addVectors(midAB, b).multiplyScalar(0.5)

      dummy.quaternion.setFromUnitVectors(up, dirN)

      // FIRST HALF
      dummy.position.copy(c1)
      dummy.scale.set(segThickness, len * 0.5, segThickness)
      dummy.updateMatrix()
      m1.setMatrixAt(i, dummy.matrix)

      // SECOND HALF
      dummy.position.copy(c2)
      dummy.scale.set(segThickness, len * 0.5, segThickness)
      dummy.updateMatrix()
      m2.setMatrixAt(i, dummy.matrix)
    }

    m1.instanceMatrix.needsUpdate = true
    m2.instanceMatrix.needsUpdate = true
  }, [normalRungs, segThickness])

  // Active rung: split into 2 halves (both exist), but only one half gets active color
  useEffect(() => {
    const a1 = activeFirstRef.current
    const a2 = activeSecondRef.current
    if (!a1 || !a2) return

    const has = !!activeRung
    a1.count = has ? 1 : 0
    a2.count = has ? 1 : 0
    if (!has) return

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)

    const midAB = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const c1 = new THREE.Vector3()
    const c2 = new THREE.Vector3()

    const { a, b } = activeRung

    dir.subVectors(b, a)
    const len = dir.length()
    if (len < 1e-6) return
    const dirN = dir.clone().normalize()

    midAB.addVectors(a, b).multiplyScalar(0.5)
    c1.addVectors(a, midAB).multiplyScalar(0.5)
    c2.addVectors(midAB, b).multiplyScalar(0.5)

    dummy.quaternion.setFromUnitVectors(up, dirN)

    // first half
    dummy.position.copy(c1)
    dummy.scale.set(segThickness, len * 0.5, segThickness)
    dummy.updateMatrix()
    a1.setMatrixAt(0, dummy.matrix)

    // second half
    dummy.position.copy(c2)
    dummy.scale.set(segThickness, len * 0.5, segThickness)
    dummy.updateMatrix()
    a2.setMatrixAt(0, dummy.matrix)

    a1.instanceMatrix.needsUpdate = true
    a2.instanceMatrix.needsUpdate = true
  }, [activeRung, segThickness])

  /* ---------------- MATERIALS ---------------- */

  const railMatProps = {
    color: helixColor,
    roughness: 0.6,
    metalness: 0.02,
    emissive: helixColor,
    emissiveIntensity: 0.02,
  }

  const rungMatProps = {
    color: helixColor,
    roughness: 0.65,
    metalness: 0.0,
    emissive: helixColor,
    emissiveIntensity: 0.015,
    transparent: true,
    opacity: 1
  }

  /* ---------------- RENDER ---------------- */

  return (
    <group>
      {/* rails */}
      <mesh geometry={leftGeom}>
        <meshStandardMaterial {...railMatProps} />
      </mesh>
      <mesh geometry={rightGeom}>
        <meshStandardMaterial {...railMatProps} />
      </mesh>

      {/* normal rungs - first half */}
      <instancedMesh
        key={`normal-first-${normalRungs.length}-${rungRadius}`}
        ref={normalFirstRef}
        args={[null, null, Math.max(1, normalRungs.length)]}
      >
        <primitive object={rungGeom} attach="geometry" />
        <meshStandardMaterial {...rungMatProps} />
      </instancedMesh>

      {/* normal rungs - second half */}
      <instancedMesh
        key={`normal-second-${normalRungs.length}-${rungRadius}`}
        ref={normalSecondRef}
        args={[null, null, Math.max(1, normalRungs.length)]}
      >
        <primitive object={rungGeom} attach="geometry" />
        <meshStandardMaterial {...rungMatProps} />
      </instancedMesh>

      {/* active rung - first half */}
      <instancedMesh
        key={`active-first-${activeRungIndex}-${rungRadius}`}
        ref={activeFirstRef}
        args={[null, null, 1]}
      >
        <primitive object={rungGeom} attach="geometry" />
        <meshStandardMaterial
          color={activeHalf === 'first' ? activeRungColor : helixColor}
          roughness={0.35}
          metalness={0.08}
          emissive={activeHalf === 'first' ? activeRungColor : helixColor}
          emissiveIntensity={activeHalf === 'first' ? 0.09 : 0.015}
          transparent
          opacity={1}
        />
      </instancedMesh>

      {/* active rung - second half */}
      <instancedMesh
        key={`active-second-${activeRungIndex}-${rungRadius}`}
        ref={activeSecondRef}
        args={[null, null, 1]}
      >
        <primitive object={rungGeom} attach="geometry" />
        <meshStandardMaterial
          color={activeHalf === 'second' ? activeRungColor : helixColor}
          roughness={0.35}
          metalness={0.08}
          emissive={activeHalf === 'second' ? activeRungColor : helixColor}
          emissiveIntensity={activeHalf === 'second' ? 0.09 : 0.015}
          transparent
          opacity={1}
        />
      </instancedMesh>
    </group>
  )
}
