import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-2 font-serif text-sm text-[rgb(var(--foreground))]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-muted))]">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-transparent border-0 border-b-2 border-white/10",
            "py-3 px-0 text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))]",
            "transition-all duration-300",
            "focus:outline-none focus:border-[rgb(var(--gold))]",
            "focus:shadow-[0_4px_20px_rgba(244,197,66,0.15)]",
            icon && "pl-10",
            error && "border-[rgb(var(--secondary))] focus:border-[rgb(var(--secondary))]",
            className
          )}
          {...props}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[rgb(var(--gold-start))] to-[rgb(var(--gold))]"
          initial={{ width: 0 }}
          whileFocus={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-[rgb(var(--secondary))]">{error}</p>
      )}
    </div>
  )
}

export { Input }