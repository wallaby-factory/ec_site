'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateMaterialStatus(id: string, status: string) {
    await prisma.material.update({
        where: { id },
        data: { status }
    })
    revalidatePath('/admin/materials')
    revalidatePath('/customizer') // Update customizer as well
}
