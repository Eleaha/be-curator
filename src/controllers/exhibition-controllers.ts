import { Request, Response, NextFunction } from "express";
import {
	fetchExhibitions,
	fetchExhibitionsByUser,
} from "../models/exhibition-models";
import { Exhibition, User } from "../schemas-interfaces/db-schemas";
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
