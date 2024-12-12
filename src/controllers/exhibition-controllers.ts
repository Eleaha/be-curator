import { Request, Response, NextFunction } from "express";
import {
	fetchExhibitionById,
	fetchExhibitionPiecesByExhibitionId,
	fetchExhibitions,
	fetchExhibitionsByUser,
	insertExhibitionPiece,
} from "../models/exhibitions-models";
import {
	Exhibition,
	ExhibitionPiece,
	User,
} from "../schemas-interfaces/db-schemas";
import { fetchUserById } from "../models/user-models";
import {
	ExhibitionPiecePayload,
} from "../schemas-interfaces/data-schemas";

export const getExhibitions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const exhibitions: Exhibition[] = await fetchExhibitions();
	res.status(200).send({ exhibitions });
};

export const getExhibitionsByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user_id } = req.params;
		const exhibitions: Exhibition[] = await fetchExhibitionsByUser(user_id);
		const user: User = await fetchUserById(+user_id);

		if (user && !exhibitions.length)
			await Promise.reject({ status: 404, msg: "No Exhibitions Found" });

		exhibitions.length
			? res.status(200).send({ exhibitions })
			: await Promise.reject({ status: 404, msg: "Not Found" });
	} catch (err) {
		return next(err);
	}
};

export const getExhibitionById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_id } = req.params;
		const exhibition: Exhibition = await fetchExhibitionById(exhibition_id);
		const exhibitionPieces: ExhibitionPiece[] =
			await fetchExhibitionPiecesByExhibitionId(exhibition_id);

		if (!exhibition) await Promise.reject({ status: 404, msg: "Not Found" });

		exhibition.pieces = exhibitionPieces || [];

		res.status(200).send({ exhibition });
	} catch (err) {
		return next(err);
	}
};

export const postExhibPieceByExhibId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_id } = req.params;

		const validKeys: string = [
			"exhibition_id",
			"institution_id",
			"piece_id",
			"piece_index",
			"img_url",
			"note",
		].join();

		const newExhibitionPiece: ExhibitionPiecePayload = {
			exhibition_id: +exhibition_id,
			...req.body,
		};
		
		if (Object.keys(newExhibitionPiece).join() !== validKeys) {
			console.log(validKeys, Object.keys(newExhibitionPiece).join());
			await Promise.reject({ status: 400, msg: "Bad Request" });
		}

		const exhibitionPiece: ExhibitionPiece = await insertExhibitionPiece(
			newExhibitionPiece
		);

		res.status(201).send({ exhibitionPiece });
	} catch (err) {
		return next(err);
	}
};
