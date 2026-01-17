import { prisma } from "@/lib/prisma"
import { AdminRoleSelect } from "./components"

export const revalidate = 0;

export default async function AdminStaffPage() {
    const staffMembers = await prisma.adminUser.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-green-900">スタッフ管理</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-yellow-50 text-xs text-yellow-700 border-b border-yellow-100">
                    ※ 現在、新規追加はデータベースシード(seed.ts)から行ってください。
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">氏名</th>
                            <th className="p-4">メールアドレス</th>
                            <th className="p-4">役割</th>
                            <th className="p-4 text-right">登録日</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {staffMembers.map(staff => (
                            <tr key={staff.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-bold text-slate-800">
                                    {staff.name}
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {staff.email}
                                </td>
                                <td className="p-4">
                                    <AdminRoleSelect userId={staff.id} currentRole={staff.role} />
                                </td>
                                <td className="p-4 text-right text-sm text-slate-500">
                                    {new Date(staff.createdAt).toLocaleDateString('ja-JP')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
