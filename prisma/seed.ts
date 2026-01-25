import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create Admin Users
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@wallaby.com' },
        update: {},
        create: {
            email: 'admin@wallaby.com',
            name: '管理者',
            role: 'ADMIN',
        },
    })
    console.log('✅ Admin user created:', admin.email)

    // Create Regular Users with nicknames
    const user1 = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            password: 'Test1234!',
            name: '山田太郎',
            nickname: 'キャンプ太郎',
            zipCode: '1500002',
            prefecture: '東京都',
            city: '渋谷区',
            street: '渋谷1-2-3',
            building: 'テストマンション101',
            address: '〒150-0002 東京都渋谷区渋谷1-2-3 テストマンション101',
            points: 100,
        },
    })
    console.log('✅ User 1 created:', user1.email)

    const user2 = await prisma.user.upsert({
        where: { email: 'camper@example.com' },
        update: {},
        create: {
            email: 'camper@example.com',
            password: 'Camper123!',
            name: '佐藤花子',
            nickname: 'ソロキャンプ好き',
            zipCode: '1600022',
            prefecture: '東京都',
            city: '新宿区',
            street: '新宿2-3-4',
            building: '',
            address: '〒160-0022 東京都新宿区新宿2-3-4',
            points: 250,
        },
    })
    console.log('✅ User 2 created:', user2.email)

    // Create Orders
    const order1 = await prisma.order.create({
        data: {
            userId: user1.id,
            status: 'PENDING',
            totalAmount: 3850,
            shippingName: user1.name!,
            shippingZip: user1.zipCode!,
            shippingAddress: user1.address!,
            items: {
                create: [
                    {
                        shape: 'SQUARE',
                        width: 30,
                        height: 40,
                        colorFabric: 'グリーン',
                        colorZipper: 'イエロー',
                        colorFastener: 'ブラック',
                        cordCount: 1,
                        quantity: 2,
                        price: 1925,
                    },
                ],
            },
        },
    })
    console.log('✅ Order 1 created for user:', user1.email)

    const order2 = await prisma.order.create({
        data: {
            userId: user2.id,
            status: 'DELIVERED',
            totalAmount: 5350,
            shippingName: user2.name!,
            shippingZip: user2.zipCode!,
            shippingAddress: user2.address!,
            items: {
                create: [
                    {
                        shape: 'CYLINDER',
                        height: 50,
                        diameter: 15,
                        width: 0,
                        colorFabric: 'オレンジ',
                        colorZipper: 'ブラック',
                        colorFastener: 'ブラック',
                        cordCount: 1,
                        quantity: 1,
                        price: 2675,
                    },
                    {
                        shape: 'CUBE',
                        width: 25,
                        height: 30,
                        depth: 20,
                        colorFabric: 'ピンク',
                        colorZipper: 'ホワイト',
                        colorFastener: 'ホワイト',
                        cordCount: 2,
                        quantity: 1,
                        price: 2675,
                    },
                ],
            },
        },
    })
    console.log('✅ Order 2 created for user:', user2.email)

    // Create Public Orders (Gallery)
    const publicOrder1 = await prisma.publicOrder.create({
        data: {
            userId: user1.id,
            itemName: 'Snow Peak ペグハンマー PRO.C',
            description: 'ソリッドステーク30用の収納袋です。ハンマーとペグを一緒に収納できます。',
            imageUrl: '/uploads/sample1.jpg',
            productImages: JSON.stringify(['/uploads/sample1.jpg']),
            tags: 'peg,hammer,snowpeak',
            shape: 'SQUARE',
            width: 30,
            height: 40,
            isPublic: true,
        },
    })
    console.log('✅ Public order 1 created')

    const publicOrder2 = await prisma.publicOrder.create({
        data: {
            userId: user2.id,
            itemName: 'SOTO レギュレーターストーブ ST-310',
            description: '定番シングルバーナー用の収納袋。コンパクトに収納できます。',
            imageUrl: '/uploads/sample2.jpg',
            productImages: JSON.stringify(['/uploads/sample2.jpg']),
            tags: 'burner,soto,cooking',
            shape: 'SQUARE',
            width: 20,
            height: 25,
            isPublic: true,
        },
    })
    console.log('✅ Public order 2 created')

    const publicOrder3 = await prisma.publicOrder.create({
        data: {
            userId: user1.id,
            itemName: 'ユニフレーム フィールドキャリングシンク',
            description: 'シンク用の収納袋。円筒型で取り出しやすいです。',
            imageUrl: '/uploads/sample3.jpg',
            productImages: JSON.stringify(['/uploads/sample3.jpg']),
            tags: 'sink,uniflame,water',
            shape: 'CYLINDER',
            height: 50,
            diameter: 15,
            width: 0,
            isPublic: true,
        },
    })
    console.log('✅ Public order 3 created')

    const publicOrder4 = await prisma.publicOrder.create({
        data: {
            userId: user2.id,
            itemName: 'Coleman クーラーボックス',
            description: 'クーラーボックス用の保護カバー。立方体型でぴったりフィット。',
            imageUrl: '/uploads/sample4.jpg',
            productImages: JSON.stringify(['/uploads/sample4.jpg']),
            tags: 'cooler,coleman,storage',
            shape: 'CUBE',
            width: 40,
            height: 35,
            depth: 30,
            isPublic: true,
        },
    })
    console.log('✅ Public order 4 created')

    console.log('✅ Public order 4 created')

    // Create Materials
    const fabrics = ['グリーン', 'イエロー', 'オレンジ', 'ピンク', 'ホワイト', 'ブラック']
    const cords = ['グリーン', 'イエロー', 'オレンジ', 'ピンク', 'ホワイト', 'ブラック']
    const fasteners = ['グリーン', 'イエロー', 'オレンジ', 'ピンク', 'ホワイト', 'ブラック']
    const others = ['梱包用ビニール', '配送用ラベル', 'サンキューカード']

    // Seed Fabrics
    for (const color of fabrics) {
        await prisma.material.upsert({
            where: { category_name: { category: 'FABRIC', name: color } },
            update: {},
            create: { category: 'FABRIC', name: color, status: 'PLENTIFUL' }
        })
        // Seed matching thread
        await prisma.material.upsert({
            where: { category_name: { category: 'THREAD', name: color } },
            update: {},
            create: { category: 'THREAD', name: color, status: 'PLENTIFUL' }
        })
    }
    // Seed Cords
    for (const color of cords) {
        await prisma.material.upsert({
            where: { category_name: { category: 'CORD', name: color } },
            update: {},
            create: { category: 'CORD', name: color, status: 'PLENTIFUL' }
        })
    }
    // Seed Fasteners
    for (const color of fasteners) {
        await prisma.material.upsert({
            where: { category_name: { category: 'FASTENER', name: color } },
            update: {},
            create: { category: 'FASTENER', name: color, status: 'PLENTIFUL' }
        })
    }
    // Seed Others
    for (const item of others) {
        await prisma.material.upsert({
            where: { category_name: { category: 'OTHER', name: item } },
            update: {},
            create: { category: 'OTHER', name: item, status: 'PLENTIFUL' }
        })
    }
    console.log('✅ Materials seeded')

    console.log('✅ Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
