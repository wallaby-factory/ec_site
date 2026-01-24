'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { SHAPES, calculatePrice, type Shape } from '@/lib/price'

// Dynamically import BagModel with no SSR to avoid window not found errors
const BagModel = dynamic(() => import('@/components/BagModel'), { ssr: false })

// --- Configuration Data ---

const FABRIC_colors = [
    { name: '生成', hex: '#f5f5dc', img: '/assets/swatches/fabric_kinari.jpg' },
    { name: '黒', hex: '#1a1a1a', img: '/assets/swatches/fabric_black.jpg' },
    { name: '紺', hex: '#00264d', img: '/assets/swatches/fabric_navy.jpg' },
    { name: 'カーキ', hex: '#5f6345', img: '/assets/swatches/fabric_khaki.jpg' },
    { name: '茶', hex: '#4e3324', img: '/assets/swatches/fabric_brown.jpg' },
    { name: 'サックス', hex: '#87ceeb', img: '/assets/swatches/fabric_sax.jpg' },
    { name: 'ピンク', hex: '#ffc0cb', img: '/assets/swatches/fabric_pink.jpg' },
    { name: '赤', hex: '#cc0000', img: '/assets/swatches/fabric_red.jpg' },
]

const CORD_colors = [
    { name: '黒', hex: '#000000', img: '/assets/swatches/cord_black.jpg' },
    { name: '生成', hex: '#f5f5dc', img: '/assets/swatches/cord_kinari.jpg' },
    { name: '赤', hex: '#cc0000', img: '/assets/swatches/cord_red.jpg' },
    { name: '紺', hex: '#00264d', img: '/assets/swatches/cord_navy.jpg' },
    { name: '深緑', hex: '#006400', img: '/assets/swatches/cord_darkgreen.jpg' },
    { name: '茶', hex: '#4e3324', img: '/assets/swatches/cord_brown.jpg' },
]

const FASTENER_colors = [
    { name: '黒', hex: '#1a1a1a', img: '/assets/swatches/fastener_black.jpg' },
    // { name: '白', hex: '#ffffff', img: '/assets/swatches/fastener_white.jpg' }, // Out of stock example
]

// Mock Stock Data (In real app, fetch from DB)
const STOCK = {
    FABRIC: [] as string[], // e.g., ['赤']
    CORD: [] as string[],
    FASTENER: ['白'] as string[],
}

export default function CustomizerPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    // Current Selection State
    const [shape, setShape] = useState<Shape>('SQUARE')

    // Dimensions
    const [width, setWidth] = useState(20)
    const [height, setHeight] = useState(30)
    const [depth, setDepth] = useState(10)
    const [diameter, setDiameter] = useState(15)

    // Colors
    const [colorFabric, setColorFabric] = useState(FABRIC_colors[0])
    const [colorCord, setColorCord] = useState(CORD_colors[0])
    const [colorFastener, setColorFastener] = useState(FASTENER_colors[0])

    // Config
    const [cordCount, setCordCount] = useState<1 | 2>(1)
    const [quantity, setQuantity] = useState(1)

    // Calculated Price
    const [price, setPrice] = useState(0)

    // Update Price whenever factors change
    useEffect(() => {
        const p = calculatePrice({ shape, width, height, depth, diameter })
        setPrice(p * quantity)
    }, [shape, width, height, depth, diameter, quantity])

    const isOutOfStock = (category: keyof typeof STOCK, name: string) => {
        return STOCK[category].includes(name)
    }

    const handleAddToCart = async () => {
        // Build the customization object
        const customizationData = {
            shape,
            dimensions: { width, height, depth, diameter },
            colors: {
                fabric: colorFabric.name,
                cord: colorCord.name,
                fastener: colorFastener.name,
            },
            cordCount,
            quantity,
            price
        }

        // In a real app, you would POST this to an API or add to a global cart state context
        console.log('Adding to cart:', customizationData)
        // For prototype, just alert or mock
        alert(`カートに追加しました (Mock)\n金額: ¥${price.toLocaleString()}\n構成: ${shape} / ${colorFabric.name}`)

        // Redirect to Cart or similar
        // router.push('/cart')
    }

    // Determine what sliders to show based on shapes
    const renderDimensionInputs = () => {
        if (shape === 'SQUARE') { // Flat Bag
            return (
                <>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">横幅 (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{width}cm</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>5cm</span>
                            <span>50cm</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">高さ (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{height}cm</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="90"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>5cm</span>
                            <span>90cm</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-2">※ 口部分の4cm（ヘム2cm+スリット2cm）は固定で、入力した高さに含まれます。</p>
                    </div>
                </>
            )
        } else if (shape === 'CYLINDER') { // Cylinder Bag
            return (
                <>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">直径 (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{diameter}cm</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="40"
                            value={diameter}
                            onChange={(e) => setDiameter(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>5cm</span>
                            <span>40cm</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">高さ (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{height}cm</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="60"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>10cm</span>
                            <span>60cm</span>
                        </div>
                    </div>
                </>
            )
        } else { // Cube (Bento Bag)
            return (
                <>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">横幅 (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{width}cm</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="40"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">マチ (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{depth}cm</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="20"
                            value={depth}
                            onChange={(e) => setDepth(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">高さ (cm)</label>
                            <span className="text-sm font-bold text-slate-900">{height}cm</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="40"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                </>
            )
        }
    }

    return (
        <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-green-900 mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    オーダーメイド見積もり・注文
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    {/* Left: Controls */}
                    <div className="space-y-8">

                        {/* Step 1: Shape Selection */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">1</span>
                                形状を選択
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {(Object.keys(SHAPES) as Shape[]).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setShape(s)}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${shape === s ? 'border-green-600 bg-green-50 ring-4 ring-green-100 shadow-xl scale-105' : 'border-slate-200 hover:border-green-300 hover:bg-white'
                                            }`}
                                    >
                                        <div className={`w-16 h-16 rounded-lg ${shape === s ? 'bg-green-200' : 'bg-slate-100'}`}>
                                            {/* Icon Placeholder */}
                                            {s === 'SQUARE' && <div className="w-full h-full flex items-center justify-center text-2xl">⬜</div>}
                                            {s === 'CYLINDER' && <div className="w-full h-full flex items-center justify-center text-2xl">🛢️</div>}
                                            {s === 'CUBE' && <div className="w-full h-full flex items-center justify-center text-2xl">🧊</div>}
                                        </div>
                                        <span className="font-bold text-slate-700">
                                            {s === 'SQUARE' && '平袋'}
                                            {s === 'CYLINDER' && '円筒形'}
                                            {s === 'CUBE' && '立体'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Step 2: Dimensions */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">2</span>
                                サイズを入力
                            </h2>
                            <div className="space-y-6">
                                {renderDimensionInputs()}
                            </div>
                        </section>

                        {/* Step 3: Cord Count (New) */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">3</span>
                                紐の本数
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCordCount(1)}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold ${cordCount === 1 ? 'border-green-600 bg-green-50 text-green-800' : 'border-slate-200 text-slate-600'}`}
                                >
                                    1本（片側）
                                </button>
                                <button
                                    onClick={() => setCordCount(2)}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold ${cordCount === 2 ? 'border-green-600 bg-green-50 text-green-800' : 'border-slate-200 text-slate-600'}`}
                                >
                                    2本（両側）
                                </button>
                            </div>
                        </section>

                        {/* Step 4: Colors (Fabric, Cord, Fastener) */}
                        <section className="card-glass p-6">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                                <span className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl font-bold shadow-lg">4</span>
                                色を選択
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-green-900 mb-4">本体（生地）の色</label>
                                    <div className="flex flex-wrap gap-6">
                                        {FABRIC_colors.map((c) => {
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

                                <div>
                                    <label className="block text-sm font-bold text-green-900 mb-4">紐（コード）の色</label>
                                    <div className="flex flex-wrap gap-6">
                                        {CORD_colors.map((c) => {
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

                                {cordCount === 1 && (
                                    <div>
                                        <label className="block text-sm font-bold text-green-900 mb-4">コードストッパーの色</label>
                                        <div className="flex flex-wrap gap-6">
                                            {FASTENER_colors.map((c) => {
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
                                        {shape === 'CYLINDER' && '円筒形'}
                                        {shape === 'CUBE' && '立体'}
                                    </div>

                                    <div className="text-xs text-slate-500">サイズ</div>
                                    <div className="text-sm font-bold text-right text-slate-700">
                                        {shape === 'SQUARE' && `${width}cm × ${height}cm`}
                                        {shape === 'CYLINDER' && `Φ${diameter}cm × ${height}cm`}
                                        {shape === 'CUBE' && `${width}cm × ${height}cm × ${depth}cm`}
                                    </div>
                                </div>
                                <div className="border-t border-green-200 my-2"></div>
                                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-4">
                                    <div className="text-sm text-slate-600">単価 (税込)</div>
                                    <div className="text-xl font-bold text-green-700">¥{calculatePrice({ shape, width, height, depth, diameter }).toLocaleString()}</div>
                                </div>

                                <div className="flex justify-between items-center text-lg font-bold border-t border-green-300 pt-4">
                                    <span className="text-green-900">合計金額</span>
                                    <span className="text-3xl text-green-700">¥{price.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5.008c.643 2.505-1.59 4.309-3.9 4.544a15.228 15.228 0 01-5.91-.013c-2.327-.234-4.57-2.03-5.216-4.544l-1.263-5.008c-.172-.68.324-1.373 1.026-1.373h13.565c.703 0 1.2.693 1.025 1.373z" />
                                </svg>
                                カートに入れる
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
