import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-grass-pattern py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-4 bg-black/20 backdrop-blur-sm inline-block px-8 py-2 rounded-full border border-white/20">
                        プライバシーポリシー
                    </h1>
                </header>

                <div className="card-glass p-8 md:p-12">
                    <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">1. 個人情報の定義</h2>
                            <p>
                                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">2. 個人情報の収集方法</h2>
                            <p>
                                当店は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、クレジットカード番号などの個人情報をお尋ねすることがあります。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">3. 個人情報を収集・利用する目的</h2>
                            <p>当店が個人情報を収集・利用する目的は、以下のとおりです。</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                                <li>サービスの提供・運営のため</li>
                                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                                <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
                                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                                <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定とし、ご利用をお断りするため</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">4. 利用目的の変更</h2>
                            <p>
                                当店は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">5. 個人情報の第三者提供</h2>
                            <p>
                                当店は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">6. 個人情報の開示</h2>
                            <p>
                                当店は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-green-800 mb-3">7. お問い合わせ窓口</h2>
                            <p>
                                本ポリシーに関するお問い合わせは、お問い合わせフォームよりお願いいたします。
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
