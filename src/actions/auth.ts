'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

const SESSION_COOKIE = 'wallaby_session'

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get(SESSION_COOKIE)?.value

    if (!userId) return null

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, nickname: true }
        })
        return user
    } catch (e) {
        return null
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
    redirect('/')
}

export async function register(formData: FormData) {
    const name = formData.get('name') as string
    const nickname = formData.get('nickname') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Address fields
    const zipCode = formData.get('zipCode') as string
    const prefecture = formData.get('prefecture') as string
    const city = formData.get('city') as string
    const street = formData.get('street') as string
    const building = formData.get('building') as string

    if (!email || !password || !name || !zipCode) {
        return { error: '必須項目を入力してください。' }
    }

    // Check for duplicate email
    const existingEmail = await prisma.user.findUnique({
        where: { email }
    })
    if (existingEmail) {
        return { error: '申し訳ありません。そのメールアドレスは登録できません。' }
    }

    // Check for duplicate nickname (only if nickname is provided)
    if (nickname) {
        const existingNickname = await prisma.user.findUnique({
            where: { nickname }
        })
        if (existingNickname) {
            return { error: '申し訳ありません。そのニックネームは登録できません。' }
        }
    }

    // Combine address for fallback/legacy support
    const fullAddress = `〒${zipCode} ${prefecture}${city}${street} ${building || ''}`

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
                nickname,
                zipCode,
                prefecture,
                city,
                street,
                building,
                address: fullAddress
            }
        })

        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE, user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    } catch (e) {
        console.error(e)
        return { error: 'ユーザー登録に失敗しました。' }
    }
    redirect('/account')
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return { error: 'Required fields missing' }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || user.password !== password) {
        return { error: 'メールアドレスまたはパスワードが間違っています' }
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    redirect('/account')
}
