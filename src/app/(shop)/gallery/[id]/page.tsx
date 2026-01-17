import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import BagModel from "@/components/BagModel"
import { OrderDetailClient } from "./OrderDetailClient"

export const revalidate = 0

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const order = await prisma.publicOrder.findUnique({
        where: { id: params.id },
        include: { user: true }
    })

    if (!order || !order.isPublic) {
        notFound()
    }

    // Count how many times this size/shape combination has been ordered
    const productionCount = await prisma.publicOrder.count({
        where: {
            shape: order.shape,
            width: order.width,
            height: order.height,
            depth: order.depth,
            diameter: order.diameter,
            isPublic: true
        }
    })

    // Parse product images
    let productImages: string[] = []
    try {
        productImages = JSON.parse(order.productImages || '[]')
    } catch (e) {
        // Fallback to imageUrl if parsing fails
        if (order.imageUrl) {
            productImages = [order.imageUrl]
        }
    }

    return (
        <div className="min-h-screen bg-grass-pattern">
            <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-2">{order.itemName}</h1>
                    <p className="text-white/90 drop-shadow-sm">{order.description || 'キャンプギアにぴったりの収納袋'}</p>

                    {/* Breadcrumb */}
                    <div className="mt-4 text-sm text-white/80">
                        <Link href="/" className="hover:text-yellow-400 transition-colors">ホーム</Link>
                        <span className="mx-2">/</span>
                        <Link href="/gallery" className="hover:text-yellow-400 transition-colors">ギャラリー</Link>
                        <span className="mx-2">/</span>
                        <span className="text-yellow-400 font-semibold">{order.itemName}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Images and 3D Preview (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Images */}
                        {productImages.length > 0 ? (
                            <section className="card-glass p-6">
                                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                    <span className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg font-bold shadow-lg">1</span>
                                    商品画像
                                </h2>
                                <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={productImages[0]}
                                        alt="商品画像"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {productImages.length > 1 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {productImages.map((img, index) => (
                                            <div key={index} className="aspect-square relative bg-slate-100 rounded overflow-hidden border-2 border-white/50 hover:border-green-400 transition-colors">
                                                <Image
                                                    src={img}
                                                    alt={`商品画像 ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ) : (
                            <div className="card-glass p-12 flex items-center justify-center">
                                <span className="text-6xl">📦</span>
                            </div>
                        )}

                        {/* 3D Preview */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg font-bold shadow-lg">2</span>
                                3Dプレビュー
                            </h2>
                            <div className="aspect-square relative flex items-center justify-center bg-sky-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                                <BagModel
                                    width={order.width}
                                    height={order.height}
                                    depth={order.depth || undefined}
                                    diameter={order.diameter || undefined}
                                    shape={order.shape as 'SQUARE' | 'CYLINDER' | 'CUBE'}
                                    fabricColor="/assets/fabrics/mesh_green.jpeg"
                                    cordColor="#000000"
                                    stopperColor="#000000"
                                />
                            </div>
                        </section>

                        {/* Specifications */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg font-bold shadow-lg">3</span>
                                仕様
                            </h2>
                            <div className="bg-green-50 rounded-xl p-6 border border-green-100 space-y-3">
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div className="text-xs text-slate-500">形状</div>
                                    <div className="text-sm font-bold text-right text-slate-700">
                                        {order.shape === 'SQUARE' && '平袋'}
                                        {order.shape === 'CYLINDER' && '円筒型'}
                                        {order.shape === 'CUBE' && '立方体'}
                                    </div>

                                    <div className="text-xs text-slate-500">幅</div>
                                    <div className="text-sm font-bold text-right text-slate-700">{order.width} cm</div>

                                    <div className="text-xs text-slate-500">高さ</div>
                                    <div className="text-sm font-bold text-right text-slate-700">{order.height} cm</div>

                                    {order.depth && (
                                        <>
                                            <div className="text-xs text-slate-500">奥行</div>
                                            <div className="text-sm font-bold text-right text-slate-700">{order.depth} cm</div>
                                        </>
                                    )}

                                    {order.diameter && (
                                        <>
                                            <div className="text-xs text-slate-500">直径</div>
                                            <div className="text-sm font-bold text-right text-slate-700">{order.diameter} cm</div>
                                        </>
                                    )}
                                </div>

                                {/* Tags */}
                                {order.tags && (
                                    <div className="pt-3 border-t border-green-200">
                                        <div className="text-xs text-slate-500 mb-2">タグ</div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.tags.split(',').map((tag, i) => (
                                                <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Production Count */}
                                <div className="pt-3 border-t border-green-200">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900">
                                            <span className="font-bold text-2xl">{productionCount}</span> 回作られました
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">このサイズ・形状での製作実績</p>
                                    </div>
                                </div>

                                {/* Posted by */}
                                <div className="pt-3 border-t border-green-200">
                                    <div className="text-xs text-slate-500">投稿者</div>
                                    <div className="text-sm font-bold text-slate-700 mt-1">{order.user.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString('ja-JP')}</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Form Sidebar */}
                    <div className="sticky top-24 space-y-6 self-start">
                        <OrderDetailClient
                            orderId={order.id}
                            shape={order.shape}
                            width={order.width}
                            height={order.height}
                            depth={order.depth}
                            diameter={order.diameter}
                            images={productImages}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
