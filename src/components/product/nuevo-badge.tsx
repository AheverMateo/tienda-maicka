import { cn } from "@/lib/utils"

export function NuevoBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label="Nuevo"
      className={cn(
        "inline-flex size-12 -rotate-6 flex-col items-center justify-center rounded-full bg-hi leading-none text-hi-foreground",
        "border-2 border-hi-foreground/70 shadow-[inset_0_0_0_2px_var(--hi)]",
        className,
      )}
    >
      <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest">
        Nuevo
      </span>
    </span>
  )
}
