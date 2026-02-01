'use client'

import React, { useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useFBX, useGLTF } from '@react-three/drei'
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
    groundTexture?: 'GRASS' | 'LEAVES' | 'GRAVEL'
    slitSize?: number
}

function Bag({ width, height, depth = 10, diameter = 15, shape = 'SQUARE', fabricColor, cordColor, stopperColor, cordCount = 1, groundTexture = 'GRASS' }: BagModelProps) {
    const [grass, leaves, gravel] = useLoader(THREE.TextureLoader, [
        '/assets/textures/lawn.jpg',
        '/assets/textures/fallen_leaves.jpg',
        '/assets/textures/gravel.jpg'
    ])

    // Setup Textures
    const selectedTexture = useMemo(() => {
        const t = groundTexture === 'LEAVES' ? leaves : (groundTexture === 'GRAVEL' ? gravel : grass)
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(4, 4)
        return t
    }, [groundTexture, grass, leaves, gravel])

    // Load GLB models - Updated to version 7 (GLB format)
    const glb1Cord = useGLTF('/models/1code_平型7.glb')
    const glb2Cord = useGLTF('/models/2code_平型7.glb')

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
    } else if (shape === 'CUBE') {
        const fbx = useFBX('/models/1code_箱型.fbx')

        // Base model dimensions (approx 10x10x10)
        // Hem threshold: defined by Y position where hem starts
        const HEM_START_Y = 4.0 // Adjust based on model
        const BASE_HEIGHT = 10
        const BASE_WIDTH = 10
        const BASE_DEPTH = 10

        // Target Scales
        const targetScaleX = width / BASE_WIDTH
        const targetScaleY = height / BASE_HEIGHT
        const targetScaleZ = depth / BASE_DEPTH

        // Calculated Shift for Hem (since we don't scale it, we just move it)
        // New Body Height = (HEM_START_Y + BOTTOM_OFFSET) * targetScaleY
        // Shift = New Body Top - Old Body Top

        // Simplified Logic:
        // Vertex Y > HEM_START_Y ? It's Hem.
        //   New Y = (Y - HEM_START_Y) * 1 + (HEM_START_Y * targetScaleY)
        // Vertex Y <= HEM_START_Y ? It's Body.
        //   New Y = Y * targetScaleY

        const scene = useMemo(() => {
            const clone = fbx.clone()

            clone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    const lowerName = child.name.toLowerCase()
                    let color = fabricColor

                    if (lowerName.includes('cord')) color = cordColor
                    else if (lowerName.includes('stopper') || lowerName.includes('button') || lowerName.includes('base')) {
                        const isBase = lowerName.includes('base') || lowerName.includes('stopper2')
                        const isBlack = stopperColor === '#444444'
                        color = isBlack ? '#ffffff' : stopperColor
                        if (isBase) color = isBlack ? '#444444' : '#ffffff'
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: 0.6,
                        side: THREE.DoubleSide
                    })

                    // --- VERTEX MANIPULATION ---
                    // Clone geometry to avoid affecting shared resource
                    const geometry = child.geometry.clone()
                    const posAttribute = geometry.attributes.position
                    const vertex = new THREE.Vector3()

                    for (let i = 0; i < posAttribute.count; i++) {
                        vertex.fromBufferAttribute(posAttribute, i)

                        // 1. Scale X and Z (Width / Depth) - Apply to ALL vertices
                        vertex.x *= targetScaleX
                        vertex.z *= targetScaleZ

                        // 2. Smart Y Scaling (Height)
                        if (vertex.y > HEM_START_Y) {
                            // HEM AREA: Preserve original height, move it up
                            // The bottom of the hem is at HEM_START_Y.
                            // The new bottom of the hem should be at (HEM_START_Y * targetScaleY)
                            const offsetFromHemStart = vertex.y - HEM_START_Y
                            vertex.y = (HEM_START_Y * targetScaleY) + offsetFromHemStart
                        } else {
                            // BODY AREA: Scale normally
                            vertex.y *= targetScaleY
                        }

                        posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z)
                    }

                    child.geometry = geometry
                    geometry.computeVertexNormals() // Recompute lighting
                    geometry.computeBoundingBox()
                }
            })
            return clone
        }, [fbx, width, height, depth, fabricColor, cordColor, stopperColor])

        content = (
            <primitive
                object={scene}
                scale={[1, 1, 1]} // Vertexes are already scaled
                position={[0, floorY, 0]} // Adjust floor position
                rotation={[0, -Math.PI / 2, 0]}
            />
        )

    } else {
        // SQUARE (Flat) - Use GLB
        const glb = cordCount === 1 ? glb1Cord : glb2Cord

        // Scale Calculation for SQUARE
        // Note: GLB coordinate system after rotation has Y=depth, Z=height
        const scaleX = width / 10
        const scaleY = depth > 0 ? depth / 10 : 1.5 // Y axis = depth (thickness) after rotation
        const scaleZ = height / 10  // Z axis = height (vertical length) after rotation

        // Clone and apply materials
        const scene = useMemo(() => {
            const clone = glb.scene.clone()

            const meshes: any = { cords: [], stopper: [], hem: null, slit: null }
            const outlinesToAdd: any[] = []

            clone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true

                    let color = fabricColor
                    let roughness = 0.6
                    let metalness = 0.0
                    const lowerName = child.name ? child.name.toLowerCase() : ''

                    // Debug: Log mesh names
                    if (child.name) {
                        console.log('GLB Mesh found:', child.name, '(lowercase:', lowerName, ')')
                    }

                    if (lowerName.includes('stopper') || lowerName.includes('button') || lowerName.includes('base')) {
                        const isBase = lowerName.includes('base') || lowerName.includes('stopper2')
                        const isBlack = stopperColor === '#444444'
                        color = isBlack ? '#ffffff' : stopperColor
                        if (isBase) color = isBlack ? '#444444' : '#ffffff'
                        roughness = 0.3
                        metalness = 0.4
                        meshes.cords.push(child)
                    }
                    else if (lowerName.includes('cord') || lowerName.includes('rope')) {
                        color = cordColor
                        meshes.cords.push(child)
                        console.log('✓ Cord mesh added:', child.name, 'Color:', cordColor)
                    }
                    else if (lowerName.includes('square_hem')) {
                        color = fabricColor
                        meshes.hem = child
                    }
                    else if (lowerName.includes('square_slit')) {
                        color = fabricColor
                        meshes.slit = child
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

                    // Outline
                    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
                    const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial)
                    outlineMesh.scale.set(1.006, 1.006, 1.006)
                    outlinesToAdd.push({ parent: child, outline: outlineMesh })
                }
            })

            outlinesToAdd.forEach(({ parent, outline }) => parent.add(outline))

            // Transformations
            if (meshes.body) {
                if (!meshes.body.geometry.boundingBox) meshes.body.geometry.computeBoundingBox()
                const bbox = meshes.body.geometry.boundingBox
                if (bbox) {
                    const originalBodyTop = bbox.max.y
                    const bodyWidth = bbox.max.x - bbox.min.x
                    // Use Z-axis for height movement calculation (not Y-axis)
                    const bodyTopMovement = (bbox.max.z * scaleZ) - bbox.max.z
                    const expansionPerSide = (bodyWidth * scaleX - bodyWidth) / 2

                    console.log('bodyTopMovement:', bodyTopMovement, 'scaleZ:', scaleZ, 'originalBodyTop:', originalBodyTop)

                    meshes.body.scale.set(scaleX, scaleY, scaleZ)

                    if (meshes.hem) {
                        const m = meshes.hem
                        // Keep height constant, only scale width
                        m.scale.set(scaleX, 1, 1)
                        m.position.set(
                            m.position.x * scaleX,
                            m.position.y,
                            m.position.z + bodyTopMovement
                        )
                    }

                    if (meshes.slit) {
                        const m = meshes.slit
                        // Keep height constant, only scale width
                        m.scale.set(scaleX, 1, 1)
                        m.position.set(
                            m.position.x * scaleX,
                            m.position.y,
                            m.position.z + bodyTopMovement
                        )
                    }

                    const updateAccessoryPosition = (m: THREE.Mesh) => {
                        const lowerName = m.name.toLowerCase()

                        // Keep cord size constant - don't scale
                        m.scale.set(1, 1, 1)

                        let posX = m.position.x
                        if (lowerName.includes('left')) posX = m.position.x - expansionPerSide
                        else if (lowerName.includes('right')) posX = m.position.x + expansionPerSide
                        else posX = m.position.x * scaleX

                        // Apply scaleZ to Z position directly
                        const newPos = [posX, m.position.y, m.position.z * scaleZ]
                        m.position.set(newPos[0], newPos[1], newPos[2])

                        console.log('Cord position updated:', m.name, 'New position:', newPos)
                    }
                    console.log('Total cords to update:', meshes.cords.length)
                    meshes.cords.forEach((m: any) => updateAccessoryPosition(m))
                }
            }
            return clone
        }, [glb, fabricColor, cordColor, stopperColor, scaleX, scaleY, scaleZ])

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
            {/* Ground Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial key={groundTexture} map={selectedTexture} roughness={1} />
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
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />

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
