const request = require("supertest");
const app = require("../app");

describe("Authentication routes", () => {
  const registerPayload = {
    name: "Viraj Patel",
    email: "viraj@test.local",
    password: "password123",
  };

  describe("POST /auth/register", () => {
    it("registers a new user successfully", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toMatchObject({
        name: registerPayload.name,
        email: registerPayload.email,
        role: "user",
      });
      expect(response.body.user.password).toBeUndefined();
    });

    it("rejects duplicate email", async () => {
      await request(app).post("/auth/register").send(registerPayload);

      const response = await request(app)
        .post("/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        status: "error",
        statusCode: 409,
        message: "Email already exists",
      });
    });

    it("rejects validation failure", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "",
        email: "not-an-email",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Name, email, and password are required",
      );
    });
  });

  describe("POST /auth/login", () => {
    it("logs in with valid credentials", async () => {
      await global.testDb.createTestUser(registerPayload);

      const response = await request(app).post("/auth/login").send({
        email: registerPayload.email,
        password: registerPayload.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
      expect(response.body.refreshToken).toEqual(expect.any(String));
      expect(response.body.user).toMatchObject({
        name: registerPayload.name,
        email: registerPayload.email,
        role: "user",
      });
    });

    it("rejects invalid password", async () => {
      await global.testDb.createTestUser(registerPayload);

      const response = await request(app).post("/auth/login").send({
        email: registerPayload.email,
        password: "wrong-password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("rejects user not found", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "missing@test.local",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("Protected route access", () => {
    it("rejects /users/profile without a token", async () => {
      const response = await request(app).get("/users/profile");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authorization header missing");
    });

    it("allows /users/profile with a valid token", async () => {
      const { token, user } = await global.testDb.createTestUser({
        name: "Profile User",
        email: "profile@test.local",
      });

      const response = await request(app)
        .get("/users/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      expect(response.body.password).toBeUndefined();
    });
  });
});
