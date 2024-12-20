"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exhibitionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const exhibition_controllers_1 = require("../controllers/exhibition-controllers");
exports.exhibitionsRouter = express_1.default.Router();
exports.exhibitionsRouter.get("/", exhibition_controllers_1.getExhibitions);
exports.exhibitionsRouter.post("/", exhibition_controllers_1.postExhibition);
exports.exhibitionsRouter.get("/:exhibition_id", exhibition_controllers_1.getExhibitionById);
exports.exhibitionsRouter.post("/:exhibition_id", exhibition_controllers_1.postExhibPieceByExhibId);
exports.exhibitionsRouter.patch("/:exhibition_id", exhibition_controllers_1.patchExhibitionById);
exports.exhibitionsRouter.delete("/:exhibition_id", exhibition_controllers_1.deleteExhibitionById);
exports.exhibitionsRouter.get("/user/:user_id", exhibition_controllers_1.getExhibitionsByUser);
exports.exhibitionsRouter.patch("/pieces/:exhibition_piece_id", exhibition_controllers_1.patchExhibitionPieceById);
exports.exhibitionsRouter.delete("/pieces/:exhibition_piece_id", exhibition_controllers_1.deleteExhibitionPiece);
