'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function publishOrderToGallery(
    orderItemId: string,
    itemName: string,
    description: string,
    tags: string,
    imagePaths: string[]
) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: '認証が必要です' }
    }

    if (imagePaths.length === 0) {
        return { success: false, error: '少なくとも1枚の画像が必要です' }
    }

    if (imagePaths.length > 3) {
        return { success: false, error: '画像は最大3枚までです' }
    }

    try {
        // Get order item details
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: { order: true }
        })

        if (!orderItem || orderItem.order.userId !== user.id) {
            return { success: false, error: '注文が見つかりません' }
        }

        // Create public order
        const publicOrder = await prisma.publicOrder.create({
            data: {
                userId: user.id,
                itemName,
                description,
                tags,
                productImages: JSON.stringify(imagePaths),
                imageUrl: imagePaths[0], // Use first image as main image
                shape: orderItem.shape,
                width: orderItem.width,
                height: orderItem.height,
                depth: orderItem.depth,
                diameter: orderItem.diameter,
                isPublic: true
            }
        })

        revalidatePath('/account')
        revalidatePath('/gallery')

        return { success: true, publicOrderId: publicOrder.id }
    } catch (error) {
        console.error('Publish error:', error)
        return { success: false, error: '公開に失敗しました' }
    }
}

export async function unpublishOrder(publicOrderId: string) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: '認証が必要です' }
    }

    try {
        const publicOrder = await prisma.publicOrder.findUnique({
            where: { id: publicOrderId }
        })

        if (!publicOrder || publicOrder.userId !== user.id) {
            return { success: false, error: '投稿が見つかりません' }
        }

        await prisma.publicOrder.update({
            where: { id: publicOrderId },
            data: { isPublic: false }
        })

        revalidatePath('/account')
        revalidatePath('/gallery')

        return { success: true }
    } catch (error) {
        console.error('Unpublish error:', error)
        return { success: false, error: '非公開化に失敗しました' }
    }
}

export async function republishOrder(publicOrderId: string) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: '認証が必要です' }
    }

    try {
        const publicOrder = await prisma.publicOrder.findUnique({
            where: { id: publicOrderId }
        })

        if (!publicOrder || publicOrder.userId !== user.id) {
            return { success: false, error: '投稿が見つかりません' }
        }

        await prisma.publicOrder.update({
            where: { id: publicOrderId },
            data: { isPublic: true }
        })

        revalidatePath('/account')
        revalidatePath('/gallery')

        return { success: true }
    } catch (error) {
        console.error('Republish error:', error)
        return { success: false, error: '再公開に失敗しました' }
    }
}

export async function deletePublicOrder(publicOrderId: string) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: '認証が必要です' }
    }

    try {
        const publicOrder = await prisma.publicOrder.findUnique({
            where: { id: publicOrderId }
        })

        if (!publicOrder || publicOrder.userId !== user.id) {
            return { success: false, error: '投稿が見つかりません' }
        }

        // Delete the public order (images in public/uploads will remain but are orphaned)
        await prisma.publicOrder.delete({
            where: { id: publicOrderId }
        })

        revalidatePath('/account')
        revalidatePath('/gallery')

        return { success: true }
    } catch (error) {
        console.error('Delete error:', error)
        return { success: false, error: '削除に失敗しました' }
    }
}
