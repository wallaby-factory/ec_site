'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { unpublishOrder, republishOrder, deletePublicOrder } from '@/actions/gallery'

interface PublicOrder {
    id: string
    itemName: string
    imageUrl: string
    createdAt: Date
    isPublic: boolean
}

export function GalleryPostsList({ publicOrders }: { publicOrders: PublicOrder[] }) {
    const router = useRouter()
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

    async function handleUnpublish(id: string) {
        setProcessingId(id)
        const result = await unpublishOrder(id)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || '一時非公開に失敗しました')
        }
        setProcessingId(null)
    }

    async function handleRepublish(id: string) {
        setProcessingId(id)
        const result = await republishOrder(id)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || '公開に失敗しました')
        }
        setProcessingId(null)
    }

    async function handleDelete(id: string) {
        setProcessingId(id)
        const result = await deletePublicOrder(id)
        if (result.success) {
            setShowDeleteConfirm(null)
            router.refresh()
        } else {
            alert(result.error || '削除に失敗しました')
        }
        setProcessingId(null)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                <h2 className="font-bold text-green-800">ギャラリー投稿 ({publicOrders.length})</h2>
                <Link href="/gallery" className="text-xs text-green-600 hover:underline">ギャラリーを見る</Link>
            </div>
            {publicOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">投稿はありません</div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {publicOrders.map(po => (
                        <div key={po.id} className="p-4">
                            <div className="flex gap-4">
                                <Link href={`/gallery/${po.id}`} className="shrink-0">
                                    <div className="w-16 h-16 bg-slate-100 rounded bg-cover bg-center hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${po.imageUrl})` }}></div>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/gallery/${po.id}`} className="block">
                                        <div className="font-bold text-slate-700 hover:text-green-600 transition-colors">{po.itemName}</div>
                                    </Link>
                                    <div className="text-xs text-slate-500 mt-1">{new Date(po.createdAt).toLocaleDateString('ja-JP')}</div>
                                    <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${po.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {po.isPublic ? '公開中' : '一時非公開'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2 flex-wrap">
                                {po.isPublic ? (
                                    <button
                                        onClick={() => handleUnpublish(po.id)}
                                        disabled={processingId === po.id}
                                        className="text-xs px-3 py-1 text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        一時非公開にする
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleRepublish(po.id)}
                                        disabled={processingId === po.id}
                                        className="text-xs px-3 py-1 text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                                    >
                                        公開する
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDeleteConfirm(po.id)}
                                    disabled={processingId === po.id}
                                    className="text-xs px-3 py-1 text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    ギャラリーから削除する
                                </button>
                            </div>

                            {/* Delete Confirmation Dialog */}
                            {showDeleteConfirm === po.id && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">削除の確認</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            「{po.itemName}」をギャラリーから完全に削除しますか？<br />
                                            <span className="text-red-600 font-bold">この操作は取り消せません。</span>登録した画像やアイテム名などのデータは削除されます。
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDelete(po.id)}
                                                disabled={processingId === po.id}
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === po.id ? '削除中...' : '削除する'}
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                disabled={processingId === po.id}
                                                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-300 transition-colors disabled:opacity-50"
                                            >
                                                キャンセル
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
