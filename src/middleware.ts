import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(req: NextRequest) {
    // 環境変数が設定されていない場合はBasic認証をスキップ (ローカル開発などで便利)
    const basicAuthUser = process.env.BASIC_AUTH_USER;
    const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

    if (!basicAuthUser || !basicAuthPassword) {
        return NextResponse.next();
    }

    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        if (user === basicAuthUser && pwd === basicAuthPassword) {
            return NextResponse.next()
        }
    }

    return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    })
}
