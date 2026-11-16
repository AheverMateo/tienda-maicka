import { createServerClient } from "./server";
import type {
  Category,
  Product,
  ProductImage,
  Variant,
} from "@/lib/database.types";

export type ProductCard = Product & {
  variants: Pick<Variant, "talle" | "stock">[];
  product_images: Pick<ProductImage, "url" | "is_primary" | "order_index">[];
  category: Pick<Category, "id" | "name" | "slug" | "order_index"> | null;
};

export async function getProducts(): Promise<ProductCard[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, variants(talle, stock), product_images(url, is_primary, order_index), category:categories(id, name, slug, order_index)",
    )
    .eq("off", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los productos: ${error.message}`);
  }

  return (data ?? []) as unknown as ProductCard[];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
  }

  return (data ?? []) as Category[];
}
