'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { calculatePrice, SHAPES, Shape } from '@/lib/price'

type OrderItemInput = {
    shape: string
    width: number
    height: number
    depth?: number
    diameter?: number
    colorFabric: string
    colorZipper: string
    colorFastener: string
    cordCount: number
    quantity: number
    price: number
}

export async function createOrder(items: OrderItemInput[]) {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
        return { success: false, error: 'ログインが必要です。' }
    }

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id }
    })

    if (!user) {
        return { success: false, error: 'ユーザー情報が見つかりません。' }
    }

    if (!items || items.length === 0) {
        return { success: false, error: 'カートが空です。' }
    }

    // Validate and recalculate prices on server side
    let calculatedTotal = 0
    const validatedItems = items.map(item => {
        // Validate shape
        const shape = item.shape as Shape
        if (!Object.values(SHAPES).includes(shape)) {
            throw new Error(`Invalid shape: ${item.shape}`)
        }

        const calculatedPrice = calculatePrice({
            shape: shape,
            width: item.width,
            height: item.height,
            depth: item.depth,
            diameter: item.diameter
        })

        calculatedTotal += calculatedPrice * item.quantity

        return {
            ...item,
            price: calculatedPrice // Use server-calculated price
        }
    })

    // Calculate shipping fee: free for orders ¥10,000+, otherwise ¥350
    const shippingFee = calculatedTotal >= 10000 ? 0 : 350
    const totalWithShipping = calculatedTotal + shippingFee

    try {
        // Create the order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: totalWithShipping,
                status: 'PENDING',
                // For MVP, we use the User's profile address as the shipping address snapshot
                shippingName: user.name || 'Unknown',
                shippingZip: user.zipCode || '',
                shippingAddress: `${user.prefecture || ''} ${user.city || ''} ${user.street || ''} ${user.building || ''}`.trim(),
                items: {
                    create: validatedItems.map(item => ({
                        shape: item.shape,
                        width: item.width,
                        height: item.height,
                        depth: item.depth,
                        diameter: item.diameter,
                        colorFabric: item.colorFabric,
                        colorZipper: item.colorZipper,
                        colorFastener: item.colorFastener,
                        cordCount: item.cordCount,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })

        revalidatePath('/account') // Update account page order history
        return { success: true, orderId: order.id }
    } catch (e) {
        console.error('Failed to create order:', e)
        return { success: false, error: 'データベースエラーが発生しました。' }
    }
}
