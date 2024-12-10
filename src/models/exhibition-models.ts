import { db } from "../db/db-connection";

export const fetchExhibitions = async () => {
	const { rows } = await db.query(`SELECT * FROM exhibitions`);
	return rows;
};
