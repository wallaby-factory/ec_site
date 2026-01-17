'use client'

import { login } from "@/actions/auth";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    async function clientLogin(formData: FormData) {
        const result = await login(formData)
        if (result?.error) {
            alert(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-green-900">ログイン</h1>
                <form action={clientLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">メールアドレス</label>
                        <input name="email" type="email" className="w-full border rounded p-2" placeholder="email@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">パスワード</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full border rounded p-2 pr-10"
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
                    </div>
                    <button type="submit" className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
                        ログイン
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                        アカウントをお持ちでない方は <a href="/register" className="text-green-600 underline">新規登録</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
