'use client'

import { useState } from 'react'
import { PublishOrderForm } from './PublishOrderForm'
import { useRouter } from 'next/navigation'

interface OrderItemCardProps {
    orderItem: {
        id: string
        shape: string
        width: number
        height: number
        depth: number | null
        diameter: number | null
        quantity: number
        price: number
        cordCount: number
    }
    orderId: string
    orderDate: Date
    publishedOrder?: {
        id: string
        itemName: string
        isPublic: boolean
    } | null
}

export function OrderItemCard({ orderItem, orderId, orderDate, publishedOrder }: OrderItemCardProps) {
    const router = useRouter()
    const [showPublishForm, setShowPublishForm] = useState(false)

    function handlePublishSuccess() {
        setShowPublishForm(false)
        router.refresh()
    }

    return (
        <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="text-sm font-bold text-slate-700 mb-1">
                        {orderItem.quantity}x {orderItem.shape === 'SQUARE' ? '平袋' : orderItem.shape === 'CYLINDER' ? '円筒' : '立方体'}
                    </div>
                    <div className="text-xs text-slate-500">
                        {orderItem.shape === 'CYLINDER'
                            ? `φ${orderItem.diameter} × ${orderItem.height}cm`
                            : orderItem.shape === 'CUBE'
                                ? `${orderItem.width} × ${orderItem.height} × ${orderItem.depth}cm`
                                : `${orderItem.width} × ${orderItem.height}cm`
                        }
                        <span className="ml-2 pl-2 border-l border-slate-300">
                            コード: {orderItem.cordCount}本
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        {orderDate.toLocaleDateString('ja-JP')}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">
                        ¥{(orderItem.price * orderItem.quantity).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Publish Status - No toggle, just status display */}
            <div className="mt-3 pt-3 border-t border-slate-100">
                {publishedOrder ? (
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${publishedOrder.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {publishedOrder.isPublic ? '公開中' : '一時非公開'}
                        </span>
                        <span className="text-xs text-slate-600">{publishedOrder.itemName}</span>
                        <span className="text-xs text-slate-400 ml-auto">※ ギャラリー投稿から管理</span>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowPublishForm(true)}
                        className="w-full text-sm px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        ギャラリーに公開する
                    </button>
                )}
            </div>

            {/* Publish Form Modal */}
            {showPublishForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <PublishOrderForm
                            orderItemId={orderItem.id}
                            onSuccess={handlePublishSuccess}
                            onCancel={() => setShowPublishForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

