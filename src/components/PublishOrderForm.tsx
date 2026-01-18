'use client'

import { useState } from 'react'
import { uploadProductImages } from '@/actions/upload'
import { publishOrderToGallery } from '@/actions/gallery'
import Image from 'next/image'

interface PublishOrderFormProps {
    orderItemId: string
    onSuccess?: () => void
    onCancel?: () => void
}

export function PublishOrderForm({ orderItemId, onSuccess, onCancel }: PublishOrderFormProps) {
    const [itemName, setItemName] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Calculate total files after valid addition
        const currentCount = selectedFiles.length
        if (currentCount + files.length > 3) {
            setError('画像は最大3枚まで選択できます')
            // Reset input even on error so user can try again
            e.target.value = ''
            return
        }

        setError('')

        // Filter out duplicates if needed, or just append
        // For simplicity/UX, we'll append. 
        // Create previews for new files
        const newPreviews = files.map(file => URL.createObjectURL(file))

        setSelectedFiles(prev => [...prev, ...files])
        setPreviews(prev => [...prev, ...newPreviews])

        // Reset input to allow selecting the same file again if needed
        // and to prevent "1 file selected" text from persisting if user removes it
        e.target.value = ''
    }

    function removeImage(index: number) {
        const newFiles = selectedFiles.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)

        URL.revokeObjectURL(previews[index])

        setSelectedFiles(newFiles)
        setPreviews(newPreviews)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!itemName.trim()) {
            setError('アイテム名を入力してください')
            return
        }

        if (selectedFiles.length === 0) {
            setError('少なくとも1枚の画像を選択してください')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            // First, create a temporary public order to get an ID for image upload
            const tempId = `temp-${Date.now()}`

            // Upload images
            const formData = new FormData()
            selectedFiles.forEach(file => {
                formData.append('images', file)
            })

            const uploadResult = await uploadProductImages(tempId, formData)

            if (!uploadResult.success || !uploadResult.paths) {
                setError(uploadResult.error || '画像のアップロードに失敗しました')
                setIsSubmitting(false)
                return
            }

            // Publish to gallery
            const publishResult = await publishOrderToGallery(
                orderItemId,
                itemName,
                description,
                tags,
                uploadResult.paths
            )

            if (publishResult.success) {
                // Clean up previews
                previews.forEach(url => URL.revokeObjectURL(url))

                if (onSuccess) {
                    onSuccess()
                }
            } else {
                setError(publishResult.error || '公開に失敗しました')
            }
        } catch (err) {
            setError('公開に失敗しました')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900">ギャラリーに公開</h3>

            {/* Item Name */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    アイテム名 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="例: Snow Peak ペグハンマー"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    説明（任意）
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="このバッグの使い方や特徴を説明してください"
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    タグ（任意）
                </label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="例: ペグ,ハンマー,キャンプ（カンマ区切り）"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    商品画像 (1〜3枚) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="image-upload"
                        onChange={handleFileSelect}
                        disabled={isSubmitting || selectedFiles.length >= 3}
                        className="hidden"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer ${isSubmitting || selectedFiles.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        画像を選択 ({selectedFiles.length}/3)
                    </label>
                    <p className="text-xs text-slate-500 mt-2">
                        JPG, PNG, GIF形式に対応。最大3枚までアップロード可能です。
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group">
                            <Image
                                src={preview}
                                alt={`プレビュー ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                disabled={isSubmitting}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            >
                                ×
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {index + 1}枚目
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || selectedFiles.length === 0}
                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '公開中...' : 'ギャラリーに公開'}
                </button>
            </div>
        </form>
    )
}
