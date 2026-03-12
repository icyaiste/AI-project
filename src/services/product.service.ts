import {
  createProduct as createProductRecord,
  deleteProduct as deleteProductRecord,
  findProductById,
  listProducts,
  replaceProduct as replaceProductRecord,
  resetProducts,
  updateProduct as updateProductRecord
} from "../repositories/product.repository.js";
import { type Product, type ProductPatchPayload, type ProductPayload } from "../types/product.js";

type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

const parseProductId = (value: string | string[] | undefined): number => {
  if (typeof value !== "string") {
    return Number.NaN;
  }

  return Number.parseInt(value, 10);
};

const validatePrice = (price: unknown): price is number =>
  typeof price === "number" && !Number.isNaN(price) && price >= 0;

const validateId = (value: string | string[] | undefined): ServiceResult<number> => {
  const productId = parseProductId(value);

  if (!Number.isInteger(productId)) {
    return {
      ok: false,
      error: "Product not found",
      status: 404
    };
  }

  return {
    ok: true,
    data: productId
  };
};

export const getProducts = (): Product[] => listProducts();

export const getProduct = (idParam: string | string[] | undefined): ServiceResult<Product> => {
  const parsedId = validateId(idParam);

  if (!parsedId.ok) {
    return parsedId;
  }

  const product = findProductById(parsedId.data);

  if (!product) {
    return {
      ok: false,
      error: "Product not found",
      status: 404
    };
  }

  return {
    ok: true,
    data: product
  };
};

export const createProduct = (payload: Partial<ProductPayload>): ServiceResult<Product> => {
  const {
    name,
    price,
    currency = "USD",
    inStock = true
  } = payload;

  if (!name || typeof name !== "string") {
    return {
      ok: false,
      error: "Product name is required",
      status: 400
    };
  }

  if (!validatePrice(price)) {
    return {
      ok: false,
      error: "Product price must be a non-negative number",
      status: 400
    };
  }

  if (!currency || typeof currency !== "string") {
    return {
      ok: false,
      error: "Product currency must be a non-empty string",
      status: 400
    };
  }

  if (typeof inStock !== "boolean") {
    return {
      ok: false,
      error: "Product inStock must be a boolean",
      status: 400
    };
  }

  return {
    ok: true,
    data: createProductRecord({
      name: name.trim(),
      price,
      currency,
      inStock
    })
  };
};

export const replaceProduct = (
  idParam: string | string[] | undefined,
  payload: Partial<ProductPayload>
): ServiceResult<Product> => {
  const parsedId = validateId(idParam);

  if (!parsedId.ok) {
    return parsedId;
  }

  const { name, price, currency, inStock } = payload;

  if (!name || typeof name !== "string") {
    return {
      ok: false,
      error: "Product name is required",
      status: 400
    };
  }

  if (!validatePrice(price)) {
    return {
      ok: false,
      error: "Product price must be a non-negative number",
      status: 400
    };
  }

  if (!currency || typeof currency !== "string") {
    return {
      ok: false,
      error: "Product currency is required",
      status: 400
    };
  }

  if (typeof inStock !== "boolean") {
    return {
      ok: false,
      error: "Product inStock must be a boolean",
      status: 400
    };
  }

  const product = replaceProductRecord(parsedId.data, {
    name: name.trim(),
    price,
    currency,
    inStock
  });

  if (!product) {
    return {
      ok: false,
      error: "Product not found",
      status: 404
    };
  }

  return {
    ok: true,
    data: product
  };
};

export const updateProduct = (
  idParam: string | string[] | undefined,
  payload: Record<string, unknown>
): ServiceResult<Product> => {
  const parsedId = validateId(idParam);

  if (!parsedId.ok) {
    return parsedId;
  }

  const allowedFields = ["name", "price", "currency", "inStock"];
  const requestFields = Object.keys(payload);
  const hasUnknownFields = requestFields.some((field) => !allowedFields.includes(field));

  if (requestFields.length === 0) {
    return {
      ok: false,
      error: "At least one product field is required",
      status: 400
    };
  }

  if (hasUnknownFields) {
    return {
      ok: false,
      error: "Request contains unsupported product fields",
      status: 400
    };
  }

  const productPatch = payload as ProductPatchPayload;

  if (productPatch.name !== undefined) {
    if (!productPatch.name || typeof productPatch.name !== "string") {
      return {
        ok: false,
        error: "Product name must be a non-empty string",
        status: 400
      };
    }

    productPatch.name = productPatch.name.trim();
  }

  if (productPatch.price !== undefined && !validatePrice(productPatch.price)) {
    return {
      ok: false,
      error: "Product price must be a non-negative number",
      status: 400
    };
  }

  if (productPatch.currency !== undefined) {
    if (!productPatch.currency || typeof productPatch.currency !== "string") {
      return {
        ok: false,
        error: "Product currency must be a non-empty string",
        status: 400
      };
    }
  }

  if (productPatch.inStock !== undefined && typeof productPatch.inStock !== "boolean") {
    return {
      ok: false,
      error: "Product inStock must be a boolean",
      status: 400
    };
  }

  const product = updateProductRecord(parsedId.data, productPatch);

  if (!product) {
    return {
      ok: false,
      error: "Product not found",
      status: 404
    };
  }

  return {
    ok: true,
    data: product
  };
};

export const removeProduct = (idParam: string | string[] | undefined): ServiceResult<Product> => {
  const parsedId = validateId(idParam);

  if (!parsedId.ok) {
    return parsedId;
  }

  const product = deleteProductRecord(parsedId.data);

  if (!product) {
    return {
      ok: false,
      error: "Product not found",
      status: 404
    };
  }

  return {
    ok: true,
    data: product
  };
};

export const resetProductStore = (): void => {
  resetProducts();
};
