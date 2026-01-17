'use client'

import { togglePublicStatus } from "./actions"

export function StatusToggle({ id, isPublic }: { id: string, isPublic: boolean }) {
    return (
        <button
            onClick={() => togglePublicStatus(id, isPublic)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${isPublic
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
        >
            {isPublic ? 'Public' : 'Private'}
        </button>
    )
}
