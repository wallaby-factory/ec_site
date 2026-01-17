import Customizer from '@/components/Customizer'
import { prisma } from '@/lib/prisma'

export const metadata = {
    title: 'オーダーメイド | NUMBAT',
    description: 'あなただけのキャンプ用品収納袋を自由に設計。サイズ、色、パーツをカスタマイズして、理想のギアケースを手に入れましょう。',
}

export default async function CustomizerPage() {
    const materials = await prisma.material.findMany({
        select: {
            category: true,
            name: true,
            status: true
        }
    })

    return (
        <div className="min-h-screen bg-slate-50">
            <Customizer materials={materials} />
        </div>
    )
}
