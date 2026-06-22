const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");

describe("Authentication and authorization middleware", () => {
  it("rejects missing token", async () => {
    const response = await request(app).get("/users/profile");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("rejects invalid token", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", "Bearer invalid.token.value");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("rejects expired token", async () => {
    const expiredToken = jwt.sign(
      {
        id: 1,
        email: "expired@test.local",
        role: "user",
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "-1s" }
    );

    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("rejects wrong role", async () => {
    const { token } = await global.testDb.createTestUser({
      name: "Wrong Role User",
      email: "wrong-role@test.local",
      role: "user",
    });

    const response = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Electronics" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
});
