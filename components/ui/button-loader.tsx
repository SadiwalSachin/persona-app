import { Button } from "@/components/ui/button"
import { Spinner } from "./loader"
import { cn } from "@/lib/utils"

interface ButtonLoaderProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ButtonLoader({ 
  loading = false, 
  children, 
  className,
  disabled,
  onClick,
  variant = "default",
  size = "default",
  ...props 
}: ButtonLoaderProps) {
  return (
    <Button
      className={cn(className)}
      disabled={loading || disabled}
      onClick={onClick}
      variant={variant}
      size={size}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </Button>
  )
}
