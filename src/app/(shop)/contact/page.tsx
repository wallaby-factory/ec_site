'use client'

import React, { useState } from 'react'
import { sendContact } from '@/actions/contact'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ContactPage() {
    const router = useRouter()
    const [step, setStep] = useState<'INPUT' | 'CONFIRM'>('INPUT')
    const [isPending, setIsPending] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        emailConfirm: '',
        subject: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.email !== formData.emailConfirm) {
            toast.error('メールアドレスが一致しません')
            return
        }
        setStep('CONFIRM')
        window.scrollTo(0, 0)
    }

    const handleSubmit = async () => {
        setIsPending(true)
        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value)
        })

        const result = await sendContact(data)

        if (result.error) {
            toast.error(result.error)
            setIsPending(false)
        } else {
            toast.success('お問い合わせを送信しました')
            // Redirect or show completion
            setFormData({ name: '', email: '', emailConfirm: '', subject: '', message: '' })
            setStep('INPUT') // Reset for now, or could redirect to /contact/complete
            router.push('/')
        }
    }

    return (
        <div className="min-h-screen bg-grass-pattern py-16 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="card-glass overflow-hidden">
                    <div className="bg-green-800/80 backdrop-blur-sm p-6 text-center border-b border-green-700/50">
                        <h1 className="text-2xl font-bold text-white drop-shadow-sm">お問い合わせ</h1>
                        <p className="text-green-100 text-sm mt-2">
                            {step === 'INPUT' ? '必要事項をご入力ください' : '入力内容をご確認ください'}
                        </p>
                    </div>

                    <div className="p-8">
                        {step === 'INPUT' ? (
                            <form onSubmit={handleConfirm} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        お名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-glass w-full rounded-lg p-3"
                                        placeholder="山田 太郎"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            メールアドレス <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-glass w-full rounded-lg p-3"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            メールアドレス (確認) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="emailConfirm"
                                            type="email"
                                            required
                                            value={formData.emailConfirm}
                                            onChange={handleChange}
                                            className="input-glass w-full rounded-lg p-3"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        件名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="subject"
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="input-glass w-full rounded-lg p-3"
                                        placeholder="オーダーメイドに関するお問い合わせ"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        お問い合わせ内容 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={8}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="input-glass w-full rounded-lg p-3 resize-none"
                                        placeholder="お問い合わせ内容をご記入ください..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-800 text-white font-bold py-4 rounded-lg hover:bg-slate-700 transition shadow-lg transform active:scale-95"
                                >
                                    確認画面へ進む
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">お名前</label>
                                        <p className="text-lg font-bold text-slate-800">{formData.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">メールアドレス</label>
                                        <p className="text-lg font-bold text-slate-800">{formData.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">お問い合わせ内容</label>
                                        <div className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">{formData.message}</div>
                                    </div>
                                </div>

                                <div className="text-sm text-slate-500 bg-yellow-50 p-4 rounded border border-yellow-100">
                                    <p>※ 送信後、ご入力いただいたメールアドレス宛に自動返信メールが送信されます。</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setStep('INPUT')}
                                        disabled={isPending}
                                        className="w-full bg-white text-slate-600 font-bold py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                送信中...
                                            </>
                                        ) : (
                                            '送信する'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
