"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Shirt, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product/product-card"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ProductCard as ProductWithRelations } from "@/lib/supabase/queries"

const ALL = "Todo"

export function Catalog({ products }: { products: ProductWithRelations[] }) {
  const { count, total, setOpen } = useCart()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>(ALL)

  const categories = useMemo(() => {
    const names = new Set<string>()
    for (const p of products) {
      if (p.category?.name) names.add(p.category.name)
    }
    return [ALL, ...names]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = category === ALL || p.category?.name === category
      if (!matchesCategory) return false
      if (!q) return true
      const haystack = `${p.name} ${p.category?.name ?? ""}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [products, query, category])

  const featured = useMemo(
    () =>
      products.filter(
        (p) =>
          p.featured &&
          !p.off &&
          (p.type !== "ropa" ||
            p.variants.reduce((sum, v) => sum + v.stock, 0) > 0),
      ),
    [products],
  )

  const focusProduct = (id: string) => {
    setCategory(ALL)
    setQuery("")
    document.getElementById(`p-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  return (
    <>
      <header className="pt-7">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          Novedades y catálogo
        </h1>
        <p className="mt-2 max-w-[46ch] text-muted-foreground">
          Todo lo que subimos, ordenado en un solo lugar. Elegí, armá tu
          pedido y lo enviamos por WhatsApp.
        </p>
      </header>

      <div className="mt-6 flex items-baseline gap-3">
        <h2 className="font-heading text-xl font-bold">Recién llegado</h2>
        <span className="text-sm text-muted-foreground">
          lo último que se cargó
        </span>
      </div>

      {featured.length > 0 ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-3 pt-2 [scroll-snap-type:x_mandatory] sm:-mx-6 sm:px-6">
          <div className="flex w-max gap-3">
            {featured.map((p) => {
              const image =
                p.product_images.find((img) => img.is_primary) ??
                p.product_images[0]
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => focusProduct(p.id)}
                  className="w-28 shrink-0 text-left [scroll-snap-align:start] focus-visible:outline-3 focus-visible:outline-ring sm:w-32"
                >
                  <span className="relative block h-40 overflow-hidden rounded-[var(--radius-story)] border-2 border-hi bg-secondary sm:h-44">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={p.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground"
                      >
                        <Shirt className="size-8" strokeWidth={1.5} />
                      </span>
                    )}
                    <Badge className="absolute left-2 top-2 rounded-full bg-hi px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-hi-foreground">
                      Nuevo
                    </Badge>
                  </span>
                  <span className="mt-1.5 block line-clamp-2 text-[13px] font-semibold leading-tight">
                    {p.name}
                  </span>
                  <span className="block text-xs tabular-nums text-muted-foreground">
                    {formatPrice(p.price)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay novedades.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar: remera, jean, gorra..."
            aria-label="Buscar productos"
            className="h-12 rounded-xl border-input bg-card pl-11 text-[15px]"
          />
        </div>

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
          role="group"
          aria-label="Categorías"
        >
          {categories.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={cn(
                  "h-9 shrink-0 rounded-[var(--radius-chip)] border border-border bg-card px-4 text-sm font-medium transition-colors",
                  "hover:border-primary hover:text-primary",
                  "focus-visible:outline-3 focus-visible:outline-ring",
                  active &&
                    "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
                )}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-[var(--radius-card)] border border-dashed border-border py-12 text-center text-muted-foreground">
          No encontramos nada con eso. Probá con otra palabra o categoría.
        </p>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto flex h-12 w-full max-w-lg items-center justify-center rounded-xl bg-primary font-bold tabular-nums text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-3 focus-visible:outline-ring"
          >
            Ver pedido ({count}) · {formatPrice(total)}
          </button>
        </div>
      )}
    </>
  )
}
