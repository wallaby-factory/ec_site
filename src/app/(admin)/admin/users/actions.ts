'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// User actions for admin panel
// Note: User model does not have a role field - use AdminUser for roles

export async function getUserDetails(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: { orders: true }
    })
}
