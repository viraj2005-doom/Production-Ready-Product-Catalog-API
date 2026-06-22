const request = require("supertest");
const app = require("../app");

describe("Health endpoint", () => {
  it("GET /health returns 200 with service health payload", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "healthy",
      service: "product-catalog-api",
    });
  });
});
