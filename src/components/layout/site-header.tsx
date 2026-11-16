import Link from "next/link"
import { Search, ShoppingCart } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 flex-col rounded-md focus-visible:outline-3 focus-visible:outline-ring"
          >
            <span className="font-heading text-2xl font-extrabold leading-none tracking-tight">
              Catálogo<span className="text-primary">.</span>
            </span>
            <span className="mt-1 hidden text-[11px] font-medium leading-none text-muted-foreground sm:block">
              indumentaria · bazar · regalos
            </span>
          </Link>

          <form
            role="search"
            action="/"
            method="get"
            className="relative hidden w-full max-w-xl md:block"
          >
            <Search
              aria-hidden
              strokeWidth={2}
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </form>

          <button
            type="button"
            disabled
            aria-label="Carrito (próximamente)"
            title="Carrito disponible próximamente"
            className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring disabled:cursor-not-allowed"
          >
            <ShoppingCart aria-hidden strokeWidth={1.75} className="size-6" />
            <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold leading-none text-primary-foreground">
              0
            </span>
          </button>
        </div>

        <div className="pb-3 md:hidden">
          <form role="search" action="/" method="get" className="relative">
            <Search
              aria-hidden
              strokeWidth={2}
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              name="q"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </form>
        </div>
      </div>
    </header>
  )
}
