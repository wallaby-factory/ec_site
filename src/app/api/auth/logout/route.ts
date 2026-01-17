import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'session'

export async function POST() {
    try {
        const cookieStore = await cookies()

        // Delete the session cookie
        cookieStore.set(SESSION_COOKIE, '', {
            expires: new Date(0),
            path: '/'
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 })
    }
}
