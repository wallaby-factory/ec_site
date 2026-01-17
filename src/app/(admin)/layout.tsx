'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type Role = 'ADMIN' | 'STAFF'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [role, setRole] = useState<Role>('ADMIN')
    const pathname = usePathname()
    const router = useRouter()

    // Mock Auth Guard
    useEffect(() => {
        if (role === 'STAFF') {
            // ADMIN only paths
            const restrictedPaths = ['/admin/users', '/admin/staff', '/admin/gallery']
            if (restrictedPaths.some(path => pathname.startsWith(path))) {
                alert('権限がありません (STAFF: Dashboard Only)')
                router.push('/admin')
            }
        }
    }, [role, pathname, router])

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col transition-all">
                <div className="p-6 border-b border-slate-700">
                    <div className="text-xl font-bold text-yellow-400 tracking-tight cursor-default">
                        WALLABY FACTORY
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Admin Console</p>
                </div>
                <nav className="p-4 flex-1">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/admin" className={`block px-4 py-2 rounded transition-colors ${pathname === '/admin' ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                ダッシュボード
                            </Link>
                        </li>

                        {/* Admin Only Links */}
                        {role === 'ADMIN' && (
                            <>
                                <li>
                                    <Link href="/admin/users" className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith('/admin/users') ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                        顧客管理
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/staff" className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith('/admin/staff') ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                        スタッフ管理
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/gallery" className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith('/admin/gallery') ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                        ギャラリー管理
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Material Management (Accessible to Staff) */}
                        <li>
                            <Link href="/admin/materials" className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith('/admin/materials') ? 'bg-green-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                資材管理
                            </Link>
                        </li>

                        {/* Staff View (Restricted Visuals) */}
                        {role === 'STAFF' && (
                            <li className="px-4 py-8 text-xs text-slate-500 text-center">
                                ※ 縫製担当者はダッシュボードと資材管理のみ閲覧可能です
                            </li>
                        )}
                    </ul>
                </nav>
                <div className="p-4 bg-slate-900/50 text-xs text-center text-slate-500">
                    Logged in as: <span className="text-white font-bold">{role}</span>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm border-b border-slate-200 p-4 flex justify-between items-center h-16">
                    <h2 className="text-slate-700 font-bold">
                        {pathname === '/admin' && 'ダッシュボード'}
                        {pathname.startsWith('/admin/users') && '顧客管理'}
                        {pathname.startsWith('/admin/staff') && 'スタッフ管理'}
                        {pathname.startsWith('/admin/gallery') && 'ギャラリー管理'}
                        {pathname.startsWith('/admin/materials') && '資材管理'}
                    </h2>

                    {/* Mock Role Switcher */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Simulate Role:</span>
                        <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => setRole('ADMIN')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${role === 'ADMIN'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                SYSTEM ADMIN
                            </button>
                            <button
                                onClick={() => setRole('STAFF')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${role === 'STAFF'
                                    ? 'bg-white text-blue-800 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                SEWING STAFF
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
