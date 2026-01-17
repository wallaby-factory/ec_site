import { prisma } from '@/lib/prisma'
import { updateMaterialStatus } from './actions'
import { MaterialUpdateCard } from './MaterialUpdateCard'

// Helper to translate status to symbol/text
const STATUS_OPTIONS = [
    { value: 'PLENTIFUL', label: '◎ (余裕あり)', color: 'text-green-600 font-bold' },
    { value: 'AVAILABLE', label: '○ (通常)', color: 'text-blue-600' },
    { value: 'LIMITED', label: '△ (残りわずか)', color: 'text-yellow-600 font-bold' },
    { value: 'OUT_OF_STOCK', label: '× (在庫切れ)', color: 'text-red-600 font-bold' },
]

export default async function MaterialsPage() {
    const materials = await prisma.material.findMany({
        orderBy: [
            { category: 'asc' },
            { name: 'asc' }
        ]
    })

    // Group by category
    const grouped = materials.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {} as Record<string, typeof materials>)

    const categories = [
        { key: 'FABRIC', label: '生地' },
        { key: 'CORD', label: 'コード' },
        { key: 'FASTENER', label: 'ストッパー' },
        { key: 'THREAD', label: '縫い糸' },
        { key: 'OTHER', label: '副資材' },
    ]

    const getStatusPriority = (status: string) => {
        switch (status) {
            case 'OUT_OF_STOCK': return 3
            case 'LIMITED': return 2
            case 'AVAILABLE': return 1
            case 'PLENTIFUL': return 0
            default: return -1
        }
    }

    const getStatusInfo = (priority: number) => {
        switch (priority) {
            case 3: return {
                label: '×',
                color: 'bg-red-100 text-red-700 border-red-300',
                icon: (props: any) => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                )
            }
            case 2: return {
                label: '△',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                icon: (props: any) => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    </svg>
                )
            }
            case 1: return {
                label: '○',
                color: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: (props: any) => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                )
            }
            case 0: return {
                label: '◎',
                color: 'bg-green-50 text-green-700 border-green-200',
                icon: (props: any) => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                    </svg>
                )
            }
            default: return {
                label: '-',
                color: 'bg-slate-50 text-slate-500 border-slate-200',
                icon: (props: any) => <span {...props}>-</span>
            }
        }
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-slate-800 border-l-4 border-green-500 pl-4">
                資材在庫管理
            </h1>

            {/* Dashboard Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {categories.map((cat) => {
                    const items = grouped[cat.key] || []
                    const worstPriority = items.reduce((max, item) => Math.max(max, getStatusPriority(item.status)), 0)
                    const info = getStatusInfo(worstPriority)

                    return (
                        <a
                            key={cat.key}
                            href={`#category-${cat.key}`}
                            className={`block p-4 rounded-lg border-2 text-center transition-transform hover:-translate-y-1 hover:shadow-md ${info.color}`}
                        >
                            <div className="text-sm font-bold opacity-80 mb-2">{cat.label}</div>
                            <div className="flex justify-center items-center h-12">
                                <info.icon className="w-10 h-10" />
                            </div>
                        </a>
                    )
                })}
            </div>

            <div className="space-y-12">
                {categories.map((cat) => {
                    const items = grouped[cat.key] || []
                    if (items.length === 0) return null

                    return (
                        <div
                            key={cat.key}
                            id={`category-${cat.key}`}
                            className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden scroll-mt-24"
                        >
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-700">{cat.label}</h2>
                                <span className="text-sm text-slate-500">{items.length} items</span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item) => (
                                        <MaterialUpdateCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Client Component for individual item update to allow interactivity
// We'll define it in the same file for now as it's small, or separate it.
// Next.js Server Components cannot contain client interactivity directly without 'use client'.
// So we extract the form/card to a separate component.
// Actually, let's make this file server component and import a client component for the card.
