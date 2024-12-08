import dotenv from "dotenv";
import express, { Application } from "express";
import { apiRouter } from "./routes/api-router";
import { usersRouter } from "./routes/users-router";
import { piecesRouter } from "./routes/pieces-router";

dotenv.config();

export const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/pieces", piecesRouter)