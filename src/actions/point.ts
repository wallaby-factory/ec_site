'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'

export type PointState = {
    currentPoints: number
    isExpired: boolean
    lastPurchaseAt: Date | null
    expiringAt: Date | null
}

export async function getUserPointState(): Promise<{ success: boolean, state?: PointState, error?: string }> {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
        return { success: false, error: 'Not authenticated' }
    }

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { points: true, lastPurchaseAt: true }
    })

    if (!user) {
        return { success: false, error: 'User not found' }
    }

    const now = new Date()
    const lastPurchase = user.lastPurchaseAt ? new Date(user.lastPurchaseAt) : null
    let points = user.points
    let isExpired = false
    let expiringAt: Date | null = null

    // Check Expiration (3 years)
    if (lastPurchase) {
        // Calculate expiration date: last purchase + 3 years
        expiringAt = new Date(lastPurchase)
        expiringAt.setFullYear(expiringAt.getFullYear() + 3)

        if (now > expiringAt) {
            // Expired! Reset points if not already 0
            if (points > 0) {
                // We should assume a scheduled job or trigger does this, 
                // but we can do lazy expiration here or just display 0.
                // It's safer to *display* 0 and let a transaction clear it later,
                // or clear it now implicitly? 
                // Let's return 0 as strict logic.
                // Ideally, write to DB to clear it, but lazy write might be slow.
                // For UI, we show 0.
                isExpired = true
                points = 0
            }
        }
    }

    return {
        success: true,
        state: {
            currentPoints: points,
            isExpired,
            lastPurchaseAt: lastPurchase,
            expiringAt
        }
    }
}
