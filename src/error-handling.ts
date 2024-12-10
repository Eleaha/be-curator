import { NextFunction, Request, Response } from "express";

export const handleErrors = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {

	const badRequestCodes: string[] = ["22P02"]

	if(badRequestCodes.includes(err.code)){
		res.status(400).send({ msg: "Bad Request" });
	}

	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	}
	
	if (err.response.status && err.response.statusText) {
		res.status(err.response.status).send({ msg: err.response.statusText });
	}

	return next(err);
};
