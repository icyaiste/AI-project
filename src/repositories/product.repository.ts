import { type Product, type ProductPatchPayload, type ProductPayload } from "../types/product.js";

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 24.99,
    currency: "USD",
    inStock: true
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99,
    currency: "USD",
    inStock: true
  },
  {
    id: 3,
    name: "USB-C Hub",
    price: 39.99,
    currency: "USD",
    inStock: false
  }
];

let products: Product[] = structuredClone(initialProducts);

const getNextProductId = (): number => {
  if (products.length === 0) {
    return 1;
  }

  return Math.max(...products.map((product) => product.id)) + 1;
};

export const listProducts = (): Product[] => products;

export const findProductById = (id: number): Product | undefined =>
  products.find((product) => product.id === id);

export const createProduct = (payload: ProductPayload): Product => {
  const product: Product = {
    id: getNextProductId(),
    ...payload
  };

  products.push(product);

  return product;
};

export const replaceProduct = (id: number, payload: ProductPayload): Product | undefined => {
  const product = findProductById(id);

  if (!product) {
    return undefined;
  }

  product.name = payload.name;
  product.price = payload.price;
  product.currency = payload.currency;
  product.inStock = payload.inStock;

  return product;
};

export const updateProduct = (id: number, payload: ProductPatchPayload): Product | undefined => {
  const product = findProductById(id);

  if (!product) {
    return undefined;
  }

  if (payload.name !== undefined) {
    product.name = payload.name;
  }

  if (payload.price !== undefined) {
    product.price = payload.price;
  }

  if (payload.currency !== undefined) {
    product.currency = payload.currency;
  }

  if (payload.inStock !== undefined) {
    product.inStock = payload.inStock;
  }

  return product;
};

export const deleteProduct = (id: number): Product | undefined => {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return undefined;
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return deletedProduct;
};

export const resetProducts = (): void => {
  products = structuredClone(initialProducts);
};
