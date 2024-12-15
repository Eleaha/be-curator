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
exports.fetchPiece = exports.fetchPieces = void 0;
const axios_1 = __importDefault(require("axios"));
const apis_standardised_json_1 = __importDefault(require("../apis-standardised.json"));
const utils_1 = require("../utils");
const api_keys_json_1 = __importDefault(require("../../api-keys.json"));
const fetchPieces = (search, institutionId) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = apis_standardised_json_1.default;
    const { base_url, query } = queries[institutionId];
    const apiKey = queries[institutionId].needs_key
        ? "&" + query.key + api_keys_json_1.default[institutionId]
        : "";
    const apiQuery = `${base_url}${query.pieces}${query.search}${search}&${query.limit}10&${query.img}${apiKey}`;
    const response = yield axios_1.default.get(apiQuery);
    const piecesData = response.data;
    const pieces = (0, utils_1.mapApiPiecesData)(institutionId, piecesData);
    return pieces;
});
exports.fetchPieces = fetchPieces;
const fetchPiece = (institutionId, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = apis_standardised_json_1.default;
    const { base_url, query } = queries[institutionId];
    const apiKey = queries[institutionId].needs_key
        ? "?" + query.key + api_keys_json_1.default[institutionId]
        : "";
    const apiQuery = `${base_url}${query.piece}${objectId}${apiKey}`;
    const response = yield axios_1.default.get(apiQuery);
    const pieceData = response.data;
    if (pieceData.artObjectPage === null)
        yield Promise.reject({ status: 404, msg: "Not Found" });
    const piece = (0, utils_1.mapApiPieceData)(institutionId, pieceData);
    return piece;
});
exports.fetchPiece = fetchPiece;
