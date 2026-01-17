import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { LogoutButton } from "./LogoutButton";
import { CartIcon } from "./CartIcon";

export async function Header() {
    const user = await getCurrentUser()

    return (
        <header className="sticky top-0 z-30 bg-green-900/90 backdrop-blur-md text-white border-b border-green-800 relative overflow-hidden">
            {/* Subtle decorative pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <pattern id="header-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="2" fill="currentColor" />
                            <path d="M0 30 L15 15 L30 30 L15 45 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M30 0 L45 15 L60 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M30 60 L45 45 L60 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#header-pattern)" />
                </svg>
            </div>
            {/* Decorative stitch line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-20">
                <div className="h-full w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #facc15, #facc15 8px, transparent 8px, transparent 16px)' }} />
            </div>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative z-10">
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/wallaby_logo_white.png"
                        alt="Wallaby Logo"
                        className="h-14 w-14 object-contain"
                    />
                    <span
                        className="text-3xl tracking-tight text-yellow-400"
                        style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 700 }}
                    >
                        WALLABY FACTORY
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/customizer" className="text-sm font-bold hover:text-yellow-400 transition-colors">
                        オーダーメイド
                    </Link>
                    <Link href="/gallery" className="text-sm font-bold hover:text-yellow-400 transition-colors">
                        ギャラリー
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-green-700 pl-8">
                            <Link href="/account" className="text-sm font-bold hover:text-yellow-400 transition-colors">
                                ようこそ {user.nickname || user.name} さん
                            </Link>
                            <CartIcon />
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 border-l border-green-700 pl-8">
                            <Link href="/login" className="text-sm font-bold hover:text-yellow-400 transition-colors">
                                ログイン
                            </Link>
                            <Link href="/register" className="text-sm font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-md hover:shadow-lg">
                                会員登録
                            </Link>
                            <CartIcon />
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

