"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"

export function SiteHeader() {
  const { count, total, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 flex-col rounded-md focus-visible:outline-3 focus-visible:outline-ring"
          >
            <span className="font-heading text-2xl font-extrabold leading-none tracking-tight">
              Catálogo<span className="text-primary">.</span>
            </span>
            <span className="mt-1 text-[11px] font-medium leading-none text-muted-foreground">
              indumentaria · bazar · regalos
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Hacer pedido o consulta"
            title="Hacer pedido o consulta"
            className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-ticket)] border border-border bg-card px-4 text-sm font-extrabold uppercase tracking-wider transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
          >
            <ShoppingCart aria-hidden strokeWidth={1.75} className="size-5" />
            <span className="hidden sm:inline">
              {count > 0 ? formatPrice(total) : "Pedido / consulta"}
            </span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-6 -rotate-6 items-center justify-center rounded-full border-2 border-hi-foreground/60 bg-hi text-[11px] font-extrabold leading-none text-hi-foreground tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
