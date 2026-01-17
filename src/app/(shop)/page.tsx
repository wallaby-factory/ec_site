import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BagModel from "@/components/BagModel";

export const revalidate = 0; // Ensure fresh data on every request

export default async function Home() {
  const recentOrders = await prisma.publicOrder.findMany({
    take: 3,
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-grass-pattern flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-6 tracking-tight">
            THE JUST-FIT<br />GEAR CASE
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md mb-10 max-w-2xl mx-auto">
            1cm単位でサイズオーダー。あなたの愛用ギアに、<br className="hidden md:block" />
            シンデレラフィットする収納袋を。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customizer"
              className="bg-yellow-400 text-yellow-950 text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-all active:scale-95"
            >
              今すぐオーダーする
            </Link>
            <Link
              href="/gallery"
              className="bg-black/40 backdrop-blur-md text-white border-2 border-white/50 text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-black/50 hover:border-white transition-all"
            >
              ギャラリーを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50/50 to-orange-50/30 relative overflow-hidden">
        {/* Decorative stitch border */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d97706, #d97706 6px, transparent 6px, transparent 12px)' }} />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-5xl">🤔</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              ギア収納袋のこんな悩み、ありませんか？
            </h2>
            <div className="w-32 h-1 bg-amber-300/50 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-lg border-2 border-amber-300">😞</div>
              <div className="pt-3">
                <h3 className="font-bold text-amber-900 mb-2 text-lg">色が黒ばかりでわかりにくい</h3>
                <p className="text-sm text-amber-800/80 leading-relaxed">設営が終わる頃にできる、収納袋の山。撤収時、色が黒ばかりで、どれがどれの収納袋なのかわかりにくい…。</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-lg border-2 border-amber-300">📦</div>
              <div className="pt-3">
                <h3 className="font-bold text-amber-900 mb-2 text-lg">収納袋がついてこない</h3>
                <p className="text-sm text-amber-800/80 leading-relaxed">購入時に収納袋がついてこないギアもたくさんあります。汎用品の収納袋を買っても、サイズがいまいち…。</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-lg border-2 border-amber-300">💸</div>
              <div className="pt-3">
                <h3 className="font-bold text-amber-900 mb-2 text-lg">収納袋の紛失や破損</h3>
                <p className="text-sm text-amber-800/80 leading-relaxed">いつの間にか収納袋がどこかに行ってしまったり、焚火の火の粉で穴をあけてしまっても、メーカーで収納袋だけを販売しておらず…。</p>
              </div>
            </div>
          </div>

          {/* Arrow transition */}
          <div className="flex justify-center mt-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-green-200 flex items-center justify-center text-3xl shadow-lg border-4 border-white">
              ↓
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-800 to-green-900 text-white relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="solution-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                <path d="M0 0 L40 40 M40 0 L0 40" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#solution-pattern)" />
          </svg>
        </div>
        {/* Decorative stitch borders */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #facc15, #facc15 6px, transparent 6px, transparent 12px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #facc15, #facc15 6px, transparent 6px, transparent 12px)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-5xl">✨</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-300" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              WALLABY FACTORYが解決します！
            </h2>
            <p className="text-green-100/80">オリジナルの収納袋でキャンプがもっと楽しく！</p>
            <div className="w-32 h-1 bg-yellow-400/30 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-700/50 backdrop-blur-sm p-6 rounded-xl border-2 border-green-600/50 hover:border-yellow-400/50 transition-colors text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                🎨
              </div>
              <h3 className="font-bold text-xl mb-3 text-yellow-300">蛍光色で視認性アップ</h3>
              <p className="text-green-100/90 text-sm leading-relaxed">蛍光色のメッシュ生地を使用。生地、コード、コードストッパーの色も選択可能。もちろん定番の黒や白も。</p>
            </div>
            <div className="bg-green-700/50 backdrop-blur-sm p-6 rounded-xl border-2 border-green-600/50 hover:border-yellow-400/50 transition-colors text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                📐
              </div>
              <h3 className="font-bold text-xl mb-3 text-yellow-300">1cm単位でサイズ指定</h3>
              <p className="text-green-100/90 text-sm leading-relaxed">平型、円柱型、ボックス型から選べて、サイズも1cm単位で指定可能。どんなギアにもぴったりフィット。</p>
            </div>
            <div className="bg-green-700/50 backdrop-blur-sm p-6 rounded-xl border-2 border-green-600/50 hover:border-yellow-400/50 transition-colors text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                💡
              </div>
              <h3 className="font-bold text-xl mb-3 text-yellow-300">かんたんオーダー</h3>
              <p className="text-green-100/90 text-sm leading-relaxed">オーダーメイド画面から簡単にオーダー。他のユーザーがシェアしたオーダー内容から同じものも作れます。</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/customizer"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 font-bold text-lg py-4 px-10 rounded-full shadow-xl hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 transition-all"
            >
              今すぐオーダーする →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Transparency Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">わかりやすい価格設定</h2>
            <p className="text-slate-600">基本料金 + 布面積で計算。追加料金なし、明朗会計です</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-8 md:p-12 border-2 border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span> 基本料金（形状別）
                </h3>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between bg-white/60 px-4 py-2 rounded">
                    <span>平袋（フラット）</span>
                    <span className="font-bold">200円</span>
                  </div>
                  <div className="flex justify-between bg-white/60 px-4 py-2 rounded">
                    <span>円筒型</span>
                    <span className="font-bold">300円</span>
                  </div>
                  <div className="flex justify-between bg-white/60 px-4 py-2 rounded">
                    <span>立方体</span>
                    <span className="font-bold">400円</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📏</span> 布面積による追加料金
                </h3>
                <div className="bg-white/60 px-4 py-3 rounded mb-3">
                  <p className="text-sm text-slate-600 mb-2">計算式：</p>
                  <p className="font-mono text-slate-800 font-bold">布面積 × 2円</p>
                </div>
                <p className="text-xs text-slate-500">※ 布面積は形状によって自動計算されます</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-green-300">
              <h4 className="font-bold text-green-900 mb-3 text-center">価格例</h4>
              <p className="text-sm text-slate-600 text-center">
                幅30cm × 高さ40cmの平袋の場合<br />
                <span className="font-bold text-lg text-green-900">基本料金200円 + (30×40×2)×2円 = 5,000円</span>
              </p>
              <p className="text-xs text-slate-500 text-center mt-2">※ 最低価格は1,000円からとなります</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Feature Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">みんなのアイデアを共有</h2>
            <p className="text-slate-600">ギャラリー機能で、キャンパー同士がつながる</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">オーダー内容を公開</h3>
              <p className="text-slate-600 leading-relaxed">
                あなたが作った収納袋のサイズや色、用途をギャラリーに投稿できます。
                他のキャンパーの参考になるかもしれません。
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">気に入ったデザインで注文</h3>
              <p className="text-slate-600 leading-relaxed">
                ギャラリーで見つけた収納袋が気に入ったら、同じサイズ・色で注文可能。
                「これで作る」ボタンで、すぐにカスタマイザーに反映されます。
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/gallery" className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition-colors">
              ギャラリーを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-24 px-4 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">みんなのオーダー</h2>
              <p className="text-slate-600">直近の製作事例をご紹介</p>
            </div>
            <Link href="/gallery" className="text-green-600 font-bold hover:text-green-700 hover:underline flex items-center gap-1">
              もっと見る
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="aspect-square relative flex items-center justify-center bg-slate-900">
                    <BagModel
                      width={order.width}
                      height={order.height}
                      depth={order.depth || 10}
                      diameter={order.diameter || 15}
                      shape={order.shape as 'SQUARE' | 'CYLINDER' | 'CUBE'}
                      fabricColor="#22c55e" // Default for teaser
                      cordColor="#facc15"
                      stopperColor="#000000"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{order.itemName}</h3>
                    <p className="text-xs text-slate-500 mb-3">by {order.user.name || "Guest"}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.tags?.split(',').slice(0, 3).map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">#{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-500 mb-4">まだ投稿がありません。あなたのオーダーが最初の1つになるかもしれません！</p>
              <Link href="/customizer" className="text-green-600 font-bold hover:underline">
                オーダーを作成する &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
