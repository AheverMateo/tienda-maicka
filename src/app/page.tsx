import { Suspense } from "react";
import { Catalog } from "@/components/product/catalog";
import { getProducts } from "@/lib/supabase/queries";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-28 sm:px-6">
      <Suspense fallback={<CatalogSkeleton />}>
        <ProductCatalog />
      </Suspense>

      <footer className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">
        Catálogo demo — el pedido se coordina por WhatsApp.
      </footer>
    </main>
  );
}

async function ProductCatalog() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        Todavía no hay productos cargados.
      </p>
    );
  }

  return <Catalog products={products} />;
}

function CatalogSkeleton() {
  return (
    <div className="pt-7">
      <div className="h-12 w-3/4 animate-pulse rounded-lg bg-secondary" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-secondary" />
      <div className="mt-6 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 w-28 shrink-0 animate-pulse rounded-[var(--radius-story)] bg-secondary"
          />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-secondary" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
