import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import { apiRouter } from "./routes/api-router";
import { usersRouter } from "./routes/users-router";
import { piecesRouter } from "./routes/pieces-router";
import { handleErrors } from "./error-handling";

dotenv.config();

export const app: Application = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/pieces", piecesRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	handleErrors(err, req, res, next);
});