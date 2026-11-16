"use client"

import { useState } from "react"
import Image from "next/image"
import { Shirt } from "lucide-react"
import { NuevoBadge } from "@/components/product/nuevo-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    <Card
      id={`p-${product.id}`}
      className="gap-0 overflow-hidden rounded-[var(--radius-card)] border-border py-0 scroll-mt-24 transition-[transform,box-shadow] duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
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
            <Shirt className="size-9" strokeWidth={1.5} />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Foto a la brevedad
            </span>
          </div>
        )}

        {product.featured && !isSoldOut && (
          <NuevoBadge className="absolute left-2 top-2 px-2.5 py-0.5" />
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="font-heading text-lg font-extrabold uppercase tracking-wide text-white">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          {product.category && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.name}
          </h3>
        </div>

        <p className="font-heading text-lg font-bold tabular-nums">
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
                    "h-11 min-w-11 rounded-[var(--radius-md)] border border-border bg-transparent px-2.5 text-sm font-medium transition-colors",
                    "hover:border-primary hover:text-primary",
                    "focus-visible:outline-3 focus-visible:outline-ring",
                    "disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through",
                    selected &&
                      "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
                  )}
                >
                  {variant.talle}
                </button>
              )
            })}
          </div>
        )}

        <Button
          className="mt-auto h-11 w-full rounded-xl text-[15px] font-bold"
          disabled={isSoldOut}
          onClick={handleAdd}
        >
          {isSoldOut ? "No disponible" : "Agregar al pedido"}
        </Button>
      </div>
    </Card>
  )
}
