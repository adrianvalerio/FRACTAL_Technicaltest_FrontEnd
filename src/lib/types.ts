export interface Product {
    id: string
    name: string
    unitPrice: number
}

export interface OrderProduct {
    id: string
    productId: string
    quantity: number
    totalPrice: number
    product: Product
}

export interface Order {
    id: string
    orderNumber: string
    date: string
    totalProducts: number
    finalPrice: number
    status: string
    products: OrderProduct[]
}

export interface CreateOrderRequest {
    orderNumber: string
    products: { productId: string; quantity: number }[]
}
