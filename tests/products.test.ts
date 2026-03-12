import assert from "node:assert/strict";

import request from "supertest";

import app from "../src/app.js";
import { resetProductStore } from "../src/services/product.service.js";

const runTest = async (name: string, testFn: () => Promise<void>): Promise<void> => {
  resetProductStore();

  try {
    await testFn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
};

const main = async (): Promise<void> => {
  await runTest("GET /api/products returns the seeded product list", async () => {
    const response = await request(app).get("/api/products");

    assert.equal(response.status, 200);
    assert.equal(response.body.products.length, 3);
    assert.deepEqual(response.body.products[0], {
      id: 1,
      name: "Wireless Mouse",
      price: 24.99,
      currency: "USD",
      inStock: true
    });
  });

  await runTest("GET /api/products/:id returns a single product", async () => {
    const response = await request(app).get("/api/products/2");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.product, {
      id: 2,
      name: "Mechanical Keyboard",
      price: 89.99,
      currency: "USD",
      inStock: true
    });
  });

  await runTest("POST /api/products creates a new product", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        name: "Laptop Stand",
        price: 49.99,
        currency: "USD",
        inStock: true
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.message, "Product created");
    assert.deepEqual(response.body.product, {
      id: 4,
      name: "Laptop Stand",
      price: 49.99,
      currency: "USD",
      inStock: true
    });
  });

  await runTest("PUT /api/products/:id replaces an existing product", async () => {
    const response = await request(app)
      .put("/api/products/2")
      .send({
        name: "Mechanical Keyboard V2",
        price: 99.99,
        currency: "USD",
        inStock: false
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.message, "Product replaced");
    assert.deepEqual(response.body.product, {
      id: 2,
      name: "Mechanical Keyboard V2",
      price: 99.99,
      currency: "USD",
      inStock: false
    });
  });

  await runTest("PATCH /api/products/:id partially updates an existing product", async () => {
    const response = await request(app)
      .patch("/api/products/1")
      .send({
        price: 29.99,
        inStock: false
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.message, "Product updated");
    assert.deepEqual(response.body.product, {
      id: 1,
      name: "Wireless Mouse",
      price: 29.99,
      currency: "USD",
      inStock: false
    });
  });

  await runTest("DELETE /api/products/:id removes an existing product", async () => {
    const response = await request(app).delete("/api/products/3");

    assert.equal(response.status, 200);
    assert.equal(response.body.message, "Product deleted");
    assert.deepEqual(response.body.product, {
      id: 3,
      name: "USB-C Hub",
      price: 39.99,
      currency: "USD",
      inStock: false
    });
  });
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
