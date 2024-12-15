"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testData = void 0;
const collection_pieces_json_1 = __importDefault(require("./collection-pieces.json"));
const exhibition_pieces_json_1 = __importDefault(require("./exhibition-pieces.json"));
const exhibitions_json_1 = __importDefault(require("./exhibitions.json"));
const institutions_json_1 = __importDefault(require("./institutions.json"));
const users_json_1 = __importDefault(require("./users.json"));
exports.testData = {
    collectionPieceData: collection_pieces_json_1.default,
    exhibitionPieceData: exhibition_pieces_json_1.default,
    exhibitionData: exhibitions_json_1.default,
    instituteData: institutions_json_1.default,
    userData: users_json_1.default,
};
