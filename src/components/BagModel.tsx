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

    // Constants
    const scale = 0.04
    const hemHeight = 3
    const totalHeight = height * scale
    const floorY = -(totalHeight / 2) - 0.05

    // Position adjustments for Cylinder
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

        // Scale Calculation: Base model is 10x10cm
        const scaleX = width / 10
        const scaleY = height / 10
        const scaleZ = shape === 'CUBE' ? depth / 10 : (depth > 0 ? depth / 10 : 1.5)

        // Clone and apply materials
        const scene = useMemo(() => {
            const clone = fbx.clone()

            // Map to hold references for second pass
            const meshes: {
                body?: THREE.Mesh,
                hem_and_slot?: THREE.Mesh,
                stopper?: THREE.Mesh,
                cords: THREE.Mesh[]
            } = {
                cords: []
            }

            // Phase 1: Traverse to find meshes and apply materials
            clone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    let color = fabricColor
                    let roughness = 0.6
                    let metalness = 0.0

                    const lowerName = child.name ? child.name.toLowerCase() : ''

                    // Categorize meshes
                    if (lowerName.includes('stopper') || lowerName.includes('fastener')) {
                        color = stopperColor
                        roughness = 0.3
                        metalness = 0.4
                        meshes.stopper = child
                    }
                    else if (lowerName.includes('cord') || lowerName.includes('rope') || lowerName.includes('terminal') || lowerName.includes('middle') || lowerName.includes('turn') || lowerName.includes('knot')) {
                        color = cordColor
                        meshes.cords.push(child)
                    }
                    else if (lowerName.includes('hem_and_slot')) {
                        color = fabricColor
                        meshes.hem_and_slot = child
                    }
                    else if (lowerName.includes('body')) {
                        color = fabricColor
                        meshes.body = child
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: roughness,
                        metalness: metalness,
                        side: THREE.DoubleSide
                    })
                }
            })

            // Phase 2: Measure Geometry and Apply Transformations
            if (meshes.body) {
                // Ensure bounding box is computed
                if (!meshes.body.geometry.boundingBox) {
                    meshes.body.geometry.computeBoundingBox()
                }
                const bbox = meshes.body.geometry.boundingBox

                if (bbox) {
                    const originalBodyTop = bbox.max.y

                    // Measure Body Width
                    const bodyWidth = bbox.max.x - bbox.min.x

                    console.log('BODY GEOMETRY:', { width: bodyWidth, minX: bbox.min.x, maxX: bbox.max.x })

                    // --- Vertical Movement Logic ---
                    const bodyTopMovement = (originalBodyTop * scaleY) - originalBodyTop

                    // --- Horizontal Movement Logic (Force Push Outward) ---
                    // Calculate absolute expansion amount (per side)
                    // New Width = BodyWidth * scaleX
                    // Total Expansion = New Width - BodyWidth
                    // Expansion Per Side = Total Expansion / 2
                    const expansionPerSide = (bodyWidth * scaleX - bodyWidth) / 2

                    console.log('EXPANSION:', { total: expansionPerSide * 2, perSide: expansionPerSide })

                    // Apply to Body: Standard Scaling
                    meshes.body.scale.set(scaleX, scaleY, scaleZ)

                    // Apply to Hem: Fixed Height, Follows Top, Scales Width
                    if (meshes.hem_and_slot) {
                        const m = meshes.hem_and_slot
                        m.scale.set(scaleX, 1, scaleZ)
                        m.position.set(
                            m.position.x * scaleX,
                            m.position.y + bodyTopMovement,
                            m.position.z * scaleZ
                        )
                    }

                    // Helper to update position based on Left/Right logic
                    const updateAccessoryPosition = (m: THREE.Mesh) => {
                        const lowerName = m.name.toLowerCase()
                        let posX = m.position.x

                        // Strict Directional Force Logic
                        // "Left" mesh = Move MORE Left (Negative X)
                        // "Right" mesh = Move MORE Right (Positive X)
                        // This preserves distance from the expanding edge.

                        if (lowerName.includes('_left') || lowerName.includes('left')) {
                            // Assuming Left is Negative X direction
                            posX = m.position.x - expansionPerSide
                        }
                        else if (lowerName.includes('_right') || lowerName.includes('right')) {
                            // Assuming Right is Positive X direction
                            posX = m.position.x + expansionPerSide
                        }
                        else {
                            // Default to linear scaling for center items
                            posX = m.position.x * scaleX
                        }

                        // Y follows top
                        // Z scales linearly (depth)
                        m.position.set(
                            posX,
                            m.position.y + bodyTopMovement,
                            m.position.z * scaleZ
                        )
                        m.scale.set(1, 1, 1) // Keep original size

                        console.log(`ACCESSORY [${m.name}]:`, {
                            originalX: m.position.x,
                            newX: posX,
                            applied: lowerName.includes('left') ? 'LEFT (-)' : (lowerName.includes('right') ? 'RIGHT (+)' : 'LINEAR')
                        })
                    }

                    // Apply to Stopper
                    if (meshes.stopper) {
                        updateAccessoryPosition(meshes.stopper)
                    }

                    // Apply to Cords
                    meshes.cords.forEach(m => {
                        updateAccessoryPosition(m)
                    })
                }
            } else {
                console.warn("Body mesh not found!")
            }

            return clone
        }, [fbx, fabricColor, cordColor, stopperColor, scaleX, scaleY, scaleZ])

        content = (
            <primitive
                object={scene}
                scale={[1, 1, 1]}
                position={[0, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
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
                <PerspectiveCamera makeDefault position={[0, 0.5, 3]} fov={50} />
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
