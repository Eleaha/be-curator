import { db } from "../src/db/db-connection";
import { seed } from "../src/db/seed";
import { testData } from "../src/test-data";
import endpoints from "../src/endpoints.json";

import request from "supertest";
import { app } from "../src/app";
import { User, UserSchema } from "../src/schemas-interfaces/db-schemas";
import { z } from "zod";
import { PieceSchema, Piece } from "../src/schemas-interfaces/data-schemas";

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
			const { users } = body;
			expect(users).toHaveLength(3);
			users.map((user: User) => {
				UserSchema.parse(user);
			});
		});
	});
});

describe("/api/pieces", () => {
	describe("GET /api/pieces/:search", () => {
		test("GET 200 /api/pieces - responds wth an array of pieces that defaults to 20 if more than 20 results", async () => {
			const { body } = await request(app).get("/api/pieces/flowers").expect(200);
			const { pieces } = body;
			expect(pieces).toHaveLength(20);
			pieces.forEach((piece: Piece) => {
				const isValidData = PieceSchema.safeParse(piece);
				expect(isValidData.success).toBe(true);
			});
		});
		test("GET 200 /api/pieces/:search - accounts for search queries with more than one word", async () => {
			const { body } = await request(app)
				.get("/api/pieces/ancient+egypt")
				.expect(200);
			const { pieces } = body;
			pieces.forEach((piece: Piece) => {
				const isValidData = PieceSchema.safeParse(piece);
				expect(isValidData.success).toBe(true);
			});
		});
		test("GET 404 - /api/pieces/:search - throws a 404 when no results come up in search", async () => {
			const { body } = await request(app).get("/api/pieces/asdfghjkl").expect(404);
			expect(body.msg).toBe("Not Found");
		});
	});
});

describe("/api/piece", () => {
	describe("GET /api/piece/:institution_id/:piece_id", () => {
		test("GET 200 /api/piece/:institution_id/:piece_id - responds with a piece object when querying institution 1", async () => {
			const { body } = await request(app).get("/api/piece/1/O1223170").expect(200);
			const { piece } = body;
			const isValidData = PieceSchema.safeParse(piece);
			expect(isValidData.success).toBe(true);
		});
		test("GET 200 /api/piece/:institution_id/:piece_id - responds with a piece object when querying institution 2", async () => {
			const { body } = await request(app)
				.get("/api/piece/2/SK-A-2860")
				.expect(200);
			const { piece } = body;
			const isValidData = PieceSchema.safeParse(piece);
			expect(isValidData.success).toBe(true);
		});
		test("GET 400 /api/piece/:institution_id/:piece_id - invalid institution_id", async () => {
			const { body } = await request(app)
				.get("/api/piece/garbage/SK-A-2860")
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("GET 404 /api/piece/:institution_id/:piece_id - piece not found for institution 1", async () => {
			const { body } = await request(app)
				.get("/api/piece/1/garbage")
				.expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("GET 404 /api/piece/:institution_id/:piece_id - piece not found for institution 2", async () => {
			const { body } = await request(app).get("/api/piece/2/garbage").expect(404);
			expect(body.msg).toBe("Not Found");
		});
	});
});
