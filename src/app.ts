import dotenv from "dotenv";
import express, { Application } from "express"
import { apiRouter } from "./routes/api-router";


dotenv.config()

export const app: Application = express();

app.use(express.json())

app.use("/api", apiRouter);