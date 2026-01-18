import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-700 pb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/">
                            <img
                                src="/brand_logo_text.png"
                                alt="WALLABY FACTORY"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            世界に一つだけの、<br />
                            あなただけのギアケースを。
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">INFORMATION</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    お問い合わせ
                                </Link>
                            </li>
                            <li>
                                <Link href="/limitations" className="hover:text-white transition-colors">
                                    特定商取引法に基づく表記
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    プライバシーポリシー
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info (Mock) */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">CONTACT</h3>
                        <div className="text-sm text-slate-400 space-y-1">
                            <p>WALLABY FACTORY</p>
                            <p>〒150-0000 東京都渋谷区神宮前1-1-1</p>
                            <p>info@wallaby-factory.example.com</p>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} WALLABY FACTORY. All Rights Reserved.
                </div>
            </div>
        </footer>
    )
}
