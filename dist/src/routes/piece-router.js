"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pieceRouter = void 0;
const express_1 = __importDefault(require("express"));
const pieces_controllers_1 = require("../controllers/pieces-controllers");
exports.pieceRouter = express_1.default.Router();
exports.pieceRouter.get("/:institution_id/:piece_id", pieces_controllers_1.getPiece);
