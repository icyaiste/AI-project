import { type Request, type Response } from "express";

import {
  createProduct,
  getProduct,
  getProducts,
  removeProduct,
  replaceProduct,
  updateProduct
} from "../services/product.service.js";

export const listProducts = (_req: Request, res: Response): void => {
  res.json({
    products: getProducts()
  });
};

export const getProductById = (req: Request, res: Response): void => {
  const result = getProduct(req.params.id);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.error
    });
    return;
  }

  res.json({
    product: result.data
  });
};

export const createProductHandler = (req: Request, res: Response): void => {
  const result = createProduct(req.body);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.error
    });
    return;
  }

  res.status(201).json({
    message: "Product created",
    product: result.data
  });
};

export const replaceProductHandler = (req: Request, res: Response): void => {
  const result = replaceProduct(req.params.id, req.body);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.error
    });
    return;
  }

  res.json({
    message: "Product replaced",
    product: result.data
  });
};

export const updateProductHandler = (req: Request, res: Response): void => {
  const result = updateProduct(req.params.id, req.body as Record<string, unknown>);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.error
    });
    return;
  }

  res.json({
    message: "Product updated",
    product: result.data
  });
};

export const deleteProductHandler = (req: Request, res: Response): void => {
  const result = removeProduct(req.params.id);

  if (!result.ok) {
    res.status(result.status).json({
      message: result.error
    });
    return;
  }

  res.json({
    message: "Product deleted",
    product: result.data
  });
};
