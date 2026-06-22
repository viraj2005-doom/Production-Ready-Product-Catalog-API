const request = require("supertest");
const app = require("../app");

describe("Category routes", () => {
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

  it("creates a category as admin", async () => {
    const { token } = await createAdmin();

    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Electronics" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Electronics",
    });
  });

  it("forbids category creation as regular user", async () => {
    const { token } = await createUser();

    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Electronics" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("gets categories", async () => {
    await global.testDb.createTestCategory("Electronics");
    await global.testDb.createTestCategory("Books");

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((category) => category.name)).toEqual([
      "Electronics",
      "Books",
    ]);
  });

  it("updates a category as admin", async () => {
    const { token } = await createAdmin();
    const category = await global.testDb.createTestCategory("Electronics");

    const response = await request(app)
      .put(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Computers" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: category.id,
      name: "Computers",
    });
  });

  it("deletes a category as admin", async () => {
    const { token } = await createAdmin();
    const category = await global.testDb.createTestCategory("Electronics");

    const response = await request(app)
      .delete(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Category deleted successfully");
  });

  it("rejects validation failures", async () => {
    const { token } = await createAdmin();

    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "   " });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Category name is required");
  });
});
