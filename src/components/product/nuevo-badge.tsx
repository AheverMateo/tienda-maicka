import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function NuevoBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full bg-hi px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-hi-foreground",
        className,
      )}
    >
      Nuevo
    </Badge>
  )
}
