import { Request, Response, NextFunction } from "express";
import { Piece } from "../schemas-interfaces/data-schemas";
import { fetchPieces } from "../models/gallery-api-models";

import standardisedInteractions from "../apis-standardised.json";

export const getPieces = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { search } = req.query;

	const institutions: string[] = Object.keys(standardisedInteractions);

	const pieces: Piece[] = [];

	for (const institution of institutions) {
		const institutionPieces = await fetchPieces(search as string, institution);
		pieces.push(...institutionPieces);
	}

	res.status(200).send({ pieces });
};
