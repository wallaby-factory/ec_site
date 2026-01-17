'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
    const router = useRouter()

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🛒</div>
                    <h1 className="text-2xl font-bold text-slate-800">カートは空です</h1>
                    <p className="text-slate-600">まだ商品が追加されていません。</p>
                    <Link
                        href="/customizer"
                        className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                        オーダーメイドを始める
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <span className="text-4xl">🛒</span>
                    ショッピングカート
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-4 transition-all hover:shadow-md">
                                {/* Visual Representation (Simplified for List) */}
                                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden text-xs text-slate-400">
                                    {/* Ideally show a thumbnail here, but for now just shape icon */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 bg-slate-200 border border-slate-300 ${item.shape === 'CYLINDER' ? 'rounded-full' : item.shape === 'CUBE' ? 'rounded-md' : 'rounded-sm'}`}></div>
                                        <span className="text-[10px]">{item.shape}</span>
                                    </div>
                                    <div className="absolute bottom-0 w-full h-1" style={{ backgroundColor: item.fabricColor.hex }}></div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800">
                                            {item.shape === 'SQUARE' && '平袋'}
                                            {item.shape === 'CYLINDER' && '円筒'}
                                            {item.shape === 'CUBE' && '立方体'}
                                            {' '}オーダーメイド巾着
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                            title="削除"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="text-sm text-slate-600 space-y-1 mb-4">
                                        <p>
                                            サイズ:
                                            {item.shape === 'SQUARE' && ` ${item.width} × ${item.height} cm`}
                                            {item.shape === 'CYLINDER' && ` φ${item.diameter} × ${item.height} cm`}
                                            {item.shape === 'CUBE' && ` ${item.width} × ${item.height} × ${item.depth} cm`}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fabricColor.hex }}></span> 生地: {item.fabricColor.name}</span>
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.cordColor.hex }}></span> コード: {item.cordColor.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-500">数量</span>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                                            >
                                                {[...Array(10).keys()].map(i => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                            </select>
                                        </div>
                                        <div className="font-bold text-slate-700">
                                            ¥{(item.unitPrice * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">注文サマリー</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>小計 ({cart.length}点)</span>
                                    <span>¥{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>送料</span>
                                    {totalPrice >= 10000 ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">無料</span>
                                    ) : (
                                        <span>¥350</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-bold text-slate-800">合計 (税込)</span>
                                <span className="text-3xl font-black text-green-700">¥{(totalPrice + (totalPrice >= 10000 ? 0 : 350)).toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>レジへ進む</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            <div className="mt-4 text-center">
                                <Link href="/customizer" className="text-sm text-green-600 hover:underline">
                                    買い物を続ける
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
