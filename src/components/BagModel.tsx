'use client'

import React, { useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useFBX } from '@react-three/drei'
import * as THREE from 'three'

interface BagModelProps {
    width: number
    height: number
    depth?: number
    diameter?: number
    shape?: 'SQUARE' | 'CYLINDER' | 'CUBE'
    fabricColor: string
    cordColor: string
    stopperColor: string
    cordCount?: 1 | 2
}

function Bag({ width, height, depth = 10, diameter = 15, shape = 'SQUARE', fabricColor, cordColor, stopperColor, cordCount = 1 }: BagModelProps) {
    const grassTexture = useLoader(THREE.TextureLoader, '/assets/textures/shibafu.jpg')
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
    grassTexture.repeat.set(4, 4)

    // Load FBX models
    const fbx1Cord = useFBX('/models/1code_平型.fbx')
    const fbx2Cord = useFBX('/models/2code_平型.fbx')

    const scale = 0.04
    const hemHeight = 3
    const totalHeight = height * scale
    const floorY = -(totalHeight / 2) - 0.05

    // Position adjustments
    const mainBodyY = -hemHeight / 2
    const hemY = (height / 2) - (hemHeight / 2)

    let content = null

    if (shape === 'CYLINDER') {
        const radius = diameter / 2
        content = (
            <group>
                <mesh position={[0, mainBodyY, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[radius, radius, height - hemHeight, 32]} />
                    <meshStandardMaterial color={fabricColor} roughness={0.7} metalness={0.1} />
                </mesh>
                <mesh position={[0, hemY, 0]}>
                    <cylinderGeometry args={[radius + 0.2, radius + 0.2, hemHeight, 32]} />
                    <meshStandardMaterial color={fabricColor} roughness={0.7} />
                </mesh>
                <group position={[0, hemY, 0]}>
                    <mesh position={[radius + 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
                        <meshStandardMaterial color={cordColor} />
                    </mesh>
                </group>
            </group>
        )
    } else {
        // SQUARE (Flat) / CUBE - Use FBX
        const fbx = cordCount === 1 ? fbx1Cord : fbx2Cord

        // Scale Calculation: Base model is 10x10cm body + 4cm hem/slit
        const scaleX = width / 10
        const scaleY = height / 10
        const scaleZ = shape === 'CUBE' ? depth / 10 : (depth > 0 ? depth / 10 : 1.5)

        // Clone and apply individual scale/position per mesh
        const scene = useMemo(() => {
            const clone = fbx.clone()

            clone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    let color = fabricColor
                    let roughness = 0.6
                    let metalness = 0.0

                    const lowerName = child.name ? child.name.toLowerCase() : ''

                    // body: Scale normally in all directions
                    if (lowerName.includes('body')) {
                        color = fabricColor
                        child.scale.set(scaleX, scaleY, scaleZ)
                    }
                    // hem_and_slit: Width/depth scale with body, height stays fixed
                    // Position moves up as body gets taller
                    else if (lowerName.includes('hem_and_slit')) {
                        color = fabricColor
                        // DEBUG: Log original values
                        console.log('hem_and_slit BEFORE:', 'scale=', child.scale.x, child.scale.y, child.scale.z, 'pos.y=', child.position.y)

                        // Multiply original scale (X and Z with body, Y stays original)
                        child.scale.set(
                            child.scale.x * scaleX,
                            child.scale.y,  // Keep original Y scale
                            child.scale.z * scaleZ
                        )
                        // Position follows body top
                        child.position.y = child.position.y * scaleY

                        console.log('hem_and_slit AFTER:', 'scale=', child.scale.x, child.scale.y, child.scale.z, 'pos.y=', child.position.y)
                    }
                    // Stopper: Size stays constant, position follows scaling
                    else if (lowerName.includes('stopper')) {
                        color = stopperColor
                        roughness = 0.3
                        metalness = 0.4
                        // Size stays constant (scale = 1,1,1)
                        child.scale.set(1, 1, 1)
                        // Position follows bag dimensions
                        child.position.set(
                            child.position.x * scaleX,
                            child.position.y * scaleY,
                            child.position.z * scaleZ
                        )
                    }
                    // Cord parts: terminal, middle, turn, knot
                    else if (lowerName.includes('terminal') ||
                        lowerName.includes('middle') ||
                        lowerName.includes('turn') ||
                        lowerName.includes('knot')) {
                        color = cordColor
                        // Size stays constant (scale = 1,1,1)
                        child.scale.set(1, 1, 1)
                        // Position follows bag dimensions
                        child.position.set(
                            child.position.x * scaleX,
                            child.position.y * scaleY,
                            child.position.z * scaleZ
                        )
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: roughness,
                        metalness: metalness,
                        side: THREE.DoubleSide
                    })
                }
            })
            return clone
        }, [fbx, fabricColor, cordColor, stopperColor, scaleX, scaleY, scaleZ])

        content = (
            <primitive
                object={scene}
                scale={[1, 1, 1]}  // No parent scaling - handled per mesh
                position={[0, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]} // Rotate 90 degrees
            />
        )
    }

    return (
        <group>
            {/* Grass Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial map={grassTexture} roughness={1} />
            </mesh>

            <group scale={scale}>
                <group position={[0, 0, 0]}>
                    {content}
                </group>
            </group>
        </group>
    )
}

export default function BagModelContainer(props: BagModelProps) {
    return (
        <div className="w-full h-full bg-sky-100 overflow-hidden shadow-inner border border-slate-200 relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                <React.Suspense fallback={null}>
                    <Bag {...props} />
                    <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2} far={4} />
                    <Environment preset="park" />
                </React.Suspense>

                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none uppercase tracking-widest backdrop-blur-sm">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    )
}
