import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountClient } from "@/components/AccountClient";

export default async function AccountPage(props: { searchParams?: Promise<{ success?: string }> }) {
    const searchParams = await props.searchParams
    const sessionUser = await getCurrentUser()
    if (!sessionUser) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: { items: true }
            },
            publicOrders: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!user) redirect('/login')

    // Create a map of published orders by order item dimensions
    const publishedOrdersMap = new Map()
    user.publicOrders.forEach(po => {
        const key = `${po.shape}-${po.width}-${po.height}-${po.depth}-${po.diameter}`
        publishedOrdersMap.set(key, po)
    })

    return (
        <AccountClient
            user={user}
            publicOrders={user.publicOrders}
            orders={user.orders}
            publishedOrdersMap={publishedOrdersMap}
            showSuccess={!!searchParams?.success}
        />
    )
}
