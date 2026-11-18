import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("User API", () => {

    describe("GET /api/suppliers", () => {

        test("should retrieve suppliers successfully", async () => {
            const response = await request(app)
                .get("/api/suppliers");

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.message)
                .toBe("suppliers retrieved successfully");

            expect(response.body.data).toEqual([]);
        });

    });

    describe("POST /api/suppliers", () => {

        test("should register a user successfully", async () => {
            const response = await request(app)
                .post("/api/suppliers")
                .send({
                    name: "Michael",
                    email: "michael@example.com",
                    password: "Password123"
                });

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);

            expect(response.body.data.email)
                .toBe("michael@example.com");
        });


test("should reject registration without a name", async () => {
    const response = await request(app)
        .post("/api/suppliers")
        .send({
            email: "michael@example.com",
            password: "Password123"
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message)
        .toBe("Validation Failed. Add all required fields.");
});

test("should reject registration without an email", async () => {
    const response = await request(app)
        .post("/api/suppliers")
        .send({
            name: "Michael",
            password: "Password123"
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
});

test("should reject registration without a password", async () => {
    const response = await request(app)
        .post("/api/suppliers")
        .send({
            name: "Michael",
            email: "michael@example.com"
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
});


    });

});
