import request from "supertest";
import app from "../src/app.js";
import jwt from "jsonwebtoken";

const userToken = jwt.sign(
  { id: "user123", role: "user" },
  process.env.JWT_SECRET || "secret"
);

describe("Bookings API", () => {
  test("GET /api/bookings/me unauthorized without token", async () => {
    const res = await request(app).get("/api/bookings/me");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/bookings/me works with token", async () => {
    const res = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });
});
