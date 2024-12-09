import express, { Router } from "express";
import { getPiece } from "../controllers/pieces-controllers";

export const pieceRouter: Router = express.Router();

pieceRouter.get("/:institution_id/:piece_id", getPiece);
