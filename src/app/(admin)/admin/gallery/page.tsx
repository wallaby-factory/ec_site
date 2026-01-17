import { prisma } from "@/lib/prisma"
import { StatusToggle } from "./components"

export const revalidate = 0;

export default async function AdminGalleryPage() {
    const orders = await prisma.publicOrder.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-green-900">ギャラリー管理</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">アイテム名</th>
                            <th className="p-4">詳細</th>
                            <th className="p-4">投稿者</th>
                            <th className="p-4 text-center">公開状態</th>
                            <th className="p-4 text-right">投稿日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{order.itemName}</div>
                                    <div className="text-xs text-slate-400 hidden sm:block">ID: {order.id.slice(-6)}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-600 line-clamp-1">{order.description}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {order.tags?.split(',').map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {order.shape} - W:{order.width} H:{order.height}
                                        {/* Use existing fields for now, avoid TS errors if types not generated yet */}
                                        {/* {(order as any).depth ? ` D:${(order as any).depth}` : ''} */}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">{order.user.name}</div>
                                    <div className="text-xs text-slate-400">{order.user.email}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <StatusToggle id={order.id} isPublic={order.isPublic} />
                                </td>
                                <td className="p-4 text-right text-sm text-slate-500">
                                    {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        公開オーダーはまだありません。
                    </div>
                )}
            </div>
        </div>
    )
}
