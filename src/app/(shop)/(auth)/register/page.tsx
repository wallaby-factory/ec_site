'use client'

import { register } from "@/actions/auth";
import React, { useState } from 'react';

export default function RegisterPage() {
    const [addressState, setAddressState] = useState({
        prefecture: '',
        city: '',
        street: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

    // Password validation function
    function validatePassword(pwd: string): string {
        if (pwd.length < 8 || pwd.length > 16) {
            return 'パスワードは8桁～16桁で入力してください'
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'アルファベットの大文字を1文字以上含めてください'
        }
        if (!/[a-z]/.test(pwd)) {
            return 'アルファベットの小文字を1文字以上含めてください'
        }
        if (!/[0-9]/.test(pwd)) {
            return '数字を1文字以上含めてください'
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
            return '記号を1文字以上含めてください'
        }
        return ''
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newPassword = e.target.value
        setPassword(newPassword)
        if (newPassword) {
            setPasswordError(validatePassword(newPassword))
        } else {
            setPasswordError('')
        }
    }

    async function clientRegister(formData: FormData) {
        const pwd = formData.get('password') as string
        const error = validatePassword(pwd)
        if (error) {
            alert(error)
            return
        }

        const result = await register(formData)
        if (result?.error) {
            alert(result.error)
        }
    }

    const handleZipSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const zip = e.target.value.replace('-', '')
        if (zip.length === 7) {
            try {
                const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`)
                const data = await res.json()
                if (data.results) {
                    const result = data.results[0]
                    setAddressState({
                        prefecture: result.address1,
                        city: result.address2,
                        street: result.address3
                    })
                }
            } catch (error) {
                console.error('Zip search failed', error)
            }
        }
    }

    return (
        <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-green-900">会員登録</h1>
                <form action={clientRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">氏名 <span className="text-red-500">*</span></label>
                        <input name="name" type="text" className="w-full border rounded p-2" placeholder="山田 太郎" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">ニックネーム <span className="text-red-500">*</span></label>
                        <input name="nickname" type="text" className="w-full border rounded p-2" placeholder="例: キャンプ好き" required />
                        <p className="text-xs text-slate-400 mt-1">ログイン後のヘッダーに「ようこそ〇〇さん」と表示されます</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                        <input name="email" type="email" className="w-full border rounded p-2" placeholder="email@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">パスワード <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className={`w-full border rounded p-2 pr-10 ${passwordError ? 'border-red-500' : ''}`}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
                            >
                                <img
                                    src={showPassword ? "/eye_close.png" : "/eye_open.png"}
                                    alt={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                        )}
                        <div className="mt-2 text-xs text-slate-500 space-y-1">
                            <p className="font-bold">パスワードの条件:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li className={password.length >= 8 && password.length <= 16 ? 'text-green-600' : ''}>8桁～16桁</li>
                                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>大文字を1文字以上</li>
                                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>小文字を1文字以上</li>
                                <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>数字を1文字以上</li>
                                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : ''}>記号を1文字以上</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">発送先住所</label>

                        <div className="mb-3">
                            <label className="block text-xs font-bold text-slate-500 mb-1">郵便番号 (ハイフンなし7桁) <span className="text-red-500">*</span></label>
                            <input
                                name="zipCode"
                                type="text"
                                className="w-32 border rounded p-2"
                                placeholder="1234567"
                                maxLength={7}
                                onChange={handleZipSearch}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">都道府県 <span className="text-red-500">*</span></label>
                                <input name="prefecture" type="text" className="w-full border rounded p-2 bg-slate-50" defaultValue={addressState.prefecture} key={addressState.prefecture} readOnly required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">市区町村 <span className="text-red-500">*</span></label>
                                <input name="city" type="text" className="w-full border rounded p-2 bg-slate-50" defaultValue={addressState.city} key={addressState.city} readOnly required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-bold text-slate-500 mb-1">番地 <span className="text-red-500">*</span></label>
                            <input name="street" type="text" className="w-full border rounded p-2" defaultValue={addressState.street} key={addressState.street} placeholder="1-2-3" required />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">建物名 (任意)</label>
                            <input name="building" type="text" className="w-full border rounded p-2" placeholder="〇〇マンション 101" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">プライバシーポリシー <span className="text-red-500">*</span></label>

                        <div
                            className="h-40 overflow-y-scroll border rounded-md p-4 mb-3 text-xs text-slate-600 bg-slate-50"
                            onScroll={(e) => {
                                const element = e.currentTarget;
                                if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1) {
                                    setHasScrolledToBottom(true);
                                }
                            }}
                        >
                            <h3 className="font-bold mb-2">個人情報の取り扱いについて</h3>
                            <p className="mb-2">
                                当店は、個人情報保護法および関連するその他の法令・規範を遵守します。
                                お客様からお預かりした個人情報は、以下の目的で利用いたします。
                            </p>
                            <ul className="list-disc list-inside mb-2 pl-2">
                                <li>商品発送および決済</li>
                                <li>お問い合わせ対応</li>
                                <li>アフターサービス</li>
                                <li>新商品・サービスのご案内</li>
                            </ul>
                            <p className="mb-2">
                                当店は、法令に基づく場合等正当な理由によらない限り、事前に本人の同意を得ることなく、個人情報を第三者に開示・提供することはありません。
                            </p>
                            <p className="mb-2">
                                個人情報の開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。
                                ご本人確認のうえ、速やかに対応いたします。
                            </p>
                            <p className="mb-2">
                                当店は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。
                            </p>
                            <p className="font-bold text-slate-400 mt-4 text-center">
                                --- 最後までお読みいただきありがとうございます ---
                            </p>
                        </div>

                        <label className={`flex items-center gap-2 text-sm font-bold ${hasScrolledToBottom ? 'cursor-pointer text-slate-700' : 'cursor-not-allowed text-slate-400'}`}>
                            <input
                                type="checkbox"
                                required
                                disabled={!hasScrolledToBottom}
                                className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                            />
                            <span>プライバシーポリシーに同意する</span>
                        </label>
                        {!hasScrolledToBottom && (
                            <p className="text-xs text-red-500 mt-1">※ポリシーを最後までスクロールして内容をご確認ください</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!hasScrolledToBottom}
                        className={`w-full font-bold py-3 rounded-lg transition-colors mt-6 ${hasScrolledToBottom
                            ? 'bg-yellow-400 text-green-900 hover:bg-yellow-500'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        登録する
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                        すでにアカウントをお持ちの方は <a href="/login" className="text-green-600 underline">ログイン</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
