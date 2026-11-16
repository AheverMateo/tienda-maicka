"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Shirt, Search } from "lucide-react"
import { NuevoBadge } from "@/components/product/nuevo-badge"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product/product-card"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ProductCard as ProductWithRelations } from "@/lib/supabase/queries"

const ALL = "Todo"

const STEPS = [
  "Elegí tus productos",
  "Armá el pedido",
  "Lo cerramos por WhatsApp",
]

export function Catalog({ products }: { products: ProductWithRelations[] }) {
  const { count, total, setOpen } = useCart()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>(ALL)

  const categories = useMemo(() => {
    const byName = new Map<string, number>()
    for (const p of products) {
      if (p.category?.name) {
        byName.set(p.category.name, p.category.order_index ?? 999)
      }
    }
    const sorted = [...byName.entries()]
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0], "es"))
      .map(([name]) => name)
    return [ALL, ...sorted]
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

  const envelopePicks = featured.slice(0, 2)

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
      <header className="pt-6">
        <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Novedades y catálogo
        </h1>
        <p className="mt-2 max-w-[48ch] text-muted-foreground">
          Elegí, armá tu pedido y la dueña te lo confirma por WhatsApp.
        </p>
      </header>

      {envelopePicks.length > 0 && (
        <section
          aria-label="Recién llegado"
          className="mt-5 overflow-hidden rounded-[var(--radius-card)] border border-kraft-deep bg-kraft"
        >
          <div className="relative flex flex-col gap-4 p-4 pb-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <div className="relative flex h-44 shrink-0 items-end justify-center sm:h-48 sm:w-64">
              {envelopePicks[0] && (
                <button
                  type="button"
                  onClick={() => focusProduct(envelopePicks[0].id)}
                  aria-label={`Ver ${envelopePicks[0].name}`}
                  className="absolute bottom-6 left-2 z-10 w-24 -rotate-6 rounded-sm bg-[#fffdf6] p-1 pb-3 shadow-[0_6px_14px_-6px_rgba(40,35,30,0.5)] transition-transform duration-200 motion-safe:hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-ring"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-secondary">
                    {envelopePicks[0].product_images[0] ? (
                      <Image
                        src={
                          envelopePicks[0].product_images.find(
                            (i) => i.is_primary,
                          )?.url ?? envelopePicks[0].product_images[0].url
                        }
                        alt={envelopePicks[0].name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Shirt className="size-7" strokeWidth={1.25} />
                      </span>
                    )}
                  </span>
                </button>
              )}
              {envelopePicks[1] && (
                <button
                  type="button"
                  onClick={() => focusProduct(envelopePicks[1].id)}
                  aria-label={`Ver ${envelopePicks[1].name}`}
                  className="absolute bottom-2 right-2 z-10 w-24 rotate-[5deg] rounded-sm bg-[#fffdf6] p-1 pb-3 shadow-[0_6px_14px_-6px_rgba(40,35,30,0.5)] transition-transform duration-200 motion-safe:hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-ring"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-secondary">
                    {envelopePicks[1].product_images[0] ? (
                      <Image
                        src={
                          envelopePicks[1].product_images.find(
                            (i) => i.is_primary,
                          )?.url ?? envelopePicks[1].product_images[0].url
                        }
                        alt={envelopePicks[1].name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Shirt className="size-7" strokeWidth={1.25} />
                      </span>
                    )}
                  </span>
                </button>
              )}
              <div
                aria-hidden
                className="absolute bottom-0 h-16 w-full rounded-[var(--radius-ticket)] border border-kraft-deep bg-[#efe4c8] shadow-[inset_0_2px_0_rgba(0,0,0,0.08)] [clip-path:polygon(0_22%,50%_0,100%_22%,100%_100%,0_100%)]"
              />
            </div>

            <div className="relative">
              <span className="inline-block -rotate-2 rounded-[var(--radius-ticket)] border-2 border-sello-blue px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sello-blue">
                Recién llegado
              </span>
              <h2 className="mt-2 font-heading text-xl font-extrabold leading-tight text-[#4a3f2a] sm:text-2xl">
                Lo último que se cargó, directo del mostrador.
              </h2>
              <p className="mt-1 max-w-[36ch] text-sm leading-snug text-[#5d5340]">
                Mirá las fichas nuevas y armá tu pedido abajo.
              </p>
            </div>
          </div>
        </section>
      )}

      <ol
        aria-label="Cómo comprar"
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"
      >
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-2 rounded-[var(--radius-ticket)] border border-dashed border-border bg-card px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground sm:text-xs"
          >
            <span
              aria-hidden
              className="flex size-5 items-center justify-center rounded-full bg-sello-blue text-[10px] font-extrabold tabular-nums text-sello-blue-foreground"
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center justify-between gap-3 border-b border-dashed border-border pb-1.5">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
          Fichas
        </h2>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {products.length} en el mueble
        </span>
      </div>

      {featured.length > 0 ? (
        <div className="-mx-4 overflow-x-auto border-b border-dashed border-border px-4 pb-3 pt-2 sm:-mx-6 sm:px-6">
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
                  className="w-24 shrink-0 text-left focus-visible:outline-3 focus-visible:outline-ring sm:w-28"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-ticket)] border border-border bg-secondary">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={p.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex h-full w-full items-center justify-center text-muted-foreground"
                      >
                        <Shirt className="size-7" strokeWidth={1.25} />
                      </span>
                    )}
                    <NuevoBadge className="absolute left-1 top-1 size-9" />
                  </span>
                  <span className="mt-1 line-clamp-1 block text-[11px] font-semibold">
                    {p.name}
                  </span>
                  <span className="block text-[10px] tabular-nums text-muted-foreground">
                    {formatPrice(p.price)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay fichas nuevas.
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
            placeholder="Buscar la ficha: remera, jean, gorra..."
            aria-label="Buscar productos"
            className="h-12 rounded-[var(--radius-ticket)] border-border bg-card pl-11 text-[15px] shadow-[inset_0_2px_3px_rgba(40,35,30,0.12)] placeholder:text-muted-foreground"
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
                  "h-10 shrink-0 rounded-[var(--radius-ticket)] border border-dashed border-border bg-card px-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
                  "hover:border-foreground hover:text-foreground",
                  "focus-visible:outline-3 focus-visible:outline-ring",
                  active &&
                    "border-solid border-primary bg-primary text-primary-foreground shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] hover:text-primary-foreground",
                )}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-heading text-base font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
            Sin fichas así
          </p>
          <p className="max-w-[36ch] text-sm text-muted-foreground">
            No encontramos nada con eso. Probá con otra palabra o categoría.
          </p>
        </div>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-kraft-deep bg-kraft pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 border-t border-dashed border-kraft-deep/80"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-auto flex h-12 w-full max-w-lg items-center justify-center gap-3 rounded-[var(--radius-ticket)] bg-primary px-4 font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-primary-foreground shadow-[inset_0_-3px_0_rgba(0,0,0,0.25)] transition-colors hover:bg-primary/90 focus-visible:outline-3 focus-visible:outline-ring"
          >
            <span className="tabular-nums">Ver pedido · {count}</span>
            <span aria-hidden className="opacity-60">·</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </button>
        </div>
      )}
    </>
  )
}
