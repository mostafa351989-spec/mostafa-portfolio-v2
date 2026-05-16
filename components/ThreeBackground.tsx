'use client'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0,0,3] }}>
        <ambientLight intensity={0.5} />
        <Sphere args={[1, 64, 64]} scale={2.5}>
          <MeshDistortMaterial color="#4F46E5" distort={0.4} speed={2} />
        </Sphere>
      </Canvas>
    </div>
  )
}
