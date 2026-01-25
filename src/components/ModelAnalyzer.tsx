import { Canvas } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { useEffect } from 'react'

function Analyzer() {
    const fbx = useFBX('/models/1code_箱型.fbx')

    useEffect(() => {
        console.log('--- FBX ANALYSIS DUMP START ---')
        fbx.traverse((child) => {
            if (child.isMesh) {
                console.log(`MESH: "${child.name}"`)
                if (child.geometry) {
                    child.geometry.computeBoundingBox()
                    const bbox = child.geometry.boundingBox
                    console.log(`  - Vertices: ${child.geometry.attributes.position.count}`)
                    console.log(`  - BBox Y: [${bbox.min.y.toFixed(4)}, ${bbox.max.y.toFixed(4)}]`)
                    console.log(`  - BBox X: [${bbox.min.x.toFixed(4)}, ${bbox.max.x.toFixed(4)}]`)
                    console.log(`  - BBox Z: [${bbox.min.z.toFixed(4)}, ${bbox.max.z.toFixed(4)}]`)
                }
            } else {
                console.log(`NODE: "${child.name}" (${child.type})`)
            }
        })
        console.log('--- FBX ANALYSIS DUMP END ---')
    }, [fbx])

    return null
}

export default Analyzer
