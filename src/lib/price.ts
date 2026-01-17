export const SHAPES = {
    SQUARE: 'SQUARE',
    CYLINDER: 'CYLINDER',
    CUBE: 'CUBE',
} as const

export type Shape = keyof typeof SHAPES

export interface PriceParams {
    shape: Shape
    width?: number
    height?: number
    depth?: number
    diameter?: number
}

// Pricing Constants
export const BASE_PRICES = {
    [SHAPES.SQUARE]: 200,
    [SHAPES.CYLINDER]: 300,
    [SHAPES.CUBE]: 400,
}
export const MIN_PRICE = 1100
export const PRICE_PER_SQCM = 1.5

/**
 * Calculates the price of a bag based on its dimensions and shape.
 * Formula: Base Price + (Area * Price Per SqCm)
 * Minimum Price applies.
 */
export function calculatePrice(params: PriceParams): number {
    const { shape, width = 0, height = 0, depth = 0, diameter = 0 } = params
    let area = 0

    if (shape === SHAPES.SQUARE) {
        if (width <= 0 || height <= 0) return 0
        area = width * height * 2
    } else if (shape === SHAPES.CYLINDER) {
        if (diameter <= 0 || height <= 0) return 0
        const radius = diameter / 2
        const baseArea = Math.PI * radius * radius // Bottom
        const sideArea = Math.PI * diameter * height // Side
        area = baseArea + sideArea
    } else if (shape === SHAPES.CUBE) {
        if (width <= 0 || height <= 0 || depth <= 0) return 0
        const bottomArea = width * depth
        const frontBackArea = width * height * 2
        const sideArea = depth * height * 2
        area = bottomArea + frontBackArea + sideArea
    }

    const basePrice = BASE_PRICES[shape] || 200
    let price = basePrice + (area * PRICE_PER_SQCM)

    // Round down to nearest 100
    price = Math.floor(price / 100) * 100

    // Apply minimum price rule
    if (price < MIN_PRICE) {
        price = MIN_PRICE
    }

    return price
}
