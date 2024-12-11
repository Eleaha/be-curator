import { db } from "../db/db-connection";

export const fetchExhibitions = async () => {
	const { rows } = await db.query(`SELECT * FROM exhibitions`);
	return rows;
};

export const fetchExhibitionsByUser = async (userId: string) => {
	const { rows } = await db.query(
		`SELECT * FROM exhibitions WHERE user_id=$1;`,
		[userId]
	);
	return rows;
};

export const fetchExhibitionById = async (exhibitionId: string) => {
    const {rows} = await db.query(`SELECT * FROM exhibitions WHERE exhibition_id=$1`, [exhibitionId])
	return rows[0];
};

export const fetchExhibitionPiecesByExhibitionId = async (
	exhibitionId: string
) => {
    const {rows} = await db.query(`SELECT * FROM exhibition_pieces WHERE exhibition_id=$1`, [exhibitionId])
	return rows
};
