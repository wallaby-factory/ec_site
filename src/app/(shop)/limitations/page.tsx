import React from 'react'

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-grass-pattern py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-4 bg-black/20 backdrop-blur-sm inline-block px-8 py-2 rounded-full border border-white/20">
                        特定商取引法に基づく表記
                    </h1>
                </header>

                <div className="card-glass p-8 md:p-12">
                    <div className="space-y-8 text-sm md:text-base">
                        {/* Seller */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">販売業者</div>
                            <div className="md:col-span-2 text-slate-800">WALLABY FACTORY</div>
                        </div>

                        {/* Operational Manager */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">運営統括責任者名</div>
                            <div className="md:col-span-2 text-slate-800">運営 太郎</div>
                        </div>

                        {/* Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">郵便番号</div>
                            <div className="md:col-span-2 text-slate-800">150-0000</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">住所</div>
                            <div className="md:col-span-2 text-slate-800">東京都渋谷区神宮前1-1-1</div>
                        </div>

                        {/* Additional Fees */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">商品代金以外の<br className="hidden md:block" />必要料金</div>
                            <div className="md:col-span-2 text-slate-800 space-y-2">
                                <p>・消費税（当サイトの表示価格はすべて税込です）</p>
                                <p>・配送料（全国一律 800円 / 10,000円以上のお買い上げで無料）</p>
                            </div>
                        </div>

                        {/* Delivery Time */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">引渡し時期</div>
                            <div className="md:col-span-2 text-slate-800">
                                ご注文確認後、通常7日以内に発送いたします。<br />
                                ※ オーダーメイド品のため、混雑状況によりお時間をいただく場合がございます。
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100/50 pb-8">
                            <div className="font-bold text-slate-500">お支払方法</div>
                            <div className="md:col-span-2 text-slate-800">
                                ・クレジットカード決済<br />
                                ・QRコード決済
                            </div>
                        </div>

                        {/* Returns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                            <div className="font-bold text-slate-500">返品期限・条件</div>
                            <div className="md:col-span-2 text-slate-800 space-y-2">
                                <p>オーダーメイド等の特性上、お客様都合による返品・交換はお受けできません。</p>
                                <p>ただし、商品に不備があった場合や誤配送の場合は、商品到着後7日以内にご連絡ください。送料弊社負担にて返品・交換対応いたします。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
