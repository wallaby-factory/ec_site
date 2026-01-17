'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const COLORS = [
    { name: 'グリーン', value: '#84cc16' },
    { name: 'イエロー', value: '#eab308' },
    { name: 'オレンジ', value: '#f97316' },
    { name: 'ピンク', value: '#ec4899' },
    { name: 'ホワイト', value: '#ffffff' },
    { name: 'ブラック', value: '#000000' },
]

interface OrderDetailClientProps {
    orderId?: string
    shape?: string
    width?: number
    height?: number
    depth?: number | null
    diameter?: number | null
    images: string[]
}

export function OrderDetailClient({ orderId, shape, width, height, depth, diameter, images }: OrderDetailClientProps) {
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedColors, setSelectedColors] = useState({
        fabric: '#84cc16',
        zipper: '#000000',
        fastener: '#000000'
    })

    // If only images prop is provided, this is the carousel component
    if (!orderId) {
        return (
            <div className="relative">
                {images.length > 0 && (
                    <>
                        <div className="aspect-square relative bg-slate-100">
                            <Image
                                src={images[currentImageIndex]}
                                alt="商品画像"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-4 justify-center">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                                            ? 'bg-green-600 w-8'
                                            : 'bg-slate-300 hover:bg-slate-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }

    // Full order form component
    function handleShare() {
        const url = `${window.location.origin}/gallery/${orderId}`
        navigator.clipboard.writeText(url).then(() => {
            alert('URLをクリップボードにコピーしました！')
        })
    }

    function handleOrder() {
        // Navigate to customizer with pre-filled values
        const params = new URLSearchParams({
            shape: shape || 'SQUARE',
            width: width?.toString() || '30',
            height: height?.toString() || '40',
            ...(depth && { depth: depth.toString() }),
            ...(diameter && { diameter: diameter.toString() }),
            colorFabric: selectedColors.fabric,
            colorZipper: selectedColors.zipper,
            colorFastener: selectedColors.fastener,
        })
        router.push(`/customizer?${params.toString()}`)
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* Share Button */}
            <button
                onClick={handleShare}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <span className="text-xl">🔗</span>
                <span>このページをシェア</span>
            </button>

            {/* Color Selection */}
            <div className="border-t pt-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">カラーを選択</h3>
                <p className="text-sm text-slate-600 mb-4">※ サイズは変更できません。色のみ選択できます。</p>

                {/* Fabric Color */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">生地の色</label>
                    <div className="grid grid-cols-6 gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColors({ ...selectedColors, fabric: color.value })}
                                className={`aspect-square rounded-lg border-2 transition-all ${selectedColors.fabric === color.value
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Zipper Color */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">コードの色</label>
                    <div className="grid grid-cols-6 gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColors({ ...selectedColors, zipper: color.value })}
                                className={`aspect-square rounded-lg border-2 transition-all ${selectedColors.zipper === color.value
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Fastener Color */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">コードストッパーの色</label>
                    <div className="grid grid-cols-6 gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColors({ ...selectedColors, fastener: color.value })}
                                className={`aspect-square rounded-lg border-2 transition-all ${selectedColors.fastener === color.value
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Order Button */}
                <button
                    onClick={handleOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl text-lg"
                >
                    このサイズで注文する →
                </button>
            </div>
        </div>
    )
}
