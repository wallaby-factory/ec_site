'use client'

import { useState, useTransition } from 'react'
import { updateMaterialStatus } from './actions'
import { toast } from 'sonner' // Assuming sonner is available based on layout.tsx having Toaster

const STATUS_OPTIONS = [
    {
        value: 'PLENTIFUL',
        label: '◎',
        description: '余裕あり',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
            </svg>
        )
    },
    {
        value: 'AVAILABLE',
        label: '○',
        description: '通常',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <circle cx="12" cy="12" r="10" />
            </svg>
        )
    },
    {
        value: 'LIMITED',
        label: '△',
        description: '残りわずか',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
        )
    },
    {
        value: 'OUT_OF_STOCK',
        label: '×',
        description: '在庫切れ',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
        )
    },
]

type Material = {
    id: string
    category: string
    name: string
    status: string
}

export function MaterialUpdateCard({ item }: { item: Material }) {
    const [status, setStatus] = useState(item.status)
    const [isPending, startTransition] = useTransition()
    const [changed, setChanged] = useState(false)

    const handleChange = (newStatus: string) => {
        setStatus(newStatus)
        setChanged(newStatus !== item.status)
    }

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateMaterialStatus(item.id, status)
                setChanged(false)
                toast.success(`${item.name}のステータスを更新しました`)
            } catch (error) {
                toast.error('更新に失敗しました')
            }
        })
    }

    const currentOption = STATUS_OPTIONS.find(o => o.value === item.status)
    const Icon = currentOption?.icon

    return (
        <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800">{item.name}</h3>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-bold border ${currentOption?.color}`}>
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{currentOption?.description}</span>
                </span>
            </div>

            <div className="mb-4 relative">
                <select
                    value={status}
                    onChange={(e) => handleChange(e.target.value)}
                    className={`w-full p-2 border rounded-md text-sm font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-green-500 pr-10 ${STATUS_OPTIONS.find(o => o.value === status)?.color.split(' ')[0] || 'text-slate-700'
                        }`}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label} : {option.description}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={!changed || isPending}
                className={`w-full py-2 rounded font-bold transition-all shadow-sm ${changed && !isPending
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow transform hover:-translate-y-0.5'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
            >
                {isPending ? '更新中...' : '登録'}
            </button>
        </div>
    )
}
