import express, { Router } from "express";
import { getPieces } from "../controllers/pieces-controllers";

export const piecesRouter: Router = express.Router();

piecesRouter.get("/:search", getPieces)