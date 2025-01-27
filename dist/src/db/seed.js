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
exports.seed = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const manage_tables_1 = require("./manage-tables");
const db_connection_1 = require("./db-connection");
const seed = (testData) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, manage_tables_1.dropTables)();
    yield (0, manage_tables_1.createTables)();
    const users = (0, pg_format_1.default)(`
        INSERT INTO users (username, email, password, bio) VALUES %L;`, testData.userData.map(Object.values));
    const institutions = (0, pg_format_1.default)(`
        INSERT INTO institutions (institution_name) VALUES %L;`, testData.instituteData.map(Object.values));
    const collectionPieces = (0, pg_format_1.default)(`
        INSERT INTO collection_pieces (user_id, institution_id, piece_id) VALUES %L;`, testData.collectionPieceData.map(Object.values));
    const exhibitions = (0, pg_format_1.default)(`
        INSERT INTO exhibitions (user_id, title, description, bg_colour, from_date, to_date) VALUES %L;`, testData.exhibitionData.map(Object.values));
    const exhibitionPieces = (0, pg_format_1.default)(`
        INSERT INTO exhibition_pieces (exhibition_id, institution_id, piece_id, piece_index, img_url, note) VALUES %L;`, testData.exhibitionPieceData.map(Object.values));
    const queries = [
        users,
        institutions,
        collectionPieces,
        exhibitions,
        exhibitionPieces,
    ];
    for (const query of queries) {
        yield db_connection_1.db.query(query);
    }
});
exports.seed = seed;
