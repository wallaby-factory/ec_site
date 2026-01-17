import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // List all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            nickname: true
        }
    })

    console.log('All users in database:')
    users.forEach(user => {
        console.log(`- ID: ${user.id}`)
        console.log(`  Name: ${user.name}`)
        console.log(`  Nickname: ${user.nickname || '(none)'}`)
        console.log(`  Email: ${user.email}`)
        console.log('')
    })
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
