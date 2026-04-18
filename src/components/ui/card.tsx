import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'tarot' | 'glass'
  interactive?: boolean
}

function Card({
  className,
  variant = 'default',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const baseStyles = "relative overflow-hidden rounded-2xl transition-all duration-300"
  
  const variantStyles = {
    default: "bg-[rgb(var(--surface))] border border-[rgb(var(--gold))/10] shadow-[0_0_40px_rgba(0,0,0,0.4)]",
    tarot: "bg-gradient-to-br from-[#1A0F2E] to-[#0A0A0A] border border-[rgb(var(--gold))/20] shadow-[0_0_30px_rgba(244,197,66,0.1)]",
    glass: "bg-[rgb(var(--surface))/60] backdrop-blur-xl border border-[rgb(var(--gold))/10]",
  }

  const Component = interactive ? motion.div : 'div'
  const motionProps = interactive ? {
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <Component
      className={cn(baseStyles, variantStyles[variant], className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-5 py-4", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-serif text-lg text-[rgb(var(--foreground))] font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm text-[rgb(var(--foreground-secondary))]", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-5 py-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center px-5 py-3 border-t border-[rgb(var(--gold))/10] bg-[#0A0A0A]/50",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}