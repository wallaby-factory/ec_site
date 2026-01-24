'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice, SHAPES } from '@/lib/price'
import BagModel from './BagModel'
import { useCart } from '@/context/CartContext'
import OrderGuideModal from './OrderGuideModal'
import { toast } from 'sonner'

const COLORS = {
    fabric: [
        { name: 'グリーン', label: 'GREEN', hex: '#84cc16', img: '/assets/fabrics/mesh_green.jpeg' },
        { name: 'イエロー', label: 'YELLOW', hex: '#FFFF33', img: '/assets/fabrics/mesh_yellow.jpeg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#f97316', img: '/assets/fabrics/mesh_orange.jpeg' },
        { name: 'ピンク', label: 'PINK', hex: '#ec4899', img: '/assets/fabrics/mesh_pink.jpeg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/fabrics/mesh_white.jpeg' },
        { name: 'ブラック', label: 'BLACK', hex: '#000000', img: '/assets/fabrics/mesh_black.jpeg' },
    ],
    cord: [
        { name: 'グリーン', label: 'GREEN', hex: '#84cc16', img: '/assets/cords/cord_green.jpg' },
        { name: 'イエロー', label: 'YELLOW', hex: '#FFFF33', img: '/assets/cords/cord_yellow.jpg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#f97316', img: '/assets/cords/cord_orange.jpg' },
        { name: 'ピンク', label: 'PINK', hex: '#ec4899', img: '/assets/cords/cord_pink.jpg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/cords/cord_white.jpg' },
        { name: 'ブラック', label: 'BLACK', hex: '#000000', img: '/assets/cords/cord_black.jpg' },
    ],
    fastener: [
        { name: 'グリーン', label: 'GREEN', hex: '#84cc16', img: '/assets/stoppers/stopper_green.jpg' },
        { name: 'イエロー', label: 'YELLOW', hex: '#FFFF33', img: '/assets/stoppers/stopper_yellow.jpg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#f97316', img: '/assets/stoppers/stopper_orange.jpg' },
        { name: 'ピンク', label: 'PINK', hex: '#ec4899', img: '/assets/stoppers/stopper_pink.jpg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/stoppers/stopper_white.jpg' },
        { name: 'ブラック', label: 'BLACK', hex: '#000000', img: '/assets/stoppers/stopper_blackjpg.jpg' },
    ]
}

type MaterialStatus = {
    category: string
    name: string
    status: string
}

export default function Customizer({ materials = [] }: { materials?: MaterialStatus[] }) {
    const router = useRouter()
    const { addToCart } = useCart()
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [shape, setShape] = useState<keyof typeof SHAPES>('SQUARE')
    // ... (state declarations remain same)
    const [width, setWidth] = useState(20)
    const [height, setHeight] = useState(30)
    const [depth, setDepth] = useState(10)
    const [diameter, setDiameter] = useState(15)

    const [colorFabric, setColorFabric] = useState(COLORS.fabric[0])
    const [colorCord, setColorCord] = useState(COLORS.cord[0])
    const [colorFastener, setColorFastener] = useState(COLORS.fastener[0])
    const [cordCount, setCordCount] = useState<1 | 2>(1)
    const [quantity, setQuantity] = useState(1)

    // Helper to check stock status
    const getMaterialStatus = (category: string, name: string) => {
        return materials.find(m => m.category === category && m.name === name)?.status
    }

    const isOutOfStock = (category: string, name: string) => {
        return getMaterialStatus(category, name) === 'OUT_OF_STOCK'
    }

    // ... (rest of calcs)
    const unitPrice = useMemo(() => {
        return calculatePrice({
            shape,
            width,
            height,
            depth,
            diameter
        })
    }, [shape, width, height, depth, diameter])

    const fabricArea = useMemo(() => {
        if (shape === 'SQUARE') return width * height * 2
        if (shape === 'CYLINDER') {
            const r = diameter / 2
            return Math.round((Math.PI * r * r) + (Math.PI * diameter * height))
        }
        if (shape === 'CUBE') return (width * depth) + (width * height * 2) + (depth * height * 2)
        return 0
    }, [shape, width, height, depth, diameter])

    const totalPrice = useMemo(() => {
        return unitPrice * quantity
    }, [unitPrice, quantity])

    return (
        <div className="min-h-screen bg-grass-pattern">
            <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-4">オーダーメイド注文ページ</h1>
                    <p className="text-white/90 drop-shadow-sm mb-4">あなただけのキャンプ用品収納袋をデザインしましょう</p>

                    <button
                        onClick={() => setIsGuideOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors text-sm font-bold border border-white/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        オーダーメイドについて（価格・納期など）
                    </button>
                </header>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Main Configuration Area (2 columns) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Step 1: Shape Selection */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">1</span>
                                形状
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setShape('SQUARE')}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${shape === 'SQUARE' ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-md border border-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-700">平袋 (Flat)</span>
                                </button>
                                <button
                                    onClick={() => setShape('CYLINDER')}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${shape === 'CYLINDER' ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-full border border-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-700">円筒 (Cylinder)</span>
                                </button>
                                <button
                                    onClick={() => setShape('CUBE')}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${shape === 'CUBE' ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-lg border border-slate-300 skew-x-6 scale-90"></div>
                                    <span className="text-sm font-bold text-slate-700">立方体 (Cube)</span>
                                </button>
                            </div>
                        </section>

                        {/* Step 2: Dimensions */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">2</span>
                                サイズ
                            </h2>

                            <div className="grid grid-cols-1 gap-8 items-center">
                                <div className="grid grid-cols-2 gap-6">
                                    {shape === 'CYLINDER' ? (
                                        <>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">直径 (cm)</label>
                                                <input
                                                    type="number"
                                                    value={diameter}
                                                    onChange={(e) => setDiameter(Number(e.target.value))}
                                                    className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                                    min="5"
                                                    max="30"
                                                />
                                                <p className="text-[10px] text-slate-400">最大 30cm</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">高さ (cm)</label>
                                                <input
                                                    type="number"
                                                    value={height}
                                                    onChange={(e) => setHeight(Number(e.target.value))}
                                                    className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                                    min="10"
                                                    max="100"
                                                />
                                                <p className="text-[10px] text-slate-400">最大 100cm</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">幅 (cm)</label>
                                                <input
                                                    type="number"
                                                    value={width}
                                                    onChange={(e) => setWidth(Number(e.target.value))}
                                                    className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                                    min="5"
                                                    max="50"
                                                />
                                                <p className="text-[10px] text-slate-400">5〜50cm</p>
                                            </div>
                                            {shape === 'CUBE' && (
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">奥行 (cm)</label>
                                                    <input
                                                        type="number"
                                                        value={depth}
                                                        onChange={(e) => setDepth(Number(e.target.value))}
                                                        className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                                        min="5"
                                                        max="45"
                                                    />
                                                    <p className="text-[10px] text-slate-400">最大 45cm</p>
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">高さ (cm)</label>
                                                <input
                                                    type="number"
                                                    value={height}
                                                    onChange={(e) => setHeight(Number(e.target.value))}
                                                    className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                                    min="5"
                                                    max="90"
                                                />
                                                <p className="text-[10px] text-slate-400">5〜90cm（ヘム+スリット4cmを含む）</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Step 3: Cord Count */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">3</span>
                                コードの数
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCordCount(1)}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${cordCount === 1 ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="text-2xl font-bold text-slate-700">1本</div>
                                    <span className="text-xs font-bold text-slate-500">片側 (One Side)</span>
                                </button>
                                <button
                                    onClick={() => setCordCount(2)}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${cordCount === 2 ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="text-2xl font-bold text-slate-700">2本</div>
                                    <span className="text-xs font-bold text-slate-500">両側 (Two Sides)</span>
                                </button>
                            </div>
                        </section>

                        {/* Step 4: Colors */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">4</span>
                                カラー
                            </h2>

                            <div className="space-y-12">
                                <div>
                                    <label className="block text-sm font-bold text-green-900 mb-4">生地の色</label>
                                    <div className="flex flex-wrap gap-6">
                                        {COLORS.fabric.map((c) => {
                                            const disabled = isOutOfStock('FABRIC', c.name)
                                            return (
                                                <div key={c.name} className="flex flex-col items-center gap-2 relative">
                                                    <button
                                                        onClick={() => !disabled && setColorFabric(c)}
                                                        disabled={disabled}
                                                        className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${colorFabric.name === c.name ? 'border-green-600 ring-4 ring-green-100 scale-105 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                                                            } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                                    >
                                                        <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                                    </button>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">{c.name}</span>
                                                    {disabled && (
                                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow whitespace-nowrap z-10">
                                                            入荷待ち
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div>
                                        <label className="block text-sm font-bold text-green-900 mb-4">コードの色</label>
                                        <div className="flex flex-wrap gap-6">
                                            {COLORS.cord.map((c) => {
                                                const disabled = isOutOfStock('CORD', c.name)
                                                return (
                                                    <div key={c.name} className="flex flex-col items-center gap-2 relative">
                                                        <button
                                                            onClick={() => !disabled && setColorCord(c)}
                                                            disabled={disabled}
                                                            className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${colorCord.name === c.name ? 'border-green-600 ring-4 ring-green-100 scale-105 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                                                                } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                                        >
                                                            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                                        </button>
                                                        <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">{c.name}</span>
                                                        {disabled && (
                                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow whitespace-nowrap z-10">
                                                                入荷待ち
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>

                                {cordCount === 1 && (
                                    <div>
                                        <label className="block text-sm font-bold text-green-900 mb-4">コードストッパーの色</label>
                                        <div className="flex flex-wrap gap-6">
                                            {COLORS.fastener.map((c) => {
                                                const disabled = isOutOfStock('FASTENER', c.name)
                                                return (
                                                    <div key={c.name} className="flex flex-col items-center gap-2 relative">
                                                        <button
                                                            onClick={() => !disabled && setColorFastener(c)}
                                                            disabled={disabled}
                                                            className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${colorFastener.name === c.name ? 'border-green-600 ring-4 ring-green-100 scale-105 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                                                                } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                                        >
                                                            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                                        </button>
                                                        <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">{c.name}</span>
                                                        {disabled && (
                                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded shadow whitespace-nowrap z-10">
                                                                入荷待ち
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Step 5: Quantity */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">5</span>
                                注文個数
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">数量</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                                        className="input-glass w-full px-4 py-3 rounded-lg text-lg"
                                        min="1"
                                        max="100"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 italic mt-8">
                                    * 大口注文（101個以上）をご希望の場合は別途お問い合わせください。
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right: Summary Sidebar */}
                    <div className="sticky top-24 space-y-6 self-start">
                        {/* 3D Preview Area */}
                        <div className="aspect-square relative flex items-center justify-center bg-sky-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                            <BagModel
                                width={width}
                                height={height}
                                depth={depth}
                                diameter={diameter}
                                shape={shape}
                                fabricColor={colorFabric.hex}
                                cordColor={colorCord.hex}
                                stopperColor={colorFastener.hex}
                                cordCount={cordCount}
                            />
                        </div>

                        <section className="card-glass p-8">
                            <h2 className="text-2xl font-bold mb-6 text-green-900">カスタマイズ内容</h2>

                            {/* Real-time Customization Summary */}
                            <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-100 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div className="text-xs text-slate-500">形状</div>
                                    <div className="text-sm font-bold text-right text-slate-700">
                                        {shape === 'SQUARE' && '平袋'}
                                        {shape === 'CYLINDER' && '円筒'}
                                        {shape === 'CUBE' && '立方体'}
                                    </div>

                                    <div className="text-xs text-slate-500">サイズ</div>
                                    <div className="text-sm font-bold text-right text-slate-700">
                                        {shape === 'SQUARE' && `${width} × ${height} cm`}
                                        {shape === 'CYLINDER' && `φ${diameter} × ${height} cm`}
                                        {shape === 'CUBE' && `${width} × ${height} × ${depth} cm`}
                                    </div>

                                    <div className="text-xs text-slate-500">生地面積</div>
                                    <div className="text-sm font-bold text-right text-slate-700">{fabricArea.toLocaleString()} cm²</div>

                                    <div className="text-xs text-slate-500">コード本数</div>
                                    <div className="text-sm font-bold text-right text-slate-700">{cordCount} 本</div>

                                    <div className="text-xs text-slate-500">生地色</div>
                                    <div className="text-sm font-bold text-right flex items-center justify-end gap-2 text-slate-700">
                                        <div className="w-3 h-3 rounded-full border border-green-700" style={{ backgroundColor: colorFabric.hex }} />
                                        {colorFabric.name}
                                    </div>

                                    <div className="text-xs text-slate-500">コードの色</div>
                                    <div className="text-sm font-bold text-right flex items-center justify-end gap-2 text-slate-700">
                                        <div className="w-3 h-3 rounded-full border border-green-700" style={{ backgroundColor: colorCord.hex }} />
                                        {colorCord.name}
                                    </div>

                                    {cordCount === 1 && (
                                        <>
                                            <div className="text-xs text-slate-500">コードストッパー</div>
                                            <div className="text-sm font-bold text-right flex items-center justify-end gap-2 text-slate-700">
                                                <div className="w-3 h-3 rounded-full border border-green-700" style={{ backgroundColor: colorFastener.hex }} />
                                                {colorFastener.name}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-green-200 flex justify-between items-center">
                                    <span className="text-xs text-slate-500">数量</span>
                                    <span className="text-sm font-bold text-slate-700">{quantity} 個</span>
                                </div>
                            </div>

                            <div className="bg-green-800 rounded-xl p-6 mb-8 text-center shadow-inner relative overflow-hidden">
                                {/* Accent Decoration */}
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <p className="text-sm text-green-300 mb-1 font-medium">合計金額 (税込)</p>
                                <p className="text-4xl font-black text-yellow-400">¥{totalPrice.toLocaleString()}</p>
                                <p className="text-[10px] text-green-400 mt-2 opacity-75">単価: ¥{unitPrice.toLocaleString()}</p>
                            </div>

                            <button
                                onClick={() => {
                                    addToCart({
                                        id: crypto.randomUUID(),
                                        shape,
                                        width,
                                        height,
                                        depth: shape === 'CUBE' ? depth : undefined,
                                        diameter: shape === 'CYLINDER' ? diameter : undefined,
                                        fabricColor: colorFabric,
                                        cordColor: colorCord,
                                        stopperColor: colorFastener,
                                        cordCount,
                                        quantity,
                                        unitPrice
                                    })
                                    toast.success('カートに追加しました！')
                                    router.push('/cart')
                                }}
                                className="bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 hover:scale-[1.02] active:scale-95 w-full text-xl py-4 flex items-center justify-center gap-3 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                カートに追加する
                            </button>
                        </section>
                    </div>
                </div>
            </div >
            <OrderGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div >
    )
}
