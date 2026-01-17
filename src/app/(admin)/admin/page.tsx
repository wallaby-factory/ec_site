import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
    const usersCount = await prisma.user.count()
    const ordersCount = await prisma.order.count()
    const publicOrdersCount = await prisma.publicOrder.count()

    // Fetch recent orders
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
    })

    // Fetch recent public order requests (gallery)
    const recentPublicOrders = await prisma.publicOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8 text-green-900 border-b pb-2">ダッシュボード</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                    <h2 className="text-gray-600 text-sm font-semibold uppercase">会員数</h2>
                    <p className="text-3xl font-bold text-gray-800">{usersCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <h2 className="text-gray-600 text-sm font-semibold uppercase">総注文数</h2>
                    <p className="text-3xl font-bold text-gray-800">{ordersCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h2 className="text-gray-600 text-sm font-semibold uppercase">公開アイテム数</h2>
                    <p className="text-3xl font-bold text-gray-800">{publicOrdersCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-green-800">最近の注文</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                        {recentOrders.length === 0 ? (
                            <p className="p-4 text-gray-500">注文はまだありません</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <li key={order.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">{order.id.slice(-6)}...</span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{order.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.user?.name || 'ゲスト'} - <span className="font-bold">¥{order.totalAmount.toLocaleString()}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 text-green-800">最近の公開申請</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                        {recentPublicOrders.length === 0 ? (
                            <p className="p-4 text-gray-500">公開申請はまだありません</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {recentPublicOrders.map((po) => (
                                    <li key={po.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-700">{po.itemName}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${po.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}>
                                                {po.isPublic ? '公開中' : '非公開'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">by {po.user.name}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
