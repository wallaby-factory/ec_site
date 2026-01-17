'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { logout } from '@/actions/auth'

export function LogoutButton() {
    const [showDialog, setShowDialog] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (showDialog) {
            setTimeout(() => setIsAnimating(true), 10)
        } else {
            setIsAnimating(false)
        }
    }, [showDialog])

    function handleClose() {
        setIsAnimating(false)
        setTimeout(() => setShowDialog(false), 200)
    }

    const dialogContent = showDialog && mounted ? (
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 transition-all duration-200 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-slate-900 mb-3">ログアウト確認</h3>
                <p className="text-slate-600 mb-6">ログアウトしますか？</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        type="button"
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        キャンセル
                    </button>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            ログアウト
                        </button>
                    </form>
                </div>
            </div>
        </div>
    ) : null

    return (
        <>
            <button
                onClick={() => setShowDialog(true)}
                type="button"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-1.5 border border-white/30 cursor-pointer relative z-50"
            >
                ログアウト
            </button>

            {mounted && dialogContent && createPortal(dialogContent, document.body)}
        </>
    )
}
