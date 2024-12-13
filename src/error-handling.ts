import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const handleErrors = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {

	const badRequestCodes: string[] = ["22P02"];
	const notFoundCodes: string[] = ["23503"];

	if (badRequestCodes.includes(err.code)) {
		res.status(400).send({ msg: "Bad Request" });
	}

	if (notFoundCodes.includes(err.code)) {
		res.status(404).send({ msg: "Not Found" });
	}

	if (err instanceof ZodError) {
		if (err.errors[0].path[0] === "bg_colour" && err.errors[0].code === "invalid_string") {
			res.status(400).send({ msg: "Bad Request - Invalid Hex Code" });
		}
		if(err.errors[0].code === "invalid_type"){
			res.status(400).send({ msg: "Bad Request" });
		}
	}

	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	}

	if (err.response.status && err.response.statusText) {
		res.status(err.response.status).send({ msg: err.response.statusText });
	}

	return next(err);
};
