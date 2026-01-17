'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/actions/order'

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // In a real app, we would load the user's address here if logged in.
    // For now, let's assume the Server Action will handle pulling the user's address from their profile 
    // if we pass the user ID (which we'll get from the session on the server side).
    // But wait, this is a Client Component. We need to trigger the action.

    // Simplification for MVP: We just show a "Confirm Order" button that calls the server action.
    // The server action will check if user is logged in. If not, it should probably fail or redirect in middleware.
    // Ideally, we should check login state here. But let's let the server action handle the heavy lifting.

    // Better UX: Show a form that is pre-filled if user is logged in (passed via props? or fetching?).
    // Let's implement a simple view that assumes the user has confirmed their address in /account.
    // "登録済みの住所に発送します" (Will ship to registered address).

    const handleOrder = async () => {
        setLoading(true)
        setError(null)

        try {
            // Transform cart items to format expected by server
            // Note: Colors are objects in CartItem {name, hex}, but DB expects strings? 
            // In schema: colorFabric (String), colorZipper (String), etc.
            // Let's assume we store the HEX or NAME. The schema typically stores identifiers or names.
            // Let's verify schema... OrderItem model has String for colors.
            // Let's pass the HEX codes or NAMES. Probably NAMES is safer for human readability, 
            // but for exact reproduction HEX is better. Let's store HEX? 
            // Wait, previous simple order impl stored Strings. The seed data used "Green", "Black".
            // Let's store the NAME for now as it maps to the predefined list.

            const orderItems = cart.map(item => ({
                shape: item.shape,
                width: item.width,
                height: item.height,
                depth: item.depth,
                diameter: item.diameter,
                colorFabric: item.fabricColor.name,
                colorZipper: item.cordColor.name, // "cord" in schema is colorZipper for legacy reasons or we should rename? Schema comment said "String" (cord).
                colorFastener: item.stopperColor.name,
                cordCount: item.cordCount,
                quantity: item.quantity,
                price: item.unitPrice
            }))

            const result = await createOrder(orderItems)

            if (result.success) {
                clearCart()
                router.push(`/account?success=true`) // Redirect to account page with success message
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
                        </div>

                        <div className="flex justify-between items-center py-4 border-t-2 border-slate-300">
                            <span className="text-xl font-bold text-slate-800">合計金額 (税込)</span>
                            <span className="text-3xl font-black text-green-700">¥{(totalPrice + (totalPrice >= 10000 ? 0 : 350)).toLocaleString()}</span>
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
