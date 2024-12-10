import express, { Router } from "express";
import { getExhibitions } from "../controllers/exhibition-controllers";

export const exhibitionsRouter: Router = express.Router()

exhibitionsRouter.get("/", getExhibitions)