import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BagModel from '@/components/BagModel'

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tag?: string }>
}) {
    const { q, tag } = await searchParams
    const query = q || ''
    const tagFilter = tag || ''

    const publicOrders = await prisma.publicOrder.findMany({
        where: {
            isPublic: true,
            AND: [
                query ? { itemName: { contains: query } } : {},
                tagFilter ? { tags: { contains: tagFilter } } : {},
            ],
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    })

    // Extract all tags for filtering
    const allOrders = await prisma.publicOrder.findMany({ where: { isPublic: true } })
    const tags = Array.from(
        new Set(
            allOrders
                .flatMap((o) => o.tags?.split(',') || [])
                .map((t) => t.trim())
                .filter(Boolean)
        )
    ) as string[]

    return (
        <div className="min-h-screen bg-grass-pattern py-12 px-4">
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-4">WALLABY FACTORY Gallery</h1>
                    <p className="text-white/90 drop-shadow-sm">みんなが作ったキャンプギア専用バッグの記録</p>
                </header>

                {/* Search and Filter */}
                <div className="card-glass p-6 mb-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <form className="w-full md:w-96 flex gap-2">
                            <input
                                type="text"
                                name="q"
                                defaultValue={query}
                                placeholder="アイテム名で検索 (例: Snow Peak)"
                                className="flex-1 px-4 py-3 rounded-lg bg-white/90 border-2 border-green-200 focus:border-green-500 outline-none text-slate-800 placeholder:text-slate-400 shadow-inner"
                            />
                            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md">
                                検索
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/gallery"
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm ${!tagFilter ? 'bg-green-600 text-white' : 'bg-white/90 text-slate-600 border border-slate-200 hover:border-green-300'
                                    }`}
                            >
                                すべて
                            </Link>
                            {tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/gallery?tag=${tag}${query ? `&q=${query}` : ''}`}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm ${tagFilter === tag ? 'bg-green-600 text-white' : 'bg-white/90 text-slate-600 border border-slate-200 hover:border-green-300'
                                        }`}
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="card-glass p-8">
                    {publicOrders.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500 text-lg">該当するオーダーが見つかりませんでした</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publicOrders.map((order) => (
                                <div key={order.id} className="card-outdoor flex flex-col h-full group hover:shadow-2xl transition-shadow relative">
                                    {/* 3D Preview (Small) - Link to Detail */}
                                    <Link href={`/gallery/${order.id}`} className="block group cursor-pointer">
                                        <div className="aspect-square relative flex items-center justify-center bg-slate-900 border-b border-slate-100 dark:border-slate-700 overflow-hidden">
                                            <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                                                <BagModel
                                                    width={order.width}
                                                    height={order.height}
                                                    depth={order.depth || 10}
                                                    diameter={order.diameter || 15}
                                                    shape={order.shape as 'SQUARE' | 'CYLINDER' | 'CUBE'}
                                                    fabricColor="/assets/fabrics/mesh_green.jpeg" // Default for gallery preview
                                                    cordColor="#facc15"
                                                    stopperColor="#000000"
                                                />
                                            </div>
                                            <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                3D VIEW
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link href={`/gallery/${order.id}`} className="hover:text-green-600 transition-colors">
                                                <h2 className="text-xl font-bold text-slate-800">{order.itemName}</h2>
                                            </Link>
                                            <span className="text-xs font-mono text-slate-400">#{order.id.slice(-6)}</span>
                                        </div>

                                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                            {order.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-auto mb-6">
                                            {order.tags?.split(',').map((t) => (
                                                <span key={t} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                    {order.user.name?.[0] || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{order.user.name}</span>
                                            </div>

                                            <Link
                                                href={`/customizer?ref=${order.id}`}
                                                className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1"
                                            >
                                                これで作る
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

