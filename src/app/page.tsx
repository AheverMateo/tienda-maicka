import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    slug: string;
    type: string;
    off: boolean;
    featured: boolean;
  }>>([]));
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let querySupabase = supabase.from("products").select(`
        *,
        variants!inner (talle, stock)
      `);

      // Filtrar por búsqueda
      if (query) {
        querySupabase = querySupabase.ilike("name", `%${query}%`);
      }

      const { data, error } = await querySupabase.eq("off", false);

      if (error) throw error;
      setProducts(data || []);

      // Obtener categorías
      const { data: cats, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("order_index");

      if (catError) throw catError;
      setCategories(cats || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Cargando productos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={fetchProducts}>Reintentar</Button>
      </div>
    );
  }

  // Filtrar por categoría
  const filteredProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  const productsByCategory = new Map(
    categories.map((cat) => [cat.slug, products.filter((p) => p.type === cat.slug || cat.slug === "otros")])
  );

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header con búsqueda */}
        <header className="mb-8 flex flex-col sm:flex-row items-start gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight color-ink">
              Catálogo de Products
            </h1>
            <p className="mt-1 color-muted">
              Explora nuestros productos disponibles
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => {
                const q = e.target.value;
                if (q) {
                  router.push(`?q=${q}`);
                } else {
                  router.push("/");
                }
              }}
            />
          </div>
        </header>

        {/* Filtros por categoría */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Button variant="outline" className="flex-1">
            Todas
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant="outline"
              className="flex-1"
              onClick={() => router.push(`?category=${cat.slug}`)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Encontrar talle con stock
            const variantWithStock = product.variants?.find((v: any) => v.stock > 0);
            const talleDisponible = variantWithStack
              ? variantWithStock.talle
              : "Único";

            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src="/placeholder-product.jpg"
                    alt={product.name}
                    width={400}
                    height={250}
                    className="aspect-square w-full object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <p className="mt-2 color-muted text-sm line-clamp-1">
                    {product.description || "Sin descripción"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold">
                      ${product.price / 100}
                    </span>
                    {product.off ? (
                      <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                        Agotado
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          // Abrir WhatsApp con el pedido
                          const phone = "+549341xxxxxxx"; // Número de la tía
                          const message = `Hola, me interesa pedir: ${product.name}`;
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
                        }}
                      >
                        Pedir por WhatsApp
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado de stock */}
        <div className="mt-8 pt-8 border-t color-muted">
          <p className="text-sm color-muted">
            {" "}
            {" "}
            <strong>{products.length} productos disponibles</strong>
          </p>
        </div>
      </div>
    </main>
  );
}