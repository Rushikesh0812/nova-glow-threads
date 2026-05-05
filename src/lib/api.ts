import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/lib/types";

export async function fetchProducts(opts?: {
  category?: string;
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let q = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (opts?.category) q = q.eq("category", opts.category);
  if (opts?.featured) q = q.eq("is_featured", true);
  if (opts?.isNew) q = q.eq("is_new", true);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Product | null;
}
