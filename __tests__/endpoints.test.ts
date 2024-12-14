import request from "supertest";

import { db } from "../src/db/db-connection";
import { seed } from "../src/db/seed";
import { testData } from "../src/test-data";
import endpoints from "../src/endpoints.json";
import { app } from "../src/app";
import {
	Exhibition,
	ExhibitionPiece,
	ExhibitionSchema,
	User,
	UserSchema,
} from "../src/schemas-interfaces/db-schemas";
import {
	PieceSchema,
	Piece,
	ExhibitionPiecePayload,
} from "../src/schemas-interfaces/data-schemas";

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

	describe("POST /api/exhibitions", () => {
		test("POST 201 /api/exhibitions - responds with the newly created exhibition", async () => {
			const payload = {
				user_id: 1,
				title: "Test Exhibition",
				description: "a test exhibition",
				bg_colour: "#000000",
			};
			const { body } = await request(app)
				.post("/api/exhibitions")
				.send(payload)
				.expect(201);
			const { exhibition } = body;
			expect(exhibition).toEqual({
				exhibition_id: 4,
				user_id: 1,
				title: "Test Exhibition",
				description: "a test exhibition",
				bg_colour: "#000000",
			});
		});
		test("POST 404 /api/exhibitions - id not found", async () => {
			const payload = {
				user_id: 3000,
				title: "Test Exhibition",
				description: "a test exhibition",
				bg_colour: "#000000",
			};
			const { body } = await request(app)
				.post("/api/exhibitions")
				.send(payload)
				.expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("POST 400 /api/exhibitions - invalid id", async () => {
			const payload = {
				user_id: "garbage",
				title: "Test Exhibition",
				description: "a test exhibition",
				bg_colour: "#000000",
			};
			const { body } = await request(app)
				.post("/api/exhibitions")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("POST 400 /api/exhibitions - invalid hex code for bg colour", async () => {
			const payload = {
				user_id: 1,
				title: "Test Exhibition",
				description: "a test exhibition",
				bg_colour: "#000000000",
			};
			const { body } = await request(app)
				.post("/api/exhibitions")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request - Invalid Hex Code");
		});
		test("POST 400 /api/exhibitions - invalid payload structure", async () => {
			const payload = {
				user_id: 1,
				title: "Test Exhibition",
				garbage: "a test exhibition",
				bg_colour: "#000000",
			};
			const { body } = await request(app)
				.post("/api/exhibitions")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
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
			expect(body.msg).toBe("Not Found");
		});
		test("GET 400 - invalid", async () => {
			const { body } = await request(app)
				.get("/api/exhibitions/garbage")
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
	});

	describe("POST /api/exhibitions/:exhibition_id", () => {
		test("POST 201 /api/exhibitions/:exhibition_id - responds with the newly created exhibition piece", async () => {
			const payload: ExhibitionPiecePayload = {
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: 6,
				img_url:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			};
			const { body } = await request(app)
				.post("/api/exhibitions/1")
				.send(payload)
				.expect(201);
			const { exhibitionPiece } = body;
			expect(exhibitionPiece).toEqual({
				id: 5,
				exhibition_id: 1,
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: 6,
				img_url:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			});
		});
		test("POST 404 /api/exhibitions/:exhibition_id - exhibition not found", async () => {
			const payload: ExhibitionPiecePayload = {
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: 6,
				img_url:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			};
			const { body } = await request(app)
				.post("/api/exhibitions/300")
				.send(payload)
				.expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("POST 400 /api/exhibitions/:exhibition_id - invalid exhibition id", async () => {
			const payload: ExhibitionPiecePayload = {
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: 6,
				img_url:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			};
			const { body } = await request(app)
				.post("/api/exhibitions/garbage")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("POST 400 /api/exhibitions/:exhibition_id - invalid payload data", async () => {
			const payload: any = {
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: "garbage",
				img_url:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			};
			const { body } = await request(app)
				.post("/api/exhibitions/1")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("POST 400 /api/exhibitions/:exhibition_id - invalid payload structure", async () => {
			const payload: any = {
				institution_id: 2,
				piece_id: "RP-P-BI-5650",
				piece_index: 6,
				garbage:
					"https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
				note: "",
			};
			const { body } = await request(app)
				.post("/api/exhibitions/1")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
	});

	describe("PATCH /api/exhibitions/:exhibition_id", () => {
		test("PATCH 200 /api/exhibitions/:exhibition_id - responds with the newly updated exhibition", async () => {
			const payload = {
				description: "new test exhibition",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/1")
				.send(payload)
				.expect(200);
			const { exhibition } = body;
			expect(exhibition).toEqual({
				exhibition_id: 1,
				user_id: 1,
				title: "Exhibition one",
				description: "new test exhibition",
				bg_colour: "#c8b0db",
			});
		});
		test("PATCH 200 /api/exhibitions/:exhibition_id - can handle multiple field updates, responds with the newly updated exhibition", async () => {
			const payload = {
				title: "new title",
				description: "new test exhibition",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/1")
				.send(payload)
				.expect(200);
			const { exhibition } = body;
			expect(exhibition).toEqual({
				exhibition_id: 1,
				user_id: 1,
				title: "new title",
				description: "new test exhibition",
				bg_colour: "#c8b0db",
			});
		});
		test("PATCH 404 /api/exhibitions/:exhibition_id - id not found", async () => {
			const payload = {
				description: "a test exhibition",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/3000")
				.send(payload)
				.expect(404);
			expect(body.msg).toBe("Not Found");
		});
		test("PATCH 400 /api/exhibitions/:exhibition_id - invalid id", async () => {
			const payload = {
				description: "a test exhibition",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/garbage")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("PATCH 400 /api/exhibitions/:exhibition_id - invalid hex code for bg colour", async () => {
			const payload = {
				bg_colour: "#000000000",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/1")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request - Invalid Hex Code");
		});
		test("PATCH 400 /api/exhibitions/:exhibition_id - invalid payload structure", async () => {
			const payload = {
				garbage: "a test exhibition",
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/1")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
		test("PATCH 400 /api/exhibitions/:exhibition_id - doesn't allow you to update the user", async () => {
			const payload = {
				user_id: 2,
			};
			const { body } = await request(app)
				.patch("/api/exhibitions/1")
				.send(payload)
				.expect(400);
			expect(body.msg).toBe("Bad Request");
		});
	});

	describe("DELETE /api/exhibitions/:exhibition_id", () => {
		test("DELETE 204 /api/exhibitions/:exhibition_id - successfully deletes exhibition", async () => {
			await request(app).delete("/api/exhibitions/1").expect(204);
		});
		test("DELETE 404 /api/exhibitions/:exhibition_id - non-existent id", async () => {
			await request(app).delete("/api/exhibitions/3000").expect(404);
		});
		test("DELETE 400 /api/exhibitions/:exhibition_id - invalid id", async () => {
			await request(app).delete("/api/exhibitions/garbage").expect(400);
		});
	});

	describe("DELETE /api/exhibitions/:exhibition_piece_id", () => {
		test("DELETE 204 /api/exhibitions/:exhibition_piece_id - successfully deletes exhibition piece", async () => {
			await request(app).delete("/api/exhibitions/1").expect(204);
		});
		test("DELETE 404 /api/exhibitions/:exhibition_piece_id - non-existent id", async () => {
			await request(app).delete("/api/exhibitions/3000").expect(404);
		});
		test("DELETE 400 /api/exhibitions/:exhibition_piece_id - invalid id", async () => {
			await request(app).delete("/api/exhibitions/garbage").expect(400);
		});
	});
});
