import { Request, Response, NextFunction } from "express";
import { Piece } from "../schemas-interfaces/data-schemas";
import { fetchPiece, fetchPieces } from "../models/gallery-api-models";

import standardisedInteractions from "../apis-standardised.json";

export const getPieces = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { search } = req.params;
		const { page } = req.query.page ? req.query : { page: "1" };

		if (isNaN(+page!)) {
			await Promise.reject({ status: 400, msg: "Bad Request" });
		}

		const institutions: string[] = Object.keys(standardisedInteractions);

		const piecesByInstitution = await Promise.all(
			institutions.map((institution: string) =>
				fetchPieces(search as string, institution, +page!)
			)
		);

		const pieces: Piece[] = piecesByInstitution.flat();

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
