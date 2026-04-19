import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * === DESIGN SYSTEM BUTTON ===
 * Single source of truth for all buttons
 * Uses design tokens from globals.css
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentEnd/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // PRIMARY: Gold gradient - Main CTA
        primary: `
          bg-gradient-to-r from-accentStart to-accentEnd
          text-black
          shadow-lg
          hover:scale-105 hover:shadow-xl
          active:scale-95
        `,
        // SECONDARY: Outline / subtle
        secondary: `
          border-2 border-accentEnd/60
          text-accentEnd
          bg-transparent
          hover:bg-gradient-to-r hover:from-accentStart hover:to-accentEnd hover:text-black hover:shadow-lg
          active:scale-95
        `,
        // GHOST: Minimal, transparent
        ghost: `
          text-foreground
          hover:bg-white/5
          active:bg-white/10
        `,
        // GHOST GOLD: Gold text, transparent bg
        ghostGold: `
          text-gold
          hover:bg-gold/10
          active:bg-gold/20
        `,
        // DESTRUCTIVE: Red warning
        destructive: `
          bg-red-600
          text-white
          hover:bg-red-700
          shadow-md
        `,
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

/**
 * DESIGN SYSTEM BUTTON
 * Use this component for ALL buttons throughout the app
 * 
 * Usage:
 * - Primary: Main CTA (get started, submit, etc.)
 * - Secondary: Alternative actions (back, cancel)
 * - Ghost: Subtle actions (skip, maybe later)
 * - GhostGold: Premium/special actions
 * - Destructive: Warning actions (delete, remove)
 */
export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

