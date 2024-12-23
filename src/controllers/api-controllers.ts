import { Request, Response, NextFunction } from "express";
import endpoints from "../endpoints.json";

export const getEndpoints = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(200).send({ endpoints });
};
