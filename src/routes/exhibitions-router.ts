import express, { Router } from "express";
import {
	deleteExhibition,
	deleteExhibitionPiece,
	getExhibitionById,
	getExhibitions,
	getExhibitionsByUser,
	postExhibition,
	postExhibPieceByExhibId,
} from "../controllers/exhibition-controllers";

export const exhibitionsRouter: Router = express.Router();

exhibitionsRouter.get("/", getExhibitions);
exhibitionsRouter.post("/", postExhibition);

exhibitionsRouter.get("/:exhibition_id", getExhibitionById);
exhibitionsRouter.post("/:exhibition_id", postExhibPieceByExhibId);
exhibitionsRouter.delete("/:exhibition_id", deleteExhibition)

exhibitionsRouter.get("/user/:user_id", getExhibitionsByUser);
exhibitionsRouter.delete("/:exhibition_piece_id", deleteExhibitionPiece)