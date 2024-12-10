import { db } from "../db/db-connection";

export const fetchExhibitions = async () => {
	const { rows } = await db.query(`SELECT * FROM exhibitions`);
	return rows;
};

export const fetchExhibitionsByUser = async (userId: string) => {
    const { rows } = await db.query(`SELECT * FROM exhibitions WHERE user_id=$1;`, [userId])
    return rows
}
