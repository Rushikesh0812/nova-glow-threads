export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  subcategory: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  rating_average: number;
  rating_count: number;
  is_featured: boolean;
  is_new: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
};
