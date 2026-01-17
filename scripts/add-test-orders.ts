import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Get the first user (or any user)
    const user = await prisma.user.findFirst()

    if (!user) {
        console.error('No users found in database')
        return
    }

    console.log(`Using user: ${user.name} (${user.email})`)

    // Create test orders
    try {
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

        console.log(`✅ Created order 1: ${order1.id}`)

        const order2 = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: 3500,
                status: 'COMPLETED',
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

        console.log(`✅ Created order 2: ${order2.id}`)

        const order3 = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: 4200,
                status: 'COMPLETED',
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

        console.log(`✅ Created order 3: ${order3.id}`)

        console.log('\n🎉 Test data added successfully!')
        console.log(`Total orders created: 3`)
        console.log(`User: ${user.name}`)
    } catch (error) {
        console.error('Error creating orders:', error)
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
