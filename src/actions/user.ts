'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(formData: FormData) {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
        return { success: false, error: 'ログインが必要です。' }
    }

    const nickname = formData.get('nickname') as string
    const name = formData.get('name') as string
    const zipCode = formData.get('zipCode') as string
    const prefecture = formData.get('prefecture') as string
    const city = formData.get('city') as string
    const street = formData.get('street') as string
    const building = formData.get('building') as string

    // Validation
    if (!name || !zipCode || !prefecture || !city || !street) {
        return { success: false, error: '必須項目を入力してください。' }
    }

    // Check for duplicate nickname (excluding current user, only if nickname is provided)
    if (nickname) {
        const existingNickname = await prisma.user.findUnique({
            where: { nickname }
        })
        if (existingNickname && existingNickname.id !== sessionUser.id) {
            return { success: false, error: '申し訳ありません。そのニックネームは登録できません。' }
        }
    }

    // Combine address for fallback/legacy support
    const fullAddress = `〒${zipCode} ${prefecture}${city}${street} ${building || ''}`

    try {
        await prisma.user.update({
            where: { id: sessionUser.id },
            data: {
                nickname,
                name,
                zipCode,
                prefecture,
                city,
                street,
                building,
                address: fullAddress
            }
        })

        revalidatePath('/account')
        return { success: true }
    } catch (e) {
        console.error('Failed to update user profile:', e)
        return { success: false, error: 'プロフィールの更新に失敗しました。' }
    }
}
