'use client'

import React, { useMemo, useState, useEffect } from 'react'
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

function Bag({ width, height, depth = 10, diameter = 15, shape = 'SQUARE', fabricColor, cordColor, stopperColor, cordCount = 1, setDebugNames }: BagModelProps & { setDebugNames: (names: string[]) => void }) {
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
        // ... Cylinder Logic (Unchanged) ...
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

        // Scale Calculation: Base model is 10x10cm
        const scaleX = width / 10
        const scaleY = height / 10
        const scaleZ = shape === 'CUBE' ? depth / 10 : (depth > 0 ? depth / 10 : 1.5)

        // Clone and apply materials
        const scene = useMemo(() => {
            const clone = fbx.clone()
            const foundNames: string[] = []

            clone.traverse((child: any) => {
                if (child.isMesh || child.isGroup) {
                    if (child.name) foundNames.push(child.name)
                }

                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    const lowerName = child.name ? child.name.toLowerCase() : ''
                    let color = fabricColor
                    let roughness = 0.6
                    let metalness = 0.0

                    // Reset scale to avoid accumulating transformations if re-used
                    // (Though clone should be fresh)

                    // Heuristic for Cord
                    if (lowerName.includes('cord') || lowerName.includes('rope') || lowerName.includes('himo') || lowerName.includes('curve') || lowerName.includes('line')) {
                        color = cordColor
                        // Counter-scale Y to prevent thickening vertically when bag gets tall
                        // We can't easily prevent X/Z stretching (fitting the bag)
                        if (scaleY !== 1) child.scale.y = 1 / scaleY
                    }
                    // Heuristic for Stopper
                    else if (lowerName.includes('stopper') || lowerName.includes('fastener') || lowerName.includes('parts')) {
                        color = stopperColor
                        roughness = 0.3
                        metalness = 0.4

                        // Inverse Scale to keep Stopper constant size
                        child.scale.set(1 / scaleX, 1 / scaleY, 1 / scaleZ)
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: roughness,
                        metalness: metalness,
                        side: THREE.DoubleSide
                    })
                }
            })

            // Send names to parent for debug display
            setDebugNames(foundNames)

            return clone
        }, [fbx, fabricColor, cordColor, stopperColor, scaleX, scaleY, scaleZ])

        content = (
            <primitive
                object={scene}
                scale={[scaleX, scaleY, scaleZ]}
                position={[0, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]} // Rotate 90 degrees as requested
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
    const [debugNames, setDebugNames] = useState<string[]>([])

    return (
        <div className="w-full h-full bg-sky-100 overflow-hidden shadow-inner border border-slate-200 relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                <React.Suspense fallback={null}>
                    <Bag {...props} setDebugNames={setDebugNames} />
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

            {/* Debug Overlay for Mesh Names - To be removed later */}
            <div className="absolute top-2 left-2 bg-white/80 p-2 text-xs text-black pointer-events-none rounded max-h-[200px] overflow-auto">
                <p className="font-bold border-b border-gray-300 mb-1">Detected Meshes:</p>
                {debugNames.length > 0 ? (
                    <ul className="list-disc pl-3">
                        {debugNames.map((name, i) => (
                            <li key={i}>{name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Scanning...</p>
                )}
            </div>
        </div>
    )
}
