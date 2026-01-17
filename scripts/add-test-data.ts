import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Find キャンプマスター user
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: 'camp@example.com' },
                { name: { contains: 'キャンプマスター' } }
            ]
        }
    })

    if (!user) {
        console.error('キャンプマスター user not found')
        return
    }

    console.log(`Found user: ${user.name} (${user.email})`)

    // Create test orders
    const order1 = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: 5000,
            status: 'COMPLETED',
            items: {
                create: [
                    {
                        shape: 'SQUARE',
                        width: 30,
                        height: 40,
                        quantity: 2,
                        price: 2500
                    }
                ]
            }
        },
        include: { items: true }
    })

    console.log(`Created order 1: ${order1.id} with ${order1.items.length} items`)

    const order2 = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: 3500,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            items: {
                create: [
                    {
                        shape: 'CYLINDER',
                        height: 25,
                        diameter: 10,
                        quantity: 1,
                        price: 3500
                    }
                ]
            }
        },
        include: { items: true }
    })

    console.log(`Created order 2: ${order2.id} with ${order2.items.length} items`)

    const order3 = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: 4200,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            items: {
                create: [
                    {
                        shape: 'CUBE',
                        width: 20,
                        height: 20,
                        depth: 20,
                        quantity: 1,
                        price: 4200
                    }
                ]
            }
        },
        include: { items: true }
    })

    console.log(`Created order 3: ${order3.id} with ${order3.items.length} items`)

    console.log('\n✅ Test data added successfully!')
    console.log(`Total orders created: 3`)
    console.log(`Total order items created: 3`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
