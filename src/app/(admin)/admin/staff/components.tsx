'use client'

import { updateAdminRole } from "./actions"

export function AdminRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
    return (
        <select
            defaultValue={currentRole}
            onChange={(e) => updateAdminRole(userId, e.target.value)}
            className="text-xs border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700 font-bold focus:ring-2 focus:ring-green-500 outline-none"
        >
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
        </select>
    )
}
