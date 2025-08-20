'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Order, Product } from '@/lib/types'
import { apiService } from '@/lib/api'

export default function AddOrderPage() {
    const params = useParams()
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [orderNumber, setOrderNumber] = useState(Date.now().toString())

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await apiService.getProducts()
                setProducts(data)
            } catch (error) {
                console.error('Error loading products:', error)
                // Usar datos mock en caso de error
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const orderData = {
                orderNumber,
                products: selectedProducts,
                total: selectedProducts.reduce((sum, product) => sum + product.unitPrice, 0)
            }
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
                                className="border p-4 rounded-lg cursor-pointer"
                                onClick={() => setSelectedProducts([...selectedProducts, product])}
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
                        {selectedProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center border p-2 rounded">
                                <span>{product.name}</span>
                                <span>${product.unitPrice}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="font-bold">
                            Total: ${selectedProducts.reduce((sum, product) => sum + product.unitPrice, 0)}
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