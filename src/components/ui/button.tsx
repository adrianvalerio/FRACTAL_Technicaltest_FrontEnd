import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "destructive"
    size?: "sm" | "md" | "lg"
    className?: string
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = "default",
                                                  size = "md",
                                                  className = "",
                                                  children,
                                                  ...props
                                              }) => {
    const base = "px-4 py-2 rounded font-medium transition"
    const variants = {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-border bg-white text-foreground hover:bg-muted",
        destructive: "bg-red-600 text-white hover:bg-red-700"
    }
    const sizes = {
        sm: "text-sm py-1 px-2",
        md: "text-base",
        lg: "text-lg py-3 px-6"
    }
    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}