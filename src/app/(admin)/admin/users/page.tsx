import { prisma } from "@/lib/prisma"

export const revalidate = 0;

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true, publicOrders: true } } }
    })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-green-900">顧客管理</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">氏名 / メールアドレス</th>
                            <th className="p-4">住所</th>
                            <th className="p-4 text-center">注文数</th>
                            <th className="p-4 text-center">公開数</th>
                            <th className="p-4 text-right">登録日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{user.name || '名前未設定'}</div>
                                    <div className="text-xs text-slate-400">{user.email}</div>
                                </td>
                                <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                                    {user.address || '-'}
                                </td>
                                <td className="p-4 text-center text-sm font-bold text-slate-600">
                                    {user._count.orders}
                                </td>
                                <td className="p-4 text-center text-sm font-bold text-slate-600">
                                    {user._count.publicOrders}
                                </td>
                                <td className="p-4 text-right text-sm text-slate-500">
                                    {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
