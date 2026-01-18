'use client'

import React from 'react'

interface OrderGuideModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function OrderGuideModal({ isOpen, onClose }: OrderGuideModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4 shrink-0 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        オーダーメイドについて
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto flex-1">
                    {/* Method */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            オーダーメイド方法
                        </h3>
                        <div className="text-sm text-slate-600 leading-relaxed bg-green-50/50 p-4 rounded-lg">
                            <p>ワラビーファクトリーでは、<strong>平型・円柱型・箱型</strong>のメッシュ製収納袋を、1点からオーダーメイドすることができます。</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-1">
                                <li>大きさは <strong>1cm単位</strong> で指定可能です。</li>
                                <li>生地やコードの色も選択可能です。</li>
                                <li>縫い糸の色は、生地の色に合わせてこちらで選定いたします。</li>
                            </ul>
                        </div>
                    </section>

                    {/* Price */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            価格について
                        </h3>
                        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 bg-white border border-slate-200 p-3 rounded-lg text-center">
                                    <div className="text-xs text-slate-400 font-bold mb-1">基本価格</div>
                                    <div className="font-bold text-slate-700">形状ごとの基本料</div>
                                </div>
                                <div className="flex items-center text-slate-300 justify-center">+</div>
                                <div className="flex-1 bg-white border border-slate-200 p-3 rounded-lg text-center">
                                    <div className="text-xs text-slate-400 font-bold mb-1">面積価格</div>
                                    <div className="font-bold text-green-600">1.5円 / cm²</div>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                                ※ 合計金額は <strong>100円単位で切り捨て</strong> となります。<br />
                                ※ 最低価格は <strong>1,100円 (税込)</strong> です。
                            </p>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            決済方法
                        </h3>
                        <p className="text-sm text-slate-600">
                            クレジットカード決済、QRコード決済のみとさせていただきます。
                        </p>
                    </section>

                    {/* Dimensions */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            寸法について
                        </h3>
                        <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    ご注意ください
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-yellow-900/80">
                                    <li>メッシュ生地を使っての手作業での縫製作業の為、<strong>1cm程度の寸法のずれ</strong>が発生する場合があります。</li>
                                    <li>オーダーメイド画面で入力する寸法は、<strong>「コードが通る部分 ＋ スリット部分」を除いたサイズ</strong>となります。</li>
                                </ul>
                            </div>
                            <p>
                                コード通し部分（約2cm）とスリット部分（約2cm）は入力サイズに含まれません。<br />
                                収納したいもののサイズと形状を考慮し、<strong>余裕を持ったサイズ</strong>でご注文いただくことをお勧めします。
                            </p>
                        </div>
                    </section>

                    {/* Delivery */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            納期について
                        </h3>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>注文確認より <strong>一週間程度</strong> での発送を目指します。</li>
                            <li>年末年始や夏季休暇、長期休暇時は、発送が遅れる場合がございます。</li>
                            <li>一時的な資材の在庫切れによって、製造と発送が遅れる場合がございます。</li>
                        </ul>
                    </section>

                    {/* Return Policy */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-green-200">
                            返品について
                        </h3>
                        <div className="text-sm text-slate-600 leading-relaxed">
                            <p>オーダーメイド等の特性上、以下の理由による返品はお受けできません。</p>
                            <ul className="list-disc list-inside mt-2 mb-3 bg-slate-50 p-3 rounded text-slate-500">
                                <li>1cm程度の寸法誤差</li>
                                <li>お客様都合（サイズ指定ミス、イメージ違い等）</li>
                            </ul>
                            <p>
                                破損、注文内容と著しく異なる場合等については、<strong>返品交換</strong> もしくは <strong>製品代金のみの返金</strong> とさせていただきます。
                            </p>
                        </div>
                    </section>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    )
}
