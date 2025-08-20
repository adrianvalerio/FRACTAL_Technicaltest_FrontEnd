// api.ts

import type { Order, Product, CreateOrderRequest } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

            return response.json()
    }

    // Orders
    async getOrders(): Promise<Order[]> {
        return this.request<Order[]>("/orders")
    }

    async getOrder(id: string): Promise<Order> {
        return this.request<Order>(`/orders/${id}`)
    }

    async createOrder(order: CreateOrderRequest): Promise<Order> {
        return this.request<Order>("/orders", {
            method: "POST",
            body: JSON.stringify(order),
        })
    }

    async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
        return this.request<Order>(`/orders/${id}`, {
            method: "PUT",
            body: JSON.stringify(order),
        })
    }

    async deleteOrder(id: string): Promise<void> {
        return this.request<void>(`/orders/${id}`, {
            method: "DELETE",
        })
    }

    async updateOrderStatus(id: string, status: "Pending" | "InProgress" | "Completed"): Promise<Order> {
        return this.request<Order>(`/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        })
    }

    // Products
    async getProducts(): Promise<Product[]> {
        return this.request<Product[]>("/products")
    }

    async getProduct(id: string): Promise<Product> {
        return this.request<Product>(`/products/${id}`)
    }

    async createProduct(product: Omit<Product, "id">): Promise<Product> {
        return this.request<Product>("/products", {
            method: "POST",
            body: JSON.stringify(product),
        })
    }

    async updateProduct(product: Product): Promise<Product> {
        return this.request<Product>(`/products/${product.id}`, {
            method: "PUT",
            body: JSON.stringify(product),
        })
    }

    async deleteProduct(id: string): Promise<void> {
        return this.request<void>(`/products/${id}`, {
            method: "DELETE",
        })
    }
}

export const apiService = new ApiService()
