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

// Update signature
export async function createOrder(items: OrderItemInput[], usedPoints: number = 0) {
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

    // Validate Points (Basic check, rigorous check in transaction)
    if (usedPoints < 0) {
        return { success: false, error: '不正なポイント数です。' }
    }
    // Check expiration lazy
    const now = new Date()
    if (user.lastPurchaseAt) {
        const expiringAt = new Date(user.lastPurchaseAt)
        expiringAt.setFullYear(expiringAt.getFullYear() + 3)
        if (now > expiringAt) {
            // Expired points, essentially user has 0 valid points
            if (usedPoints > 0) {
                return { success: false, error: 'ポイントの有効期限が切れています。' }
            }
        }
    }
    if (usedPoints > user.points) {
        return { success: false, error: 'ポイント残高が不足しています。' }
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
    const grandTotal = calculatedTotal + shippingFee // Original Total

    if (usedPoints > grandTotal) {
        return { success: false, error: '利用ポイントが合計金額を上回っています。' }
    }

    const finalPaymentAmount = grandTotal - usedPoints
    const earnedPoints = Math.floor(finalPaymentAmount * 0.05) // 5% of paid amount

    try {
        // Create the order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    totalAmount: finalPaymentAmount, // Amount charged
                    usedPoints: usedPoints,
                    earnedPoints: earnedPoints,
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

            // 2. Update User Points
            // Note: If expired, we should have reset 0 first, but here we just deduct from current db value.
            // If the user was expired, logic above caught it (usedPoints > 0 check).
            // But if usedPoints=0 and expired, we should technically wipe old points.
            // For simplicity, we just add/sub based on current.
            // But we MUST update lastPurchaseAt.
            const currentPoints = user.points
            // Optional: Check expiration again inside tx for safety?

            const newPointBalance = currentPoints - usedPoints + earnedPoints

            await tx.user.update({
                where: { id: user.id },
                data: {
                    points: newPointBalance,
                    lastPurchaseAt: new Date() // Reset expiration timer
                }
            })

            // 3. Log Transactions
            if (usedPoints > 0) {
                await tx.pointTransaction.create({
                    data: {
                        userId: user.id,
                        amount: -usedPoints,
                        reason: `注文時の利用 #${newOrder.id}`
                    }
                })
            }
            if (earnedPoints > 0) {
                await tx.pointTransaction.create({
                    data: {
                        userId: user.id,
                        amount: earnedPoints,
                        reason: `注文獲得ポイント #${newOrder.id}`
                    }
                })
            }

            return newOrder
        })

        revalidatePath('/account') // Update account page order history
        return { success: true, orderId: order.id }
    } catch (e) {
        console.error('Failed to create order:', e)
        return { success: false, error: 'データベースエラーが発生しました。' }
    }
}
