// components/three/DNAHelixMesh.jsx
import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

function seeded01(seed) {
  const x = Math.sin(seed * 999.123) * 10000
  return x - Math.floor(x)
}

export default function DNAHelixMesh({
  height = 3.2,
  turns = 1.05,
  radius = 1.05,
  segments = 260,

  // rails
  railRadius = 0.055,
  railEvery = 5,

  // rungs (beads)
  rungEvery = 20,
  rungBeadsPerRung = 87,
  rungBeadRadius = 0.035,
  rungInset = 1,

  sectionSeed = 0,
  helixColor = '#6f7f7a',
  activeRungColor = '#c08457',
  phase = 0,
}) {
  /* ---------------- RAIL POINTS ---------------- */

  const { leftRail, rightRail } = useMemo(() => {
    const L = []
    const R = []
    const twoPi = Math.PI * 2
    const step = Math.max(1, railEvery | 0)

    for (let i = 0; i <= segments; i += step) {
      const t = i / segments
      const y = THREE.MathUtils.lerp(-height / 2, height / 2, t)
      const ang = t * turns * twoPi + phase

      L.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius))
      R.push(new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius))
    }

    return { leftRail: L, rightRail: R }
  }, [height, turns, radius, segments, railEvery, phase])

  /* ---------------- RUNG BEADS ---------------- */

  const { NL, NR, AL, AR } = useMemo(() => {
    const twoPi = Math.PI * 2
    const normalLeft = []
    const normalRight = []
    const activeLeft = []
    const activeRight = []

    const rungCount = Math.floor(segments / rungEvery)
    const start = Math.floor(rungCount * 0.3)
    const end = Math.ceil(rungCount * 0.7)
    const window = Math.max(1, end - start)
    const activeIndex = end - 1 - (sectionSeed % window)

    let rungIdx = 0

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

      const isActive = rungIdx === activeIndex

      for (let j = 0; j < rungBeadsPerRung; j++) {
        const u = (j + 0.5) / rungBeadsPerRung
        const pos = a.clone().lerp(b, u)

        // taper: center thick, ends thin
        const core = 1 - Math.abs(u - 0.5) * 2
        const scale = THREE.MathUtils.lerp(0.45, 0.95, core)

        if (u < 0.5) {
          ;(isActive ? activeLeft : normalLeft).push({ pos, scale })
        } else {
          ;(isActive ? activeRight : normalRight).push({ pos, scale })
        }
      }

      rungIdx++
    }

    return { NL: normalLeft, NR: normalRight, AL: activeLeft, AR: activeRight }
  }, [
    segments,
    rungEvery,
    rungBeadsPerRung,
    height,
    turns,
    radius,
    rungInset,
    phase,
    sectionSeed,
  ])

  /* ---------------- INSTANCED HELPERS ---------------- */

  function fill(ref, data) {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    data.forEach(({ pos, scale }, i) => {
      dummy.position.copy(pos)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.count = data.length
    ref.current.instanceMatrix.needsUpdate = true
  }

  /* ---------------- REFS ---------------- */

  const leftRailRef = useRef()
  const rightRailRef = useRef()
  const normalLeftRef = useRef()
  const normalRightRef = useRef()
  const activeLeftRef = useRef()
  const activeRightRef = useRef()

  /* ---------------- APPLY MATRICES ---------------- */

  useEffect(() => {
    const dummy = new THREE.Object3D()

    leftRail.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      leftRailRef.current.setMatrixAt(i, dummy.matrix)
    })

    rightRail.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      rightRailRef.current.setMatrixAt(i, dummy.matrix)
    })

    leftRailRef.current.count = leftRail.length
    rightRailRef.current.count = rightRail.length
    leftRailRef.current.instanceMatrix.needsUpdate = true
    rightRailRef.current.instanceMatrix.needsUpdate = true
  }, [leftRail, rightRail])

  useEffect(() => {
    fill(normalLeftRef, NL)
    fill(normalRightRef, NR)
    fill(activeLeftRef, AL)
    fill(activeRightRef, AR)
  }, [NL, NR, AL, AR])

  /* ---------------- RENDER ---------------- */

  return (
    <group>
      {/* rails */}
      <instancedMesh ref={leftRailRef} args={[null, null, leftRail.length]}>
        <sphereGeometry args={[railRadius, 16, 16]} />
        <meshStandardMaterial color={helixColor} />
      </instancedMesh>

      <instancedMesh ref={rightRailRef} args={[null, null, rightRail.length]}>
        <sphereGeometry args={[railRadius, 16, 16]} />
        <meshStandardMaterial color={helixColor} />
      </instancedMesh>

      {/* normal rungs */}
      <instancedMesh ref={normalLeftRef} args={[null, null, NL.length]}>
        <sphereGeometry args={[rungBeadRadius, 16, 16]} />
        <meshStandardMaterial color={helixColor} />
      </instancedMesh>

      <instancedMesh ref={normalRightRef} args={[null, null, NR.length]}>
        <sphereGeometry args={[rungBeadRadius, 16, 16]} />
        <meshStandardMaterial color={helixColor} />
      </instancedMesh>

      {/* active rungs */}
      <instancedMesh ref={activeLeftRef} args={[null, null, AL.length]}>
        <sphereGeometry args={[rungBeadRadius, 16, 16]} />
        <meshStandardMaterial
          color={activeRungColor}
          emissive={activeRungColor}
          emissiveIntensity={0.08}
        />
      </instancedMesh>

      <instancedMesh ref={activeRightRef} args={[null, null, AR.length]}>
        <sphereGeometry args={[rungBeadRadius, 16, 16]} />
        <meshStandardMaterial
          color={activeRungColor}
          emissive={activeRungColor}
          emissiveIntensity={0.08}
        />
      </instancedMesh>
    </group>
  )
}
