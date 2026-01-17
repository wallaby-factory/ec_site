'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateAdminRole(userId: string, newRole: string) {
    await prisma.adminUser.update({
        where: { id: userId },
        data: { role: newRole }
    })
    revalidatePath('/admin/staff')
}
