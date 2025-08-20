import type React from "react"
import { Geist, Manrope } from "next/font/google"
import "./globals.css"

const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist",
})

const manrope = Manrope({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-manrope",
})

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
        <body className="min-h-screen bg-background font-sans">
        <nav className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-primary font-sans">Order Management System</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="/my-orders" className="text-foreground hover:text-primary transition-colors">
                            My Orders
                        </a>
                        <a
                            href="/add-order"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors"
                        >
                            Add Order
                        </a>
                    </div>
                </div>
            </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </body>
        </html>
    )
}
