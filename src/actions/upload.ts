'use server'

import { put } from '@vercel/blob'

// Upload multiple images for an order/item
// Returns array of URLs on success
export async function uploadProductImages(orderId: string, formData: FormData) {
    const imagePaths: string[] = []

    // Get all files from formData
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
        return { success: false, error: 'ファイルが選択されていません' }
    }

    try {
        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                continue
            }

            // Upload to Vercel Blob
            // Path structure: orders/{orderId}/{filename}
            // access: 'public' allows direct URL access
            const { url } = await put(`orders/${orderId}/${file.name}`, file, {
                access: 'public',
            })

            imagePaths.push(url)
        }

        return { success: true, paths: imagePaths }
    } catch (error) {
        console.error('Image upload error:', error)
        return { success: false, error: '画像のアップロードに失敗しました' }
    }
}
