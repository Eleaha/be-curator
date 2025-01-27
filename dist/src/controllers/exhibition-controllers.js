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
exports.deleteExhibitionPiece = exports.patchExhibitionPieceById = exports.postExhibPieceByExhibId = exports.postExhibition = exports.deleteExhibitionById = exports.patchExhibitionById = exports.getExhibitionById = exports.getExhibitionsByUser = exports.getExhibitions = void 0;
const exhibitions_models_1 = require("../models/exhibitions-models");
const user_models_1 = require("../models/user-models");
const data_schemas_1 = require("../schemas-interfaces/data-schemas");
const exhbition_piece_models_1 = require("../models/exhbition-piece-models");
const getExhibitions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const exhibitions = yield (0, exhibitions_models_1.fetchExhibitions)();
    res.status(200).send({ exhibitions });
});
exports.getExhibitions = getExhibitions;
const getExhibitionsByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const exhibitions = yield (0, exhibitions_models_1.fetchExhibitionsByUser)(user_id);
        const user = yield (0, user_models_1.fetchUserById)(+user_id);
        if (user && !exhibitions.length) {
            yield Promise.reject({ status: 404, msg: "No Exhibitions Found" });
        }
        exhibitions.length
            ? res.status(200).send({ exhibitions })
            : yield Promise.reject({ status: 404, msg: "Not Found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.getExhibitionsByUser = getExhibitionsByUser;
const getExhibitionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_id } = req.params;
        const exhibition = yield (0, exhibitions_models_1.fetchExhibitionById)(exhibition_id);
        const exhibitionPieces = yield (0, exhibitions_models_1.fetchExhibitionPiecesByExhibitionId)(exhibition_id);
        if (!exhibition)
            yield Promise.reject({ status: 404, msg: "Not Found" });
        exhibition.pieces = exhibitionPieces || [];
        res.status(200).send({ exhibition });
    }
    catch (err) {
        return next(err);
    }
});
exports.getExhibitionById = getExhibitionById;
const patchExhibitionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_id } = req.params;
        const validKeys = ["title", "description", "bg_colour"].join();
        for (const key of Object.keys(req.body)) {
            if (!validKeys.includes(key)) {
                yield Promise.reject({ status: 400, msg: "Bad Request" });
            }
        }
        data_schemas_1.ExhibitionUpdateSchema.parse(req.body);
        const exhibition = yield (0, exhibitions_models_1.updateExhibitionById)(+exhibition_id, req.body);
        exhibition
            ? res.status(200).send({ exhibition })
            : yield Promise.reject({ status: 404, msg: "Not Found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.patchExhibitionById = patchExhibitionById;
const deleteExhibitionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_id } = req.params;
        const rows = yield (0, exhibitions_models_1.removeExhibitionByd)(+exhibition_id);
        rows.length
            ? res.status(204).send()
            : yield Promise.reject({ status: 404, msg: "Not found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteExhibitionById = deleteExhibitionById;
const postExhibition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validKeys = [
            "user_id",
            "title",
            "description",
            "bg_colour",
            "from_date",
            "to_date"
        ].join();
        data_schemas_1.ExhibitionPayloadSchema.parse(req.body);
        if (Object.keys(req.body).join() !== validKeys) {
            yield Promise.reject({ status: 400, msg: "Bad Request" });
        }
        const exhibition = yield (0, exhibitions_models_1.insertExhibition)(req.body);
        res.status(201).send({ exhibition });
    }
    catch (err) {
        return next(err);
    }
});
exports.postExhibition = postExhibition;
const postExhibPieceByExhibId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_id } = req.params;
        const validKeys = [
            "exhibition_id",
            "piece_index",
            "institution_id",
            "piece_id",
            "img_url",
            "note",
        ].join();
        const pieceIndex = yield (0, exhbition_piece_models_1.fetchNumberOfPiecesByExhibition)(+exhibition_id);
        const newExhibitionPiece = Object.assign({ exhibition_id: +exhibition_id, piece_index: +pieceIndex + 1 }, req.body);
        if (Object.keys(newExhibitionPiece).join() !== validKeys) {
            yield Promise.reject({ status: 400, msg: "Bad Request" });
        }
        const exhibitionPiece = yield (0, exhibitions_models_1.insertExhibitionPiece)(newExhibitionPiece);
        res.status(201).send({ exhibitionPiece });
    }
    catch (err) {
        return next(err);
    }
});
exports.postExhibPieceByExhibId = postExhibPieceByExhibId;
const patchExhibitionPieceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_piece_id } = req.params;
        const validKeys = ["piece_index", "note"].join();
        for (const key of Object.keys(req.body)) {
            if (!validKeys.includes(key)) {
                yield Promise.reject({ status: 400, msg: "Bad Request" });
            }
        }
        data_schemas_1.ExhibitionUpdateSchema.parse(req.body);
        const exhibitionPiece = yield (0, exhibitions_models_1.updateExhibitionPieceById)(+exhibition_piece_id, req.body);
        exhibitionPiece
            ? res.status(200).send({ exhibitionPiece })
            : yield Promise.reject({ status: 404, msg: "Not Found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.patchExhibitionPieceById = patchExhibitionPieceById;
const deleteExhibitionPiece = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exhibition_piece_id } = req.params;
        const rows = yield (0, exhibitions_models_1.removeExhibitionPiece)(+exhibition_piece_id);
        rows.length
            ? res.status(204).send()
            : yield Promise.reject({ status: 404, msg: "Not found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteExhibitionPiece = deleteExhibitionPiece;
