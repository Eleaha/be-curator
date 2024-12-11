import request from "supertest";

import { db } from "../src/db/db-connection";
import { seed } from "../src/db/seed";
import { testData } from "../src/test-data";
import endpoints from "../src/endpoints.json";
import { app } from "../src/app";
import {
	Exhibition,
	ExhibitionSchema,
	User,
	UserSchema,
} from "../src/schemas-interfaces/db-schemas";
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
			const { body } = await request(app).get("/api/piece/1/garbage").expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("GET 404 /api/piece/:institution_id/:piece_id - piece not found for institution 2", async () => {
			const { body } = await request(app).get("/api/piece/2/garbage").expect(404);
			expect(body.msg).toBe("Not Found");
		});
	});
});

describe("/api/exhibitions", () => {
	describe("GET /api/exhibitions", () => {
		test("GET 200 /api/exhibitions - responds with an array of exhibitions", async () => {
			const { body } = await request(app).get("/api/exhibitions").expect(200);
			const { exhibitions } = body;
			expect(exhibitions).toHaveLength(3);
			exhibitions.forEach((exhibition: Exhibition) => {
				const isValidExhibition = ExhibitionSchema.safeParse(exhibition);
				expect(isValidExhibition.success).toBe(true);
			});
		});
	});

	describe("GET /api/exhibitions/:user_id", () => {
		test("GET 200 /api/exhibitions/user/:user_id - responds with an array of exhibitions", async () => {
			const { body } = await request(app)
				.get("/api/exhibitions/user/1")
				.expect(200);
			const { exhibitions } = body;
			expect(exhibitions).toHaveLength(2);
			exhibitions.forEach((exhibition: Exhibition) => {
				const isValidExhibition = ExhibitionSchema.safeParse(exhibition);
				expect(isValidExhibition.success).toBe(true);
			});
		});
		test("GET 404 /api/exhibitions/user/:user_id - valid id but non-existent user", async () => {
			const { body } = await request(app)
				.get("/api/exhibitions/user/6")
				.expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("GET 404 /api/exhibitions/user/:user_id - existing id, but no associated exhibitions", async () => {
			const { body } = await request(app)
				.get("/api/exhibitions/user/3")
				.expect(404);
			expect(body.msg).toBe("No Exhibitions Found");
		});
		test("GET 400 /api/exhibitions/user/:user_id - invalid id", async () => {
			const { body } = await request(app)
				.get("/api/exhibitions/user/garbage")
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
	});

	describe("GET /api/exhibitions/:exhibition_id", () => {
		test("GET 200 /api/exhibitions/:exhibition_id - returns an exhibition object", async () => {
			const { body } = await request(app).get("/api/exhibitions/1").expect(200);
			const { exhibition } = body;
			expect(exhibition).toMatchObject({
				exhibition_id: 1,
				user_id: 1,
				title: "Exhibition one",
				description: "my first exhibition",
				bg_colour: "#c8b0db",
				pieces: [
					{
						id: 1,
						exhibition_id: 1,
						institution_id: 1,
						piece_id: "O828146",
						piece_index: 1,
						img_url:
							"https://framemark.vam.ac.uk/collections/2016JF9061/full/800,/0/default.jpg",
						note: "can use the given description",
					},
					{
						id: 2,
						exhibition_id: 1,
						institution_id: 1,
						piece_id: "O1223170",
						piece_index: 3,
						img_url:
							"https://framemark.vam.ac.uk/collections/2011EV5414/full/800,/0/default.jpg",
						note: "he need some milk",
					},
					{
						id: 3,
						exhibition_id: 1,
						institution_id: 2,
						piece_id: "RP-P-BI-5648",
						piece_index: 4,
						img_url:
							"https://lh3.googleusercontent.com/d7k4ZG2z1MLb5DE01dEWXj3FT6Y4rhUl-c_UnY809Qy55oVviw4JcA0mAWQqyDqSMjJOv5XyBEOu1ZASHsYbrGt7fbA=s0",
						note: "asdfghj",
					},
					{
						id: 4,
						exhibition_id: 1,
						institution_id: 2,
						piece_id: "RP-P-BI-5650",
						piece_index: 5,
						img_url:
							"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
						note: "",
					},
				],
			});
		});
		test("GET 404 - non existent id", async () => {
			const { body } = await request(app).get("/api/exhibitions/3000").expect(404);
			expect(body.msg).toBe("Not Found")
		})
		test("GET 400 - invalid", async () => {
			const { body } = await request(app).get("/api/exhibitions/garbage").expect(400);
			expect(body.msg).toBe("Bad Request");
		});
	});
});
