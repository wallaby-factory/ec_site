'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/order'
import { getUserPointState } from '@/actions/point'

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Point System State
    const [totalPoints, setTotalPoints] = useState(0)
    const [usedPoints, setUsedPoints] = useState(0)
    const [isPointsExpired, setIsPointsExpired] = useState(false)
    const [loadingPoints, setLoadingPoints] = useState(true)

    useEffect(() => {
        // Fetch user points on mount
        getUserPointState().then(result => {
            if (result.success && result.state) {
                setTotalPoints(result.state.currentPoints)
                setIsPointsExpired(result.state.isExpired)
            }
            setLoadingPoints(false)
        })
    }, [])

    const shippingFee = totalPrice >= 10000 ? 0 : 350
    const grandTotal = totalPrice + shippingFee
    const finalPayment = Math.max(0, grandTotal - usedPoints)
    const earnedPoints = Math.floor(finalPayment * 0.05)

    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0
        // Clamp between 0 and min(totalPoints, grandTotal)
        const maxUse = Math.min(totalPoints, grandTotal)
        if (val < 0) return
        if (val > maxUse) {
            setUsedPoints(maxUse)
        } else {
            setUsedPoints(val)
        }
    }

    const handleOrder = async () => {
        setLoading(true)
        setError(null)

        try {
            const orderItems = cart.map(item => ({
                shape: item.shape,
                width: item.width,
                height: item.height,
                depth: item.depth,
                diameter: item.diameter,
                colorFabric: item.fabricColor.name,
                colorZipper: item.cordColor.name,
                colorFastener: item.stopperColor.name,
                cordCount: item.cordCount,
                quantity: item.quantity,
                price: item.unitPrice
            }))

            // Pass usedPoints to createOrder
            const result = await createOrder(orderItems, usedPoints)

            if (result.success) {
                clearCart()
                router.push(`/account?success=true`)
            } else {
                setError(result.error || '注文の処理中にエラーが発生しました。ログインしているか確認してください。')
            }
        } catch (e) {
            console.error(e)
            setError('予期せぬエラーが発生しました。')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-slate-600 mb-4">カートは空です</p>
                    <Link href="/customizer" className="text-green-600 hover:underline">買い物を続ける</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">注文の確認</h1>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6 mb-8">
                        {/* Address Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <h3 className="font-bold text-blue-900">お届け先</h3>
                                <p className="text-sm text-blue-800 mt-1">
                                    会員登録された「マイページ」の住所に発送いたします。<br />
                                    <Link href="/account" className="underline font-bold hover:text-blue-600">
                                        住所を確認・変更する
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-bold text-slate-700 mb-2">注文内容</h3>
                            <div className="border border-slate-200 rounded-lg divide-y">
                                {cart.map(item => (
                                    <div key={item.id} className="p-4 flex justify-between items-center bg-slate-50">
                                        <div>
                                            <div className="font-bold text-slate-800">
                                                {item.shape === 'SQUARE' && '平袋'}
                                                {item.shape === 'CYLINDER' && '円筒'}
                                                {item.shape === 'CUBE' && '立方体'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {item.cordCount}本コード / {item.fabricColor.name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm">x {item.quantity}</div>
                                            <div className="font-bold">¥{(item.unitPrice * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Point Usage Section */}
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                                </svg>
                                ポイント利用
                            </h3>

                            {loadingPoints ? (
                                <p className="text-sm text-green-700">読み込み中...</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm text-green-800">保有ポイント</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-green-700">
                                                {totalPoints.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-green-600 ml-1">pt</span>
                                        </div>
                                    </div>

                                    {isPointsExpired && (
                                        <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                            ※ 有効期限切れのためポイントは失効しました
                                        </div>
                                    )}

                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={usedPoints > 0 ? usedPoints : ''}
                                            onChange={handlePointChange}
                                            placeholder="0"
                                            disabled={totalPoints === 0}
                                            className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-right font-bold text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
                                        />
                                        <span className="text-sm text-green-800 font-bold whitespace-nowrap">pt 利用する</span>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            onClick={() => setUsedPoints(Math.min(totalPoints, grandTotal))}
                                            disabled={totalPoints === 0 || usedPoints === Math.min(totalPoints, grandTotal)}
                                            className="text-xs text-green-600 hover:text-green-800 underline disabled:opacity-50 disabled:no-underline"
                                        >
                                            すべて利用する
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Calculation Summary */}
                        <div className="space-y-2 py-4 border-t border-slate-200">
                            <div className="flex justify-between text-slate-600">
                                <span>商品小計</span>
                                <span>¥{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>送料</span>
                                {totalPrice >= 10000 ? (
                                    <span className="text-green-600 font-bold">無料</span>
                                ) : (
                                    <span>¥350</span>
                                )}
                            </div>
                            {usedPoints > 0 && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>ポイント利用</span>
                                    <span>- {usedPoints.toLocaleString()} pt</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-4 border-t-2 border-slate-300">
                            <div>
                                <span className="text-xl font-bold text-slate-800 block">お支払い金額 (税込)</span>
                                {earnedPoints > 0 && (
                                    <span className="text-xs text-blue-600 font-bold mt-1 block">
                                        ✨ 今回の獲得予定: {earnedPoints.toLocaleString()} pt
                                    </span>
                                )}
                            </div>
                            <span className="text-3xl font-black text-green-700">¥{finalPayment.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-xl shadow-lg transition-all ${loading
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-[1.01]'
                            }`}
                    >
                        {loading ? '処理中...' : '注文を確定する'}
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        ※ 注文確定後のキャンセルはできませんのでご注意ください。
                    </p>
                </div>
            </div>
        </div>
    )
}
