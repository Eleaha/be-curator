import dotenv from "dotenv";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import { apiRouter } from "./routes/api-router";
import { usersRouter } from "./routes/users-router";
import { piecesRouter } from "./routes/pieces-router";
import { handleErrors } from "./error-handling";
import { pieceRouter } from "./routes/piece-router";
import { exhibitionsRouter } from "./routes/exhibitions-router";

dotenv.config();

export const app: Application = express();

app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/pieces", piecesRouter);

app.use("/api/piece", pieceRouter);

app.use("/api/exhibitions", exhibitionsRouter)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
	res.status(404).send({ msg: "Not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	handleErrors(err, req, res, next);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send({ msg: "Internal server error" });
});