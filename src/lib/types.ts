export interface Product {
    id: string
    name: string
    unitPrice: number
}

export interface OrderProduct {
    id: string
    productId: string
    product: Product
    quantity: number
    totalPrice: number
}

export interface Order {
    id: string
    orderNumber: string
    date: string
    products: OrderProduct[]
    totalProducts: number
    finalPrice: number
    status: "Pending" | "InProgress" | "Completed"
}

export interface CreateOrderRequest {
    orderNumber: string
    products: {
        productId: string
        quantity: number
    }[]
}

export interface UpdateOrderRequest extends CreateOrderRequest {
    id: string
}
