import { Request, Response, NextFunction } from "express";
import { fetchExhibitions } from "../models/exhibition-models";
import { Exhibition } from "../schemas-interfaces/db-schemas";

export const getExhibitions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const exhibitions: Exhibition[] = await fetchExhibitions();
	res.status(200).send({ exhibitions });
};