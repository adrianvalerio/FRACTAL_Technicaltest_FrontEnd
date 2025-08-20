"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/types"
import { apiService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { Trash2, Plus } from "lucide-react"

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId: string | null }>({
        isOpen: false,
        orderId: null,
    })
    const router = useRouter()

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            setLoading(true)
            const ordersData = await apiService.getOrders()
            setOrders(ordersData)
        } catch (error) {
            console.error("Error loading orders:", error)
            // For demo purposes, use mock data if API fails
            setOrders([
                {
                    id: "1",
                    orderNumber: "ORD-001",
                    date: "2024-01-15",
                    products: [],
                    totalProducts: 3,
                    finalPrice: 299.99,
                    status: "Pending",
                },
                {
                    id: "2",
                    orderNumber: "ORD-002",
                    date: "2024-01-14",
                    products: [],
                    totalProducts: 1,
                    finalPrice: 99.99,
                    status: "InProgress",
                },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteOrder = async (orderId: string) => {
        try {
            await apiService.deleteOrder(orderId)
            setOrders(orders.filter((order) => order.id !== orderId))
        } catch (error) {
            console.error("Error deleting order:", error)
            // For demo purposes, remove from local state
            setOrders(orders.filter((order) => order.id !== orderId))
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: "Pending" | "InProgress" | "Completed") => {
        try {
            await apiService.updateOrderStatus(orderId, newStatus)
            setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        } catch (error) {
            console.error("Error updating order status:", error)
            // For demo purposes, update local state
            setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800"
            case "InProgress":
                return "bg-blue-100 text-blue-800"
            case "Completed":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground font-sans">My Orders</h1>
                <Button onClick={() => router.push("/add-order")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Order
                </Button>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Order #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                # Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Final Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Options
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                                    {order.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{order.totalProducts}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                    ${order.finalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                                        disabled={order.status === "Completed"}
                                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)} ${
                                            order.status === "Completed" ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                                        }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setDeleteModal({ isOpen: true, orderId: order.id })}
                                            className="flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No orders found</p>
                        <Button onClick={() => router.push("/add-order")}>Create your first order</Button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
                onConfirm={() => deleteModal.orderId && handleDeleteOrder(deleteModal.orderId)}
                title="Delete Order"
                message="Are you sure you want to delete this order? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    )
}
