import { Request, Response, NextFunction } from "express";
import { fetchUsers } from "../models/user-models";
import { User } from "../schemas-interfaces/db-schemas";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const users: User[] = await fetchUsers();
	res.status(200).send({ users });
};
