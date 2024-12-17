"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const db_connection_1 = require("../src/db/db-connection");
const seed_1 = require("../src/db/seed");
const test_data_1 = require("../src/test-data");
const endpoints_json_1 = __importDefault(require("../src/endpoints.json"));
const app_1 = require("../src/app");
const db_schemas_1 = require("../src/schemas-interfaces/db-schemas");
const data_schemas_1 = require("../src/schemas-interfaces/data-schemas");
afterAll(() => db_connection_1.db.end());
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    return (0, seed_1.seed)(test_data_1.testData);
}));
describe("/api", () => {
    test("GET 200 /api - responds with a json containing all that available endpoints", () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield (0, supertest_1.default)(app_1.app).get("/api").expect(200);
        expect(body.endpoints).toEqual(endpoints_json_1.default);
    }));
});
describe("/api/users", () => {
    describe("GET /api/users", () => {
        test("GET 200 /api/users - responds wth an array of users", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/users").expect(200);
            const { users } = body;
            expect(users).toHaveLength(3);
            users.map((user) => {
                db_schemas_1.UserSchema.parse(user);
            });
        }));
    });
    describe("GET /api/users/:user_id", () => {
        test("GET 200 /api/users/:user_id - responds with a user object", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/users/1").expect(200);
            const { user } = body;
            expect(user).toEqual({
                user_id: 1,
                username: "juzz0604",
                email: "justin4tobycat@hotmail.co.uk",
                password: "TobyCat123!",
                bio: "asdfghj",
            });
        }));
        test("GET 404 /api/users/:user_id - non-existent id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/users/3000").expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 400 /api/users/:user_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/users/garbage").expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
});
describe("/api/pieces", () => {
    describe("GET /api/pieces/:search", () => {
        test("GET 200 /api/pieces - responds wth an array of pieces that defaults to 20 if more than 20 results", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/pieces/flowers").expect(200);
            const { pieces } = body;
            expect(pieces).toHaveLength(20);
            pieces.forEach((piece) => {
                const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
                expect(isValidData.success).toBe(true);
            });
        }));
        test("GET 200 /api/pieces/:search - accounts for search queries with more than one word", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/ancient+egypt")
                .expect(200);
            const { pieces } = body;
            pieces.forEach((piece) => {
                const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
                expect(isValidData.success).toBe(true);
            });
        }));
        test("GET 200 /api/pieces/:search - allows for a page parameter to be passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const pageOne = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/ancient+egypt?page=1")
                .expect(200);
            const pageTwo = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/ancient+egypt?page=2")
                .expect(200);
            expect(pageOne.body.pieces).not.toEqual(pageTwo.body.pieces);
            pageOne.body.pieces.forEach((piece) => {
                const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
                expect(isValidData.success).toBe(true);
            });
            pageTwo.body.pieces.forEach((piece) => {
                const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
                expect(isValidData.success).toBe(true);
            });
        }));
        test("GET 404 - /api/pieces/:search - throws a 404 when no results come up in search", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/pieces/asdfghjkl").expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 404 - /api/pieces/:search - page number is too high", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/flowers?page=10000")
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 400 - /api/pieces/:search - page number is too high", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/flowers?page=garbage")
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("GET /api/pieces/:institution_id/:piece_id", () => {
        test("GET 200 /api/pieces/:institution_id/:piece_id - responds with a piece object when querying institution 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/1/O1223170")
                .expect(200);
            const { piece } = body;
            const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
            expect(isValidData.success).toBe(true);
        }));
        test("GET 200 /api/pieces/:institution_id/:piece_id - responds with a piece object when querying institution 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/2/SK-A-2860")
                .expect(200);
            const { piece } = body;
            const isValidData = data_schemas_1.PieceSchema.safeParse(piece);
            expect(isValidData.success).toBe(true);
        }));
        test("GET 400 /api/pieces/:institution_id/:piece_id - invalid institution_id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/pieces/garbage/SK-A-2860")
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("GET 404 /api/pieces/:institution_id/:piece_id - piece not found for institution 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/pieces/1/garbage").expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 404 /api/pieces/:institution_id/:piece_id - piece not found for institution 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/pieces/2/garbage").expect(404);
            expect(body.msg).toBe("Not Found");
        }));
    });
});
describe("/api/exhibitions", () => {
    describe("GET /api/exhibitions", () => {
        test("GET 200 /api/exhibitions - responds with an array of exhibitions", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/exhibitions").expect(200);
            const { exhibitions } = body;
            expect(exhibitions).toHaveLength(3);
            exhibitions.forEach((exhibition) => {
                const isValidExhibition = db_schemas_1.ExhibitionSchema.safeParse(exhibition);
                expect(isValidExhibition.success).toBe(true);
            });
        }));
    });
    describe("POST /api/exhibitions", () => {
        test("POST 201 /api/exhibitions - responds with the newly created exhibition", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: 1,
                title: "Test Exhibition",
                description: "a test exhibition",
                bg_colour: "#000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
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
        }));
        test("POST 404 /api/exhibitions - id not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: 3000,
                title: "Test Exhibition",
                description: "a test exhibition",
                bg_colour: "#000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions")
                .send(payload)
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("POST 400 /api/exhibitions - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: "garbage",
                title: "Test Exhibition",
                description: "a test exhibition",
                bg_colour: "#000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("POST 400 /api/exhibitions - invalid hex code for bg colour", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: 1,
                title: "Test Exhibition",
                description: "a test exhibition",
                bg_colour: "#000000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request - Invalid Hex Code");
        }));
        test("POST 400 /api/exhibitions - invalid payload structure", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: 1,
                title: "Test Exhibition",
                garbage: "a test exhibition",
                bg_colour: "#000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("GET /api/exhibitions/user/:user_id", () => {
        test("GET 200 /api/exhibitions/user/:user_id - responds with an array of exhibitions", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/exhibitions/user/1")
                .expect(200);
            const { exhibitions } = body;
            expect(exhibitions).toHaveLength(2);
            exhibitions.forEach((exhibition) => {
                const isValidExhibition = db_schemas_1.ExhibitionSchema.safeParse(exhibition);
                expect(isValidExhibition.success).toBe(true);
            });
        }));
        test("GET 404 /api/exhibitions/user/:user_id - valid id but non-existent user", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/exhibitions/user/6")
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 404 /api/exhibitions/user/:user_id - existing id, but no associated exhibitions", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/exhibitions/user/3")
                .expect(404);
            expect(body.msg).toBe("No Exhibitions Found");
        }));
        test("GET 400 /api/exhibitions/user/:user_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/exhibitions/user/garbage")
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("GET /api/exhibitions/:exhibition_id", () => {
        test("GET 200 /api/exhibitions/:exhibition_id - returns an exhibition object", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/exhibitions/1").expect(200);
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
                        img_url: "https://framemark.vam.ac.uk/collections/2016JF9061/full/800,/0/default.jpg",
                        note: "can use the given description",
                    },
                    {
                        id: 2,
                        exhibition_id: 1,
                        institution_id: 1,
                        piece_id: "O1223170",
                        piece_index: 3,
                        img_url: "https://framemark.vam.ac.uk/collections/2011EV5414/full/800,/0/default.jpg",
                        note: "he need some milk",
                    },
                    {
                        id: 3,
                        exhibition_id: 1,
                        institution_id: 2,
                        piece_id: "RP-P-BI-5648",
                        piece_index: 4,
                        img_url: "https://lh3.googleusercontent.com/d7k4ZG2z1MLb5DE01dEWXj3FT6Y4rhUl-c_UnY809Qy55oVviw4JcA0mAWQqyDqSMjJOv5XyBEOu1ZASHsYbrGt7fbA=s0",
                        note: "asdfghj",
                    },
                    {
                        id: 4,
                        exhibition_id: 1,
                        institution_id: 2,
                        piece_id: "RP-P-BI-5650",
                        piece_index: 5,
                        img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                        note: "",
                    },
                ],
            });
        }));
        test("GET 404 - non existent id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app).get("/api/exhibitions/3000").expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("GET 400 - invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .get("/api/exhibitions/garbage")
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("POST /api/exhibitions/:exhibition_id", () => {
        test("POST 201 /api/exhibitions/:exhibition_id - responds with the newly created exhibition piece", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                institution_id: 2,
                piece_id: "RP-P-BI-5650",
                piece_index: 6,
                img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
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
                img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            });
        }));
        test("POST 404 /api/exhibitions/:exhibition_id - exhibition not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                institution_id: 2,
                piece_id: "RP-P-BI-5650",
                piece_index: 6,
                img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions/300")
                .send(payload)
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("POST 400 /api/exhibitions/:exhibition_id - invalid exhibition id", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                institution_id: 2,
                piece_id: "RP-P-BI-5650",
                piece_index: 6,
                img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions/garbage")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("POST 400 /api/exhibitions/:exhibition_id - invalid payload data", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                institution_id: 2,
                piece_id: "RP-P-BI-5650",
                piece_index: "garbage",
                img_url: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("POST 400 /api/exhibitions/:exhibition_id - invalid payload structure", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                institution_id: 2,
                piece_id: "RP-P-BI-5650",
                piece_index: 6,
                garbage: "https://lh3.googleusercontent.com/mptDoFPaVB4Jmex-IBmXhemAo9LeRKYhmrOtuAuKv6a9rUHeLk6WV9cwQqOs3IDWLqkhQPTojqJmRzWn16sd1cO0=s0",
                note: "",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .post("/api/exhibitions/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("PATCH /api/exhibitions/:exhibition_id", () => {
        test("PATCH 200 /api/exhibitions/:exhibition_id - responds with the newly updated exhibition", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                description: "new test exhibition",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
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
        }));
        test("PATCH 200 /api/exhibitions/:exhibition_id - can handle multiple field updates, responds with the newly updated exhibition", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                title: "new title",
                description: "new test exhibition",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
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
        }));
        test("PATCH 404 /api/exhibitions/:exhibition_id - id not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                description: "a test exhibition",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/3000")
                .send(payload)
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("PATCH 400 /api/exhibitions/:exhibition_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                description: "a test exhibition",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/garbage")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("PATCH 400 /api/exhibitions/:exhibition_id - invalid hex code for bg colour", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                bg_colour: "#000000000",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request - Invalid Hex Code");
        }));
        test("PATCH 400 /api/exhibitions/:exhibition_id - invalid payload structure", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                garbage: "a test exhibition",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("PATCH 400 /api/exhibitions/:exhibition_id - doesn't allow you to update the user", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user_id: 2,
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("DELETE /api/exhibitions/:exhibition_id", () => {
        test("DELETE 204 /api/exhibitions/:exhibition_id - successfully deletes exhibition", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/1").expect(204);
        }));
        test("DELETE 404 /api/exhibitions/:exhibition_id - non-existent id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/3000").expect(404);
        }));
        test("DELETE 400 /api/exhibitions/:exhibition_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/garbage").expect(400);
        }));
    });
    describe("PATCH /api/exhibitions/piece/:exhibition_piece_id", () => {
        test("PATCH 200 /api/exhibitions/piece/:exhibition_piece_id - responds with the newly updated exhibition piece", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                note: "new note",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/1")
                .send(payload)
                .expect(200);
            const { exhibitionPiece } = body;
            expect(exhibitionPiece).toEqual({
                id: 1,
                exhibition_id: 1,
                institution_id: 1,
                piece_id: "O828146",
                piece_index: 1,
                img_url: "https://framemark.vam.ac.uk/collections/2016JF9061/full/800,/0/default.jpg",
                note: "new note",
            });
        }));
        test("PATCH 200 /api/exhibitions/piece/:exhibition_piece_id - can handle multiple field updates, responds with the newly updated exhibition piece", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                piece_index: 6,
                note: "new note",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/1")
                .send(payload)
                .expect(200);
            const { exhibitionPiece } = body;
            expect(exhibitionPiece).toEqual({
                id: 1,
                exhibition_id: 1,
                institution_id: 1,
                piece_id: "O828146",
                piece_index: 6,
                img_url: "https://framemark.vam.ac.uk/collections/2016JF9061/full/800,/0/default.jpg",
                note: "new note",
            });
        }));
        test("PATCH 404 /api/exhibitions/piece/:exhibition_piece_id - non-existent id", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                piece_index: 6,
                note: "new note",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/3000")
                .send(payload)
                .expect(404);
            expect(body.msg).toBe("Not Found");
        }));
        test("PATCH 400 /api/exhibitions/piece/:exhibition_piece_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                piece_index: 6,
                note: "new note",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/garbage")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("PATCH 400 /api/exhibitions/piece/:exhibition_piece_id - only allows for the piece index and note to be updated", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                piece_id: 4,
                piece_index: 6,
                note: "new note",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("PATCH 400 /api/exhibitions/piece/:exhibition_piece_id - invalid payload structure", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                garbage: 6,
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
        test("PATCH 400 /api/exhibitions/piece/:exhibition_piece_id - invalid payload data", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                piece_index: "six",
            };
            const { body } = yield (0, supertest_1.default)(app_1.app)
                .patch("/api/exhibitions/piece/1")
                .send(payload)
                .expect(400);
            expect(body.msg).toBe("Bad Request");
        }));
    });
    describe("DELETE /api/exhibitions/:exhibition_piece_id", () => {
        test("DELETE 204 /api/exhibitions/:exhibition_piece_id - successfully deletes exhibition piece", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/1").expect(204);
        }));
        test("DELETE 404 /api/exhibitions/:exhibition_piece_id - non-existent id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/3000").expect(404);
        }));
        test("DELETE 400 /api/exhibitions/:exhibition_piece_id - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app).delete("/api/exhibitions/garbage").expect(400);
        }));
    });
});
