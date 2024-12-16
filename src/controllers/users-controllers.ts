import { Request, Response, NextFunction } from "express";
import { fetchUserById, fetchUsers } from "../models/user-models";
import { User } from "../schemas-interfaces/db-schemas";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const users: User[] = await fetchUsers();
	res.status(200).send({ users });
};

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	 try {
		const {user_id} = req.params;

		const user: User = await fetchUserById(+user_id);

		user 
		? res.status(200).send({user})
		: await Promise.reject({ status: 404, msg: "Not Found" });
	} catch(err) {
		return next(err)
	}
}
