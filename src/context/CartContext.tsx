'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
    id: string
    shape: 'SQUARE' | 'CYLINDER' | 'CUBE'
    width: number
    height: number
    depth?: number
    diameter?: number
    fabricColor: { name: string, hex: string }
    cordColor: { name: string, hex: string }
    stopperColor: { name: string, hex: string } // Kept for type compatibility even if N/A for cordCount=2
    cordCount: 1 | 2
    quantity: number
    unitPrice: number
    type?: string
    slitSize?: number
}

type CartContextType = {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalPrice: number
    totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('wallaby_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e)
            }
        }
    }, [])

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('wallaby_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            // Check if identical item exists (optional, for now just add new)
            // A "smart" cart might merge identical configurations, but for custom goods, separate lines are often safer.
            // Let's check for exact match to merge quantities?
            // For simplicity in V1, let's treat every add as a unique line item unless we really want to merge.
            // Let's just append for now to avoid complexity with comparing deep objects.
            return [...prev, item]
        })
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
