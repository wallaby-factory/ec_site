'use client'

import { useState } from 'react'
import { uploadProductImages } from '@/actions/upload'
import Image from 'next/image'

interface ImageUploadProps {
    orderId: string
    onUploadComplete?: () => void
}

export function ImageUpload({ orderId, onUploadComplete }: ImageUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string>('')

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || [])

        if (files.length > 3) {
            setError('画像は最大3枚まで選択できます')
            return
        }

        if (files.length === 0) {
            setError('少なくとも1枚の画像を選択してください')
            return
        }

        setError('')
        setSelectedFiles(files)

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setPreviews(newPreviews)
    }

    function removeImage(index: number) {
        const newFiles = selectedFiles.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)

        // Revoke old preview URL
        URL.revokeObjectURL(previews[index])

        setSelectedFiles(newFiles)
        setPreviews(newPreviews)

        if (newFiles.length === 0) {
            setError('少なくとも1枚の画像を選択してください')
        }
    }

    async function handleUpload() {
        if (selectedFiles.length === 0) {
            setError('少なくとも1枚の画像を選択してください')
            return
        }

        setIsUploading(true)
        setError('')

        try {
            const formData = new FormData()
            selectedFiles.forEach(file => {
                formData.append('images', file)
            })

            const result = await uploadProductImages(orderId, formData)

            if (result.success) {
                // Clean up previews
                previews.forEach(url => URL.revokeObjectURL(url))
                setSelectedFiles([])
                setPreviews([])

                if (onUploadComplete) {
                    onUploadComplete()
                }
            } else {
                setError(result.error || 'アップロードに失敗しました')
            }
        } catch (err) {
            setError('アップロードに失敗しました')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    商品画像 (1〜3枚) <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 mt-1">
                    JPG, PNG, GIF形式に対応。最大3枚まで選択可能です。
                </p>
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
                                onClick={() => removeImage(index)}
                                disabled={isUploading}
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

            {/* Upload Button */}
            {selectedFiles.length > 0 && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'アップロード中...' : '画像をアップロード'}
                </button>
            )}
        </div>
    )
}
