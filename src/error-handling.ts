import { NextFunction, Request, Response } from "express";

export const handleErrors = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	}

	return next(err);
};
