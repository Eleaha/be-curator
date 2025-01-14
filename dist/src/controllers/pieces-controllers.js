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
exports.getPiece = exports.getPieces = void 0;
const gallery_api_models_1 = require("../models/gallery-api-models");
const apis_standardised_json_1 = __importDefault(require("../apis-standardised.json"));
const getPieces = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.params;
        const { page } = req.query.page ? req.query : { page: "1" };
        if (isNaN(+page)) {
            yield Promise.reject({ status: 400, msg: "Bad Request" });
        }
        const institutions = Object.keys(apis_standardised_json_1.default);
        const piecesByInstitution = yield Promise.all(institutions.map((institution) => (0, gallery_api_models_1.fetchPieces)(search, institution, +page)));
        const pieces = piecesByInstitution.flat();
        pieces.length
            ? res.status(200).send({ pieces })
            : yield Promise.reject({ status: 404, msg: "Not Found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.getPieces = getPieces;
const getPiece = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { institution_id, piece_id } = req.params;
    const validInstitutions = Object.keys(apis_standardised_json_1.default);
    try {
        if (!validInstitutions.includes(institution_id)) {
            yield Promise.reject({ status: 400, msg: "Bad Request" });
        }
        const piece = yield (0, gallery_api_models_1.fetchPiece)(institution_id, piece_id);
        res.status(200).send({ piece });
    }
    catch (err) {
        return next(err);
    }
});
exports.getPiece = getPiece;
