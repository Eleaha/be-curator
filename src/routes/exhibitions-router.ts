import express, { Router } from "express";
import { getExhibitions, getExhibitionsByUser } from "../controllers/exhibition-controllers";

export const exhibitionsRouter: Router = express.Router()

exhibitionsRouter.get("/", getExhibitions)
exhibitionsRouter.get("/user/:user_id", getExhibitionsByUser)