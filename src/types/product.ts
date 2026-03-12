export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
}

export interface ProductPayload {
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
}

export type ProductPatchPayload = Partial<ProductPayload>;
