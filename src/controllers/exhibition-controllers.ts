import { Request, Response, NextFunction } from "express";
import {
	fetchExhibitionById,
	fetchExhibitionPiecesByExhibitionId,
	fetchExhibitions,
	fetchExhibitionsByUser,
} from "../models/exhibitions-models";
import { Exhibition, ExhibitionPiece, User } from "../schemas-interfaces/db-schemas";
import { fetchUserById } from "../models/user-models";

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
        const user: User = await fetchUserById(+user_id)

        if (user && !exhibitions.length) await Promise.reject({ status: 404, msg: "No Exhibitions Found" });

		exhibitions.length
			? res.status(200).send({ exhibitions })
			: await Promise.reject({ status: 404, msg: "Not Found" });

	} catch (err) {
        return next(err)
	}
};

export const getExhibitionById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {exhibition_id} = req.params;
		const exhibition: Exhibition = await fetchExhibitionById(exhibition_id)
		const exhibitionPieces: ExhibitionPiece[] = await fetchExhibitionPiecesByExhibitionId(exhibition_id)

		if(!exhibition) await Promise.reject({ status: 404, msg: "Not Found" });

		exhibition.pieces = exhibitionPieces || []

		res.status(200).send({exhibition})
	} catch(err) {
		return next(err)
	}
};