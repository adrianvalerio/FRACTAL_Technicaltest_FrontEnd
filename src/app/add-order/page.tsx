'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { apiService } from '@/lib/api'

type SelectedProduct = Product & { quantity: number }

export default function AddOrderPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [orderNumber] = useState(Date.now().toString())

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await apiService.getProducts()
                setProducts(data)
            } catch (error) {
                console.error('Error loading products:', error)
                setProducts([
                    { id: '1', name: 'Producto 1', unitPrice: 100 },
                    { id: '2', name: 'Producto 2', unitPrice: 200 },
                ])
            } finally {
                setIsLoading(false)
            }
        }

        loadProducts()
    }, [])

    const addProduct = (product: Product) => {
        const existing = selectedProducts.find(p => p.id === product.id)
        if (existing) {
            // Si ya existe, incremento cantidad
            setSelectedProducts(selectedProducts.map(p =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ))
        } else {
            // Si no existe, lo agrego con cantidad 1
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
        }
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            // si baja a 0, lo eliminamos de la lista
            setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
        } else {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === productId ? { ...p, quantity } : p
            ))
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const orderData = {
                orderNumber,
                products: selectedProducts.map((product) => ({
                    productId: product.id,
                    quantity: 1,
                })),
            }

            console.log("[DEBUG FRONT] Enviando orderData:", orderData)

            await apiService.createOrder(orderData)
            router.push('/my-orders')
        } catch (error) {
            console.error('Error creating order:', error)
        }
    }


    if (isLoading) {
        return <div>Cargando...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Crear Nueva Orden</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Productos Disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                                onClick={() => addProduct(product)}
                            >
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-gray-600">${product.unitPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Productos Seleccionados</h2>
                    <div className="space-y-2">
                        {selectedProducts.map((product) => (
                            <div key={product.id} className="flex justify-between items-center border p-2 rounded">
                                <span>{product.name}</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                                        className="w-16 border rounded text-center"
                                    />
                                    <span className="w-20 text-right">
                                        ${(product.unitPrice * product.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="font-bold">
                            Total: $
                            {selectedProducts.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                    Crear Orden
                </button>
            </form>
        </div>
    )
}
