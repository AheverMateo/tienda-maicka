import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/supabase/queries";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-1 text-muted-foreground">
          Elegí tus productos y pedí por WhatsApp.
        </p>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}

async function ProductGrid() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        Todavía no hay productos cargados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="aspect-square w-full animate-pulse bg-secondary" />
          <div className="flex flex-col gap-2 p-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}
