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

    // Load FBX models - Updated to new version 4
    const fbx1Cord = useFBX('/models/1code_平型4.fbx')
    const fbx2Cord = useFBX('/models/2code_平型4.fbx')

    // Constants
    const scale = 0.04
    const hemHeight = 1 // Fixed hem height 1cm as requested
    const totalHeight = height * scale
    const floorY = -(totalHeight / 2) - 0.005

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
                        {/* Cylinder Outline */}
                        <mesh scale={[1.02, 1.02, 1.02]}>
                            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
                            <meshBasicMaterial color="black" side={THREE.BackSide} />
                        </mesh>
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
                hem?: THREE.Mesh,
                stopper?: { base?: THREE.Mesh, button?: THREE.Mesh }[],
                cords: THREE.Mesh[]
            } = {
                cords: [],
                stopper: []
            }

            const outlinesToAdd: { parent: THREE.Object3D, outline: THREE.Mesh }[] = []

            // Phase 1: Traverse to find meshes and apply materials
            clone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    let color = fabricColor
                    let roughness = 0.6
                    let metalness = 0.0

                    const lowerName = child.name ? child.name.toLowerCase() : ''

                    // Categorize meshes and determine color
                    if (lowerName.includes('stopper') || lowerName.includes('button') || lowerName.includes('base')) {
                        // Stopper Handling (Base vs Button)
                        const isBase = lowerName.includes('base')

                        // Default to the selected color (this covers the Button case)
                        color = stopperColor

                        // Override for Base
                        if (isBase) {
                            // Base is Black only if Black is selected. Otherwise (White or Colors), Base is White.
                            color = (stopperColor === 'ブラック') ? 'ブラック' : 'ホワイト'
                        }

                        console.log(`[BagModel] Stopper Mesh Found:`, {
                            name: child.name,
                            lowerName,
                            isBase,
                            selectedStopperColor: stopperColor,
                            assignedColor: color
                        })

                        roughness = 0.3
                        metalness = 0.4

                        // Add to cords list for positioning to follow body expansion
                        meshes.cords.push(child)
                    }
                    else if (lowerName.includes('cord') || lowerName.includes('rope')) {
                        color = cordColor
                        meshes.cords.push(child)
                    }
                    else if (lowerName.includes('hem_and_slit')) {
                        color = fabricColor
                        meshes.hem = child
                    }
                    else if (lowerName.includes('body')) {
                        color = fabricColor
                        meshes.body = child
                    }

                    // Revert to MeshStandardMaterial
                    child.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: roughness,
                        metalness: metalness,
                        side: THREE.DoubleSide
                    })

                    // Add Outline (Inverted Hull Method)
                    const outlineMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        side: THREE.BackSide
                    })
                    const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial)
                    outlineMesh.scale.set(1.006, 1.006, 1.006)
                    outlineMesh.castShadow = false
                    outlineMesh.receiveShadow = false

                    outlinesToAdd.push({ parent: child, outline: outlineMesh })
                }
            })

            // Add collected outlines
            outlinesToAdd.forEach(({ parent, outline }) => {
                parent.add(outline)
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
                    const expansionPerSide = (bodyWidth * scaleX - bodyWidth) / 2

                    console.log('EXPANSION:', { total: expansionPerSide * 2, perSide: expansionPerSide })

                    // Apply to Body: Standard Scaling
                    meshes.body.scale.set(scaleX, scaleY, scaleZ)

                    // Apply to Hem: Fixed Height, Follows Top, Scales Width
                    if (meshes.hem) {
                        const m = meshes.hem
                        // Force Height to always be 1 unit (scaleY = 1 / originalHeight?) 
                        // Wait, if original model hem is 1cm, and we scaled the Group by 0.04...
                        // Actually, we are scaling the Mesh. 
                        // If we want fixed height, we just set scaleY = 1.
                        // And we move it to follow the body top.

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

                    // Apply to Cords & Stoppers
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

            <ContactShadows position={[0, floorY + 0.001, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />

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
                {/* Adjusted camera to Z=0.85 for very close zoom */}
                <PerspectiveCamera makeDefault position={[0, 0.2, 0.85]} fov={50} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                <React.Suspense fallback={null}>
                    <Bag {...props} />
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
