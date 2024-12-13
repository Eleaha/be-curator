import express, { Router } from "express";
import {
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
exhibitionsRouter.get("/user/:user_id", getExhibitionsByUser);
