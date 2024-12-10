import { db } from "../db/db-connection";

export const fetchUsers = async () => {
	const { rows } = await db.query(`SELECT * FROM users`);
	return rows;
};

export const fetchUserById = async (userId: number) => {
	const { rows } = await db.query(`SELECT * FROM users WHERE user_id=$1`, [
		userId,
	]);
	return rows[0];
};
