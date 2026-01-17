
import { PrismaClient } from '../src/generated/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking AdminUser...')
    try {
        const admins = await prisma.adminUser.findMany()
        console.log('Success! Found admins:', admins)
    } catch (e) {
        console.error('Error fetching admins:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
