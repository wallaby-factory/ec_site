import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Update all user passwords to "Abc4321!"
    const newPassword = 'Abc4321!'

    const result = await prisma.user.updateMany({
        data: {
            password: newPassword
        }
    })

    console.log(`✅ Updated ${result.count} user passwords to: ${newPassword}`)

    // List all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            nickname: true
        }
    })

    console.log('\nAll users:')
    users.forEach(user => {
        console.log(`- ${user.email} (${user.name})`)
    })

    console.log(`\n🔑 Login with any email and password: ${newPassword}`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
