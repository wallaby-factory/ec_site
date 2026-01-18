export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-600 animate-spin"></div>
                <div className="mt-4 text-green-800 font-bold text-sm text-center">Loading...</div>
            </div>
        </div>
    )
}
