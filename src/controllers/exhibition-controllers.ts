import { Request, Response, NextFunction } from "express";
import {
	fetchExhibitionById,
	fetchExhibitionPiecesByExhibitionId,
	fetchExhibitions,
	fetchExhibitionsByUser,
	insertExhibition,
	insertExhibitionPiece,
	removeExhibitionByd,
	removeExhibitionPiece,
	updateExhibitionById,
	updateExhibitionPieceById,
} from "../models/exhibitions-models";
import {
	Exhibition,
	ExhibitionPiece,
	User,
} from "../schemas-interfaces/db-schemas";
import { fetchUserById } from "../models/user-models";
import {
	ExhibitionPayload,
	ExhibitionPayloadSchema,
	ExhibitionPiecePayload,
	ExhibitionUpdateSchema,
} from "../schemas-interfaces/data-schemas";
import { fetchNumberOfPiecesByExhibition } from "../models/exhbition-piece-models";

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

		if (user && !exhibitions.length) {
			await Promise.reject({ status: 404, msg: "No Exhibitions Found" });
		}

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

export const patchExhibitionById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_id } = req.params;

		const validKeys: string[] = ["title", "description", "bg_colour", "from_date", "to_date"];

		for (const key of Object.keys(req.body)) {
			if (!validKeys.includes(key)) {
				await Promise.reject({ status: 400, msg: "Bad Request" });
			}
		}

		ExhibitionUpdateSchema.parse(req.body);

		const exhibition = await updateExhibitionById(+exhibition_id, req.body);

		exhibition
			? res.status(200).send({ exhibition })
			: await Promise.reject({ status: 404, msg: "Not Found" });
	} catch (err) {
		return next(err);
	}
};

export const deleteExhibitionById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_id } = req.params;

		const rows = await removeExhibitionByd(+exhibition_id);

		rows.length
			? res.status(204).send()
			: await Promise.reject({ status: 404, msg: "Not found" });
	} catch (err) {
		return next(err);
	}
};

export const postExhibition = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const validKeys: string[] = [
			"user_id",
			"title",
			"description",
			"bg_colour",
			"from_date",
			"to_date",
		];

		ExhibitionPayloadSchema.parse(req.body);

		for (const key of Object.keys(req.body)) {
			if (!validKeys.includes(key)) {
				await Promise.reject({ status: 400, msg: "Bad Request" });
			}
		}

		const exhibition: Exhibition = await insertExhibition(req.body);

		res.status(201).send({ exhibition });
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
			"piece_index",
			"institution_id",
			"piece_id",
			"img_url",
			"note",
		].join();

		const pieceIndex = await fetchNumberOfPiecesByExhibition(+exhibition_id);
		const newExhibitionPiece: ExhibitionPiecePayload = {
			exhibition_id: +exhibition_id,
			piece_index: +pieceIndex! + 1,
			...req.body,
		};

		if (Object.keys(newExhibitionPiece).join() !== validKeys) {
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

export const patchExhibitionPieceById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_piece_id } = req.params;

		const validKeys: string[] = ["piece_index", "note"];

		for (const key of Object.keys(req.body)) {
			if (!validKeys.includes(key)) {
				await Promise.reject({ status: 400, msg: "Bad Request" });
			}
		}

		ExhibitionUpdateSchema.parse(req.body);

		const exhibitionPiece: ExhibitionPiece = await updateExhibitionPieceById(
			+exhibition_piece_id,
			req.body
		);

		exhibitionPiece
			? res.status(200).send({ exhibitionPiece })
			: await Promise.reject({ status: 404, msg: "Not Found" });
	} catch (err) {
		return next(err);
	}
};

export const deleteExhibitionPiece = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { exhibition_piece_id } = req.params;

		const rows = await removeExhibitionPiece(+exhibition_piece_id);

		rows.length
			? res.status(204).send()
			: await Promise.reject({ status: 404, msg: "Not found" });
	} catch (err) {
		return next(err);
	}
};
