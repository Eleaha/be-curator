import express, { Router } from "express";
import { getUsers } from "../controllers/users-controllers";

export const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);
