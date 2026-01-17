'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, RoundedBox } from '@react-three/drei'
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

    const scale = 0.04
    const hemHeight = 3
    // Calculate total height for floor positioning (approximate)
    const totalHeight = height * scale
    const floorY = -(totalHeight / 2) - 0.05

    // Logic for geometry args
    // Default to Flat/Square params
    let mainGeometry = null
    let hemGeometry = null
    // Position adjustments
    const mainBodyY = -hemHeight / 2 // Center of main body relative to group
    const hemY = (height / 2) - (hemHeight / 2)

    if (shape === 'CYLINDER') {
        const radius = diameter / 2
        mainGeometry = (
            <mesh position={[0, mainBodyY, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[radius, radius, height - hemHeight, 32]} />
                <meshStandardMaterial color={fabricColor} roughness={0.7} metalness={0.1} />
            </mesh>
        )
        hemGeometry = (
            <mesh position={[0, hemY, 0]}>
                <cylinderGeometry args={[radius + 0.2, radius + 0.2, hemHeight, 32]} />
                <meshStandardMaterial color={fabricColor} roughness={0.7} />
            </mesh>
        )
    } else {
        // SQUARE (Flat) or CUBE
        // For Square, depth is effectively small (e.g. 1.0 or user input if expanded later, but user said 'Flat' vs 'Cube')
        // Current 'Square' implementation was actually a thin box.
        // If Cube, use provided depth. If Square, use existing logic (pouchDepth=1.0).
        const actualDepth = shape === 'CUBE' ? depth : 1.5

        mainGeometry = (
            <RoundedBox
                args={[width, height - hemHeight, actualDepth]}
                radius={shape === 'CUBE' ? 2 : 0.8}
                smoothness={4}
                position={[0, mainBodyY, 0]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color={fabricColor} roughness={0.7} metalness={0.1} />
            </RoundedBox>
        )

        hemGeometry = (
            <RoundedBox
                args={[width + 0.4, hemHeight, actualDepth + 0.3]} // Hem slightly larger
                radius={0.5}
                smoothness={4}
                position={[0, hemY, 0]}
            >
                <meshStandardMaterial color={fabricColor} roughness={0.7} />
            </RoundedBox>
        )
    }

    // Cord positioning (Simplified: always on right side, adjusted for width/radius)
    let cordX = 0
    if (shape === 'CYLINDER') {
        cordX = (diameter / 2) + 0.5
    } else {
        cordX = (width / 2) + 0.5
    }

    return (
        <group>
            {/* Grass Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial map={grassTexture} roughness={1} />
            </mesh>

            <group scale={scale}>
                {/* Main Body */}
                {mainGeometry}

                {/* Top Hem */}
                {hemGeometry}

                {/* Cord & Stopper (Attached to Hem) */}
                {/* Cord & Stopper (Attached to Hem) */}
                <group position={[0, hemY, 0]}>
                    {/* Right Cord */}
                    <group position={[cordX, 0, 0]}>
                        {/* Cord Loop representation */}
                        <mesh position={[0, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
                            <meshStandardMaterial color={cordColor} />
                        </mesh>

                        {/* Stopper - ONLY if 1 cord */}
                        {cordCount === 1 && (
                            <mesh position={[1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
                                <meshStandardMaterial color={stopperColor} metalness={0.3} />
                            </mesh>
                        )}

                        {/* Hanging Cords */}
                        <mesh position={[1.5, -3, 0]}>
                            <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
                            <meshStandardMaterial color={cordColor} />
                        </mesh>
                        <mesh position={[1.5 + 0.4, -3, 0]}>
                            <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
                            <meshStandardMaterial color={cordColor} />
                        </mesh>
                    </group>

                    {/* Left Cord - Only if 2 cords */}
                    {cordCount === 2 && (
                        <group position={[-cordX, 0, 0]} rotation={[0, Math.PI, 0]}>
                            {/* Cord Loop representation */}
                            <mesh position={[0, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
                                <meshStandardMaterial color={cordColor} />
                            </mesh>

                            {/* Hanging Cords (No Stopper) */}
                            <mesh position={[1.5, -3, 0]}>
                                <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
                                <meshStandardMaterial color={cordColor} />
                            </mesh>
                            <mesh position={[1.5 + 0.4, -3, 0]}>
                                <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
                                <meshStandardMaterial color={cordColor} />
                            </mesh>
                        </group>
                    )}
                </group>
            </group>
        </group>
    )
}

export default function BagModelContainer(props: BagModelProps) {
    return (
        <div className="w-full h-full bg-sky-100 overflow-hidden shadow-inner border border-slate-200">
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
