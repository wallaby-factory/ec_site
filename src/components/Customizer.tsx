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
        { name: 'イエロー', label: 'YELLOW', hex: '#FFF450', img: '/assets/fabrics/mesh_yellow.jpeg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#FF8C00', img: '/assets/fabrics/mesh_orange.jpeg' },
        { name: 'ピンク', label: 'PINK', hex: '#FF69B4', img: '/assets/fabrics/mesh_pink.jpeg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/fabrics/mesh_white.jpeg' },
        { name: 'ブラック', label: 'BLACK', hex: '#444444', img: '/assets/fabrics/mesh_black.jpeg' },
    ],
    cord: [
        { name: 'グリーン', label: 'GREEN', hex: '#84cc16', img: '/assets/cords/cord_green.jpg' },
        { name: 'イエロー', label: 'YELLOW', hex: '#FFF450', img: '/assets/cords/cord_yellow.jpg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#FF8C00', img: '/assets/cords/cord_orange.jpg' },
        { name: 'ピンク', label: 'PINK', hex: '#FF69B4', img: '/assets/cords/cord_pink.jpg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/cords/cord_white.jpg' },
        { name: 'ブラック', label: 'BLACK', hex: '#444444', img: '/assets/cords/cord_black.jpg' },
    ],
    fastener: [
        { name: 'グリーン', label: 'GREEN', hex: '#84cc16', img: '/assets/stoppers/stopper_green.jpg' },
        { name: 'イエロー', label: 'YELLOW', hex: '#FFF450', img: '/assets/stoppers/stopper_yellow.jpg' },
        { name: 'オレンジ', label: 'ORANGE', hex: '#FF8C00', img: '/assets/stoppers/stopper_orange.jpg' },
        { name: 'ピンク', label: 'PINK', hex: '#FF69B4', img: '/assets/stoppers/stopper_pink.jpg' },
        { name: 'ホワイト', label: 'WHITE', hex: '#ffffff', img: '/assets/stoppers/stopper_white.jpg' },
        { name: 'ブラック', label: 'BLACK', hex: '#444444', img: '/assets/stoppers/stopper_blackjpg.jpg' },
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
    const [groundTexture, setGroundTexture] = useState<'GRASS' | 'LEAVES' | 'GRAVEL'>('GRASS')
    const [slitSize, setSlitSize] = useState(2)

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


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative items-start">
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
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${shape === 'SQUARE' ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-200' : 'border-slate-200 hover:border-green-300 bg-white/50'}`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-md border border-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-700">平型</span>
                                </button>
                                <button
                                    disabled
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 opacity-60 cursor-not-allowed border-slate-200 bg-slate-100/50`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-full border border-slate-300"></div>
                                    <span className="text-sm font-bold text-slate-500">円筒型</span>
                                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">Coming Soon</span>
                                </button>
                                <button
                                    disabled
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 opacity-60 cursor-not-allowed border-slate-200 bg-slate-100/50`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-lg border border-slate-300 skew-x-6 scale-90"></div>
                                    <span className="text-sm font-bold text-slate-500">箱型</span>
                                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">Coming Soon</span>
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

                                {/* Slit Size Input */}
                                <div className="pt-4 border-t border-slate-200/60">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-slate-700">スリットサイズ</label>
                                            <span className="text-sm font-bold text-green-700">{slitSize} cm</span>
                                        </div>
                                        <input
                                            type="range"
                                            value={slitSize}
                                            onChange={(e) => setSlitSize(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                            min="0"
                                            max="30"
                                            step="1"
                                        />
                                        <p className="text-xs text-slate-500">
                                            ※開口部の切れ込みの深さです（0〜30cm）。出し入れのしやすさに影響します。
                                            <br />※デフォルト: 2cm
                                        </p>
                                    </div>
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


                    </div>

                    {/* Right: Summary Sidebar (Sticky & Full Height) */}
                    <div className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col gap-4">

                        {/* 3D Preview Area (Flexible Height) */}
                        <div className="flex-1 min-h-0 relative flex items-center justify-center bg-sky-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
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
                                groundTexture={groundTexture}
                                slitSize={slitSize}
                            />

                            {/* Ground Texture Switcher (Overlay at bottom of preview) */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                {[
                                    { id: 'GRASS', label: '芝生', color: 'bg-green-500' },
                                    { id: 'LEAVES', label: '落葉', color: 'bg-orange-700' },
                                    { id: 'GRAVEL', label: '砂利', color: 'bg-gray-500' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setGroundTexture(t.id as any)}
                                        className={`min-w-16 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm transition-all ${t.color} ${groundTexture === t.id ? 'ring-2 ring-offset-2 ring-green-400 scale-105' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compact Summary & Price Action Area (Fixed Bottom) */}
                        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-green-100 shrink-0 flex flex-col">

                            {/* Collapsible Details / Compact Summary */}
                            <div className="p-4 border-b border-slate-100 overflow-y-auto max-h-[150px] text-sm space-y-1">
                                <div className="flex justify-between"><span className="text-slate-500">形状</span><span className="font-bold">{shape === 'SQUARE' ? '平型' : (shape === 'CYLINDER' ? '円筒型' : '箱型')}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">サイズ</span><span className="font-bold">{shape === 'SQUARE' ? `${width}×${height} (スリット${slitSize})` : (shape === 'CUBE' ? `${width}×${height}×${depth}` : `φ${diameter}×${height}`)}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">生地</span><span className="font-bold">{colorFabric.name}</span></div>
                            </div>

                            {/* Price & Cart */}
                            <div className="p-4 space-y-4 bg-green-50/50 rounded-b-xl">
                                <div className="flex justify-between items-end">
                                    <div className="text-slate-500 font-bold text-sm">概算価格 (税込)</div>
                                    <div className="text-3xl font-extrabold text-green-700">
                                        ¥{totalPrice.toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-24 shrink-0">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                                            className="input-glass w-full px-3 py-3 rounded-lg text-lg text-center font-bold"
                                            min="1"
                                            max="100"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart({
                                                id: crypto.randomUUID(),
                                                shape,
                                                width,
                                                height,
                                                depth,
                                                diameter,
                                                fabricColor: colorFabric,
                                                cordColor: colorCord,
                                                stopperColor: colorFastener,
                                                cordCount,
                                                quantity,
                                                unitPrice,
                                                slitSize
                                            })
                                            toast.success('カートに追加しました')
                                            router.push('/cart')
                                        }}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                                        </svg>
                                        カートに入れる
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <OrderGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div >
    )
}
