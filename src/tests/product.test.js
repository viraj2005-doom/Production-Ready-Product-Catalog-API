const request = require("supertest");
const app = require("../app");

describe("Product routes", () => {
  const validProduct = (categoryId) => ({
    name: "MacBook Pro M4",
    description: "Apple Laptop",
    price: 199999,
    stock_quantity: 10,
    category_id: categoryId,
  });

  const createAdmin = () => {
    return global.testDb.createTestUser({
      name: "Admin User",
      email: "admin@test.local",
      role: "Admin",
    });
  };

  const createUser = () => {
    return global.testDb.createTestUser({
      name: "Normal User",
      email: "user@test.local",
      role: "user",
    });
  };

  it("creates a product as admin", async () => {
    const { token } = await createAdmin();
    const category = await global.testDb.createTestCategory();

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(validProduct(category.id));

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "MacBook Pro M4",
      description: "Apple Laptop",
      stock_quantity: 10,
      category_id: category.id,
    });
    expect(Number(response.body.price)).toBe(199999);
  });

  it("forbids product creation as regular user", async () => {
    const { token } = await createUser();
    const category = await global.testDb.createTestCategory();

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(validProduct(category.id));

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("gets all products", async () => {
    const category = await global.testDb.createTestCategory();
    await global.testDb.createTestProduct({
      name: "iPhone 16",
      description: "Smartphone",
      category_id: category.id,
    });

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0]).toMatchObject({
      name: "iPhone 16",
      description: "Smartphone",
      category_id: category.id,
    });
  });

  it("gets a product by id", async () => {
    const product = await global.testDb.createTestProduct({
      name: "ThinkPad X1",
    });

    const response = await request(app).get(`/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: product.id,
      name: "ThinkPad X1",
    });
  });

  it("updates a product as admin", async () => {
    const { token } = await createAdmin();
    const category = await global.testDb.createTestCategory();
    const product = await global.testDb.createTestProduct({
      category_id: category.id,
    });

    const response = await request(app)
      .put(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated MacBook",
        description: "Updated laptop",
        price: 189999,
        stock_quantity: 8,
        category_id: category.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: product.id,
      name: "Updated MacBook",
      description: "Updated laptop",
      stock_quantity: 8,
    });
    expect(Number(response.body.price)).toBe(189999);
  });

  it("deletes a product as admin", async () => {
    const { token } = await createAdmin();
    const product = await global.testDb.createTestProduct();

    const response = await request(app)
      .delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted");
    expect(response.body.product.id).toBe(product.id);
  });

  it("rejects validation failures", async () => {
    const { token } = await createAdmin();

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "",
        price: -1,
        stock_quantity: -2,
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Product name is required" }),
        expect.objectContaining({ msg: "Price must be positive" }),
        expect.objectContaining({ msg: "Stock quantity must be positive" }),
      ]),
    );
  });

  it("rejects unauthorized create requests", async () => {
    const category = await global.testDb.createTestCategory();

    const response = await request(app)
      .post("/products")
      .send(validProduct(category.id));

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });
});
