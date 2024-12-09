import { Request, Response, NextFunction } from "express";
import { Piece } from "../schemas-interfaces/data-schemas";
import { fetchPiece, fetchPieces } from "../models/gallery-api-models";

import standardisedInteractions from "../apis-standardised.json";

export const getPieces = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { search } = req.params;

	try {
		const institutions: string[] = Object.keys(standardisedInteractions);

		const pieces: Piece[] = [];

		for (const institution of institutions) {
			const institutionPieces = await fetchPieces(search as string, institution);
			pieces.push(...institutionPieces);
		}
		pieces.length
			? res.status(200).send({ pieces })
			: await Promise.reject({ status: 404, msg: "Not Found" });
	} catch (err) {
		return next(err);
	}
};

export const getPiece = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { institution_id, piece_id } = req.params;
	const validInstitutions = Object.keys(standardisedInteractions);

	try {
		if (!validInstitutions.includes(institution_id)) {
			await Promise.reject({ status: 400, msg: "Bad Request" });
		}
		const piece: any = await fetchPiece(institution_id, piece_id);
		res.status(200).send({ piece });
	} catch (err) {
		return next(err);
	}
};
