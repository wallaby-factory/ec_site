'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrderItemCard } from '@/components/OrderItemCard'
import { GalleryPostsList } from '@/components/GalleryPostsList'
import { updateUserProfile } from '@/actions/user'

interface User {
    id: string
    name: string | null
    nickname: string | null
    email: string
    zipCode: string | null
    prefecture: string | null
    city: string | null
    street: string | null
    building: string | null
    address: string | null
    points: number
}

interface PublicOrder {
    id: string
    itemName: string
    imageUrl: string
    createdAt: Date
    isPublic: boolean
}

interface Order {
    id: string
    createdAt: Date
    status: string
    items: Array<{
        id: string
        shape: string
        width: number
        height: number
        depth: number | null
        diameter: number | null
        quantity: number
        price: number
        cordCount: number
    }>
}

export function AccountClient({
    user,
    publicOrders,
    orders,
    publishedOrdersMap,
    showSuccess
}: {
    user: User
    publicOrders: PublicOrder[]
    orders: Order[]
    publishedOrdersMap: Map<string, PublicOrder>
    showSuccess: boolean
}) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [addressState, setAddressState] = useState({
        prefecture: user.prefecture || '',
        city: user.city || '',
        street: user.street || ''
    })

    const handleZipSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const zip = e.target.value.replace('-', '')
        if (zip.length === 7) {
            try {
                const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`)
                const data = await res.json()
                if (data.results) {
                    const result = data.results[0]
                    setAddressState({
                        prefecture: result.address1,
                        city: result.address2,
                        street: result.address3
                    })
                }
            } catch (error) {
                console.error('Zip search failed', error)
            }
        }
    }

    const handleUpdateProfile = async (formData: FormData) => {
        setIsLoading(true)
        const result = await updateUserProfile(formData)

        if (result.success) {
            setIsEditing(false)
            router.refresh()
        } else {
            alert(result.error || 'プロフィールの更新に失敗しました。')
        }
        setIsLoading(false)
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {showSuccess && (
                <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">注文が完了しました！</strong>
                    <span className="block sm:inline"> ご注文ありがとうございます。注文確認メールをお送りしました。</span>
                </div>
            )}

            <h1 className="text-3xl font-black text-green-900 mb-8 border-b-4 border-yellow-400 inline-block">
                マイページ
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-slate-700">会員情報</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    編集
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form action={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">ニックネーム</label>
                                    <input
                                        name="nickname"
                                        type="text"
                                        defaultValue={user.nickname || ''}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        placeholder="例: キャンプ好き"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">※ 他のユーザーと重複しないニックネームを設定してください</p>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">氏名 <span className="text-red-500">*</span></label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={user.name || ''}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">メールアドレス</label>
                                    <div className="text-sm text-slate-400 bg-slate-50 px-3 py-2 rounded">{user.email}</div>
                                    <p className="text-[10px] text-slate-400 mt-1">※ メールアドレスは変更できません</p>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="text-xs font-bold text-slate-500 mb-3">住所</h3>

                                    <div className="mb-3">
                                        <label className="block text-xs text-slate-500 mb-1">郵便番号 (ハイフンなし7桁) <span className="text-red-500">*</span></label>
                                        <input
                                            name="zipCode"
                                            type="text"
                                            defaultValue={user.zipCode || ''}
                                            className="w-32 border rounded px-3 py-2 text-sm"
                                            placeholder="1234567"
                                            maxLength={7}
                                            onChange={handleZipSearch}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">都道府県 <span className="text-red-500">*</span></label>
                                            <input
                                                name="prefecture"
                                                type="text"
                                                className="w-full border rounded px-3 py-2 text-sm bg-slate-50"
                                                defaultValue={addressState.prefecture}
                                                key={addressState.prefecture}
                                                readOnly
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">市区町村 <span className="text-red-500">*</span></label>
                                            <input
                                                name="city"
                                                type="text"
                                                className="w-full border rounded px-3 py-2 text-sm bg-slate-50"
                                                defaultValue={addressState.city}
                                                key={addressState.city}
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-xs text-slate-500 mb-1">番地 <span className="text-red-500">*</span></label>
                                        <input
                                            name="street"
                                            type="text"
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            defaultValue={addressState.street}
                                            key={addressState.street}
                                            placeholder="1-2-3"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">建物名 (任意)</label>
                                        <input
                                            name="building"
                                            type="text"
                                            defaultValue={user.building || ''}
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            placeholder="〇〇マンション 101"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${isLoading
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        {isLoading ? '保存中...' : '保存'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setAddressState({
                                                prefecture: user.prefecture || '',
                                                city: user.city || '',
                                                street: user.street || ''
                                            })
                                        }}
                                        disabled={isLoading}
                                        className="flex-1 bg-slate-200 text-slate-700 py-2 rounded text-sm font-bold hover:bg-slate-300 transition-colors disabled:opacity-50"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <div>
                                    <label className="block text-xs text-slate-400">ニックネーム</label>
                                    <div className="font-bold text-slate-800">{user.nickname || '(未登録)'}</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400">お名前</label>
                                    <div className="font-bold text-slate-800">{user.name}</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400">メールアドレス</label>
                                    <div className="font-bold text-slate-800 break-all">{user.email}</div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400">住所</label>
                                    <div className="text-slate-600 whitespace-pre-wrap">
                                        {user.zipCode ? (
                                            <>
                                                〒{user.zipCode}<br />
                                                {user.prefecture} {user.city} {user.street}<br />
                                                {user.building}
                                            </>
                                        ) : (
                                            user.address || '(未登録)'
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="font-bold text-green-700">保有ポイント</span>
                                    <span className="text-2xl font-black text-yellow-500">{user.points} pt</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section */}
                <div className="md:col-span-2 space-y-8">
                    {/* Public Orders (Gallery) */}
                    <GalleryPostsList publicOrders={publicOrders} />

                    {/* Orders (History) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                            <h2 className="font-bold text-slate-700">注文履歴 ({orders.reduce((sum, o) => sum + o.items.length, 0)})</h2>
                            <p className="text-xs text-slate-500 mt-1">未公開のアイテムはギャラリーに公開できます</p>
                        </div>
                        {orders.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">注文履歴はありません</div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-slate-400">注文ID: {order.id.slice(-8)}</span>
                                            <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">{order.status}</span>
                                        </div>
                                        <div className="grid gap-3">
                                            {order.items.map(item => {
                                                const key = `${item.shape}-${item.width}-${item.height}-${item.depth}-${item.diameter}`
                                                const publishedOrder = publishedOrdersMap.get(key)

                                                return (
                                                    <OrderItemCard
                                                        key={item.id}
                                                        orderItem={item}
                                                        orderId={order.id}
                                                        orderDate={order.createdAt}
                                                        publishedOrder={publishedOrder}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
