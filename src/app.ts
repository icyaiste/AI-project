import express, { type Request, type Response } from "express";
import cors from "cors";

import healthRouter from "./routes/health.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();
const corsOptions = {
  origin: "https://sundsgarden-rules.lovable.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Express server is running"
  });
});

app.use("/api/health", healthRouter);
app.use("/api/products", productRouter);

export default app;
