"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.piecesRouter = void 0;
const express_1 = __importDefault(require("express"));
const pieces_controllers_1 = require("../controllers/pieces-controllers");
exports.piecesRouter = express_1.default.Router();
exports.piecesRouter.get("/:search", pieces_controllers_1.getPieces);
exports.piecesRouter.get("/:institution_id/:piece_id", pieces_controllers_1.getPiece);
