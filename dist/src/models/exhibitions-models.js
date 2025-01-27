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
exports.removeExhibitionPiece = exports.insertExhibition = exports.updateExhibitionPieceById = exports.fetchExhibitionPiecesByExhibitionId = exports.removeExhibitionByd = exports.updateExhibitionById = exports.fetchExhibitionById = exports.fetchExhibitionsByUser = exports.insertExhibitionPiece = exports.fetchExhibitions = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const db_connection_1 = require("../db/db-connection");
const utils_1 = require("../utils");
const fetchExhibitions = () => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM exhibitions`);
    return rows;
});
exports.fetchExhibitions = fetchExhibitions;
const insertExhibitionPiece = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedExhibitionPiece = Object.values(payload);
    const queryString = (0, pg_format_1.default)(`
			INSERT INTO exhibition_pieces 
			(exhibition_id, piece_index, institution_id, piece_id, img_url, note)
			VALUES %L
			RETURNING *;
		`, [formattedExhibitionPiece]);
    const { rows } = yield db_connection_1.db.query(queryString);
    return rows[0];
});
exports.insertExhibitionPiece = insertExhibitionPiece;
const fetchExhibitionsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM exhibitions WHERE user_id=$1;`, [userId]);
    return rows;
});
exports.fetchExhibitionsByUser = fetchExhibitionsByUser;
const fetchExhibitionById = (exhibitionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM exhibitions WHERE exhibition_id=$1`, [exhibitionId]);
    return rows[0];
});
exports.fetchExhibitionById = fetchExhibitionById;
const updateExhibitionById = (exhibitionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const setString = (0, utils_1.formatSet)(payload);
    const queryString = (0, pg_format_1.default)(`
			UPDATE exhibitions SET %s WHERE exhibition_id = %L
			RETURNING *;
		`, setString, exhibitionId);
    const { rows } = yield db_connection_1.db.query(queryString);
    return rows[0];
});
exports.updateExhibitionById = updateExhibitionById;
const removeExhibitionByd = (exhibition_id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`DELETE FROM exhibitions
		WHERE exhibition_id=$1
		RETURNING *;`, [exhibition_id]);
    return rows;
});
exports.removeExhibitionByd = removeExhibitionByd;
const fetchExhibitionPiecesByExhibitionId = (exhibitionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM exhibition_pieces WHERE exhibition_id=$1`, [exhibitionId]);
    return rows;
});
exports.fetchExhibitionPiecesByExhibitionId = fetchExhibitionPiecesByExhibitionId;
const updateExhibitionPieceById = (exhibitionPieceId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const setString = (0, utils_1.formatSet)(payload);
    const queryString = (0, pg_format_1.default)(`
			UPDATE exhibition_pieces SET %s WHERE id = %L
			RETURNING *;
		`, setString, exhibitionPieceId);
    const { rows } = yield db_connection_1.db.query(queryString);
    return rows[0];
});
exports.updateExhibitionPieceById = updateExhibitionPieceById;
const insertExhibition = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const values = Object.values(payload);
    const queryString = (0, pg_format_1.default)(`
			INSERT INTO exhibitions
			(user_id, title, description, bg_colour, from_date, to_date)
			VALUES %L
			RETURNING *;
		`, [values]);
    const { rows } = yield db_connection_1.db.query(queryString);
    return rows[0];
});
exports.insertExhibition = insertExhibition;
const removeExhibitionPiece = (exhibition_piece_id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`DELETE FROM exhibition_pieces
		WHERE id=$1
		RETURNING *;`, [exhibition_piece_id]);
    return rows;
});
exports.removeExhibitionPiece = removeExhibitionPiece;
