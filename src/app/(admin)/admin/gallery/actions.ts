'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function togglePublicStatus(id: string, currentStatus: boolean) {
    await prisma.publicOrder.update({
        where: { id },
        data: { isPublic: !currentStatus }
    })
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
}
