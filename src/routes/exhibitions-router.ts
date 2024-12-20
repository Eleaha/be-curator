import express, { Router } from "express";
import {
	deleteExhibitionById,
	deleteExhibitionPiece,
	getExhibitionById,
	getExhibitions,
	getExhibitionsByUser,
	patchExhibitionById,
	patchExhibitionPieceById,
	postExhibition,
	postExhibPieceByExhibId,
} from "../controllers/exhibition-controllers";

export const exhibitionsRouter: Router = express.Router();

exhibitionsRouter.get("/", getExhibitions);
exhibitionsRouter.post("/", postExhibition);

exhibitionsRouter.get("/:exhibition_id", getExhibitionById);
exhibitionsRouter.post("/:exhibition_id", postExhibPieceByExhibId);
exhibitionsRouter.patch("/:exhibition_id", patchExhibitionById);
exhibitionsRouter.delete("/:exhibition_id", deleteExhibitionById);

exhibitionsRouter.get("/user/:user_id", getExhibitionsByUser);

exhibitionsRouter.patch("/pieces/:exhibition_piece_id", patchExhibitionPieceById)
exhibitionsRouter.delete("/pieces/:exhibition_piece_id", deleteExhibitionPiece);
