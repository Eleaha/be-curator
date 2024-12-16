import express, { Router } from "express";
import { getPiece, getPieces } from "../controllers/pieces-controllers";

export const piecesRouter: Router = express.Router();

piecesRouter.get("/:search", getPieces)
piecesRouter.get("/:institution_id/:piece_id", getPiece)