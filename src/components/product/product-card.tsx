import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { ProductCard as ProductWithRelations } from "@/lib/supabase/queries";

type ProductCardProps = {
  product: ProductWithRelations;
};

export function ProductCard({ product }: ProductCardProps) {
  const image =
    product.product_images.find((img) => img.is_primary) ??
    product.product_images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isSoldOut = totalStock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors">
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <ImageOff aria-hidden className="size-8" />
          </div>
        )}

        {isSoldOut && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.category && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          {product.name}
        </h3>
        <span className="mt-auto pt-2 font-heading text-lg font-bold">
          {formatPrice(product.price)}
        </span>
      </div>
    </article>
  );
}
