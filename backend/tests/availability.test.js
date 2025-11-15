import request from "supertest";
import app from "../src/app.js";

describe("Availability API", () => {
  test("GET /api/availability returns array", async () => {
    const res = await request(app)
      .get("/api/availability")
      .query({
        date: "2025-01-01",
        duration: "60"
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
