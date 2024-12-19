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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNumberOfPiecesByExhibition = void 0;
const db_connection_1 = require("../db/db-connection");
const fetchNumberOfPiecesByExhibition = (exhibitionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT COUNT(*) AS exhibition_piece_count 
        FROM exhibition_pieces 
        WHERE exhibition_id=$1`, [exhibitionId]);
    return rows[0].exhibition_piece_count;
});
exports.fetchNumberOfPiecesByExhibition = fetchNumberOfPiecesByExhibition;
