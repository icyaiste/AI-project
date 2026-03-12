import { createProduct, getProduct, getProducts, removeProduct, replaceProduct, updateProduct } from "../services/product.service.js";
export const listProducts = (_req, res) => {
    res.json({
        products: getProducts()
    });
};
export const getProductById = (req, res) => {
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
export const createProductHandler = (req, res) => {
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
export const replaceProductHandler = (req, res) => {
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
export const updateProductHandler = (req, res) => {
    const result = updateProduct(req.params.id, req.body);
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
export const deleteProductHandler = (req, res) => {
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
