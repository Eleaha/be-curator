import { db } from "../src/db/db-connection";
import { seed } from "../src/db/seed";
import { testData } from "../src/test-data";
import endpoints from "../src/endpoints.json";

import request from "supertest";
import { app } from "../src/app";
import { User, UserSchema } from "../src/schemas";
import { z } from "zod";

afterAll(() => db.end());

beforeEach(async () => {
	return seed(testData);
});

describe("/api", () => {
	test("GET 200 /api - responds with a json containing all that available endpoints", async () => {
		const { body } = await request(app).get("/api").expect(200);
		expect(body.endpoints).toEqual(endpoints);
	});
});

describe("/api/users", () => {
	describe("GET /api/users", () => {
		test("GET 200 /api/users - responds wth an array of users", async () => {
			const { body } = await request(app).get("/api/users").expect(200);
			const { users } = body
			expect(users).toHaveLength(3)
			users.map((user: User) => {
				UserSchema.parse(user)
			})
		});
	});
});
