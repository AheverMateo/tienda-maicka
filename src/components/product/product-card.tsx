"use client"

import { useState } from "react"
import Image from "next/image"
import { Shirt } from "lucide-react"
import { NuevoBadge } from "@/components/product/nuevo-badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ProductCard as ProductWithRelations } from "@/lib/supabase/queries"

type ProductCardProps = {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, notify } = useCart()
  const [selectedTalle, setSelectedTalle] = useState<string | null>(null)

  const image =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0]

  const isRopa = product.type === "ropa"
  const variants = product.variants
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const isSoldOut = product.off || (isRopa && totalStock <= 0)

  const handleAdd = () => {
    if (isRopa) {
      if (!selectedTalle) {
        notify("Elegí un talle primero")
        return
      }
      const stock = variants.find((v) => v.talle === selectedTalle)?.stock
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        talle: selectedTalle,
        maxStock: stock,
      })
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
      })
    }
    notify("Agregado al pedido")
  }

  return (
    <article
      id={`p-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card shadow-[0_1px_0_0_var(--border)] scroll-mt-24 transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(40,35,30,0.45)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-dashed border-border bg-secondary">
        <span
          aria-hidden
          className="absolute left-1.5 top-1.5 size-4 border-l-2 border-t-2 border-foreground/40"
        />
        <span
          aria-hidden
          className="absolute right-1.5 top-1.5 size-4 border-r-2 border-t-2 border-foreground/40"
        />
        <span
          aria-hidden
          className="absolute bottom-1.5 left-1.5 size-4 border-b-2 border-l-2 border-foreground/40"
        />
        <span
          aria-hidden
          className="absolute bottom-1.5 right-1.5 size-4 border-b-2 border-r-2 border-foreground/40"
        />

        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground"
          >
            <Shirt className="size-10" strokeWidth={1.25} />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
              Foto a la brevedad
            </span>
          </div>
        )}

        {product.featured && !isSoldOut && (
          <NuevoBadge className="absolute left-2 top-2" />
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="-rotate-6 rounded-[var(--radius-ticket)] border-[3px] border-destructive bg-card/85 px-4 py-1.5 font-heading text-lg font-extrabold uppercase tracking-[0.15em] text-destructive">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
        <div>
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-sello-blue">
              {product.category.name}
            </span>
          )}
          <h3 className="line-clamp-2 font-heading text-[13px] font-bold leading-snug sm:text-sm">
            {product.name}
          </h3>
        </div>

        <p className="font-heading text-lg font-extrabold tabular-nums leading-none tracking-tight sm:text-xl">
          {formatPrice(product.price)}
        </p>

        {isRopa && variants.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Talle">
            {variants.map((variant) => {
              const out = variant.stock <= 0
              const selected = selectedTalle === variant.talle
              return (
                <button
                  key={variant.talle}
                  type="button"
                  disabled={out || isSoldOut}
                  aria-pressed={selected}
                  onClick={() => setSelectedTalle(variant.talle)}
                  className={cn(
                    "h-11 min-w-11 rounded-[var(--radius-ticket)] border border-dashed border-border bg-transparent px-2.5 font-mono text-sm font-semibold transition-colors",
                    "hover:border-primary hover:text-primary",
                    "focus-visible:outline-3 focus-visible:outline-ring",
                    "disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through",
                    selected &&
                      "border-solid border-primary bg-primary text-primary-foreground shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] hover:text-primary-foreground",
                  )}
                >
                  {variant.talle}
                </button>
              )
            })}
          </div>
        )}

        <Button
          className="mt-auto h-11 w-full rounded-[var(--radius-ticket)] border border-primary-foreground/20 bg-primary text-sm font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-[inset_0_-3px_0_rgba(0,0,0,0.25)] hover:bg-primary/90"
          disabled={isSoldOut}
          onClick={handleAdd}
        >
          {isSoldOut ? "No disponible" : "Al pedido"}
        </Button>
      </div>
    </article>
  )
}
