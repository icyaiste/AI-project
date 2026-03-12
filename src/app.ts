import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "https://sundsgarden-rules.lovable.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
}

interface ProductPayload {
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
}

type ProductPatchPayload = Partial<ProductPayload>;

const products: Product[] = [
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

app.use(cors(corsOptions));
app.use(express.json());

const getNextProductId = (): number => {
  if (products.length === 0) {
    return 1;
  }

  return Math.max(...products.map((product) => product.id)) + 1;
};

const findProductById = (id: number): Product | undefined =>
  products.find((product) => product.id === id);

const parseProductId = (value: string | string[] | undefined): number => {
  if (typeof value !== "string") {
    return Number.NaN;
  }

  return Number.parseInt(value, 10);
};

const validatePrice = (price: unknown): price is number =>
  typeof price === "number" && !Number.isNaN(price) && price >= 0;

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Express server is running"
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok"
  });
});

app.get("/api/products", (_req: Request, res: Response) => {
  res.json({
    products
  });
});

app.get("/api/products/:id", (req: Request, res: Response) => {
  const productId = parseProductId(req.params.id);
  const product = findProductById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  return res.json({
    product
  });
});

app.post("/api/products", (req: Request, res: Response) => {
  const {
    name,
    price,
    currency = "SEK",
    inStock = true
  } = req.body as Partial<ProductPayload>;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "Product name is required"
    });
  }

  if (!validatePrice(price)) {
    return res.status(400).json({
      message: "Product price must be a non-negative number"
    });
  }

  const product = {
    id: getNextProductId(),
    name: name.trim(),
    price,
    currency,
    inStock
  };

  products.push(product);

  return res.status(201).json({
    message: "Product created",
    product
  });
});

app.put("/api/products/:id", (req: Request, res: Response) => {
  const productId = parseProductId(req.params.id);
  const product = findProductById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const { name, price, currency, inStock } = req.body as Partial<ProductPayload>;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "Product name is required"
    });
  }

  if (!validatePrice(price)) {
    return res.status(400).json({
      message: "Product price must be a non-negative number"
    });
  }

  if (!currency || typeof currency !== "string") {
    return res.status(400).json({
      message: "Product currency is required"
    });
  }

  if (typeof inStock !== "boolean") {
    return res.status(400).json({
      message: "Product inStock must be a boolean"
    });
  }

  product.name = name.trim();
  product.price = price;
  product.currency = currency;
  product.inStock = inStock;

  return res.json({
    message: "Product replaced",
    product
  });
});

app.patch("/api/products/:id", (req: Request, res: Response) => {
  const productId = parseProductId(req.params.id);
  const product = findProductById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const { name, price, currency, inStock } = req.body as ProductPatchPayload;
  const allowedFields = ["name", "price", "currency", "inStock"];
  const requestFields = Object.keys(req.body as Record<string, unknown>);
  const hasUnknownFields = requestFields.some((field) => !allowedFields.includes(field));

  if (requestFields.length === 0) {
    return res.status(400).json({
      message: "At least one product field is required"
    });
  }

  if (hasUnknownFields) {
    return res.status(400).json({
      message: "Request contains unsupported product fields"
    });
  }

  if (name !== undefined) {
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        message: "Product name must be a non-empty string"
      });
    }

    product.name = name.trim();
  }

  if (price !== undefined) {
    if (!validatePrice(price)) {
      return res.status(400).json({
        message: "Product price must be a non-negative number"
      });
    }

    product.price = price;
  }

  if (currency !== undefined) {
    if (!currency || typeof currency !== "string") {
      return res.status(400).json({
        message: "Product currency must be a non-empty string"
      });
    }

    product.currency = currency;
  }

  if (inStock !== undefined) {
    if (typeof inStock !== "boolean") {
      return res.status(400).json({
        message: "Product inStock must be a boolean"
      });
    }

    product.inStock = inStock;
  }

  return res.json({
    message: "Product updated",
    product
  });
});

app.delete("/api/products/:id", (req: Request, res: Response) => {
  const productId = parseProductId(req.params.id);
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return res.json({
    message: "Product deleted",
    product: deletedProduct
  });
});

export default app;
