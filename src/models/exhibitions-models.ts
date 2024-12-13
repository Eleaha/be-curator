import format from "pg-format";
import { db } from "../db/db-connection";
import {
	ExhibitionPayload,
	ExhibitionPiecePayload,
} from "../schemas-interfaces/data-schemas";

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
	const { rows } = await db.query(
		`SELECT * FROM exhibitions WHERE exhibition_id=$1`,
		[exhibitionId]
	);
	return rows[0];
};

export const fetchExhibitionPiecesByExhibitionId = async (
	exhibitionId: string
) => {
	const { rows } = await db.query(
		`SELECT * FROM exhibition_pieces WHERE exhibition_id=$1`,
		[exhibitionId]
	);
	return rows;
};

export const insertExhibition = async (payload: ExhibitionPayload) => {
	const values: any[] = Object.values(payload);
	const queryString = format(
		`
			INSERT INTO exhibitions
			(user_id, title, description, bg_colour)
			VALUES %L
			RETURNING *;
		`,
		[values]
	);

	const { rows } = await db.query(queryString);
	return rows[0];
};

export const insertExhibitionPiece = async (
	payload: ExhibitionPiecePayload
) => {
	const formattedExhibitionPiece: any[] = Object.values(payload);
	const queryString: string = format(
		`
			INSERT INTO exhibition_pieces 
			(exhibition_id, institution_id, piece_id, piece_index, img_url, note)
			VALUES %L
			RETURNING *;
		`,
		[formattedExhibitionPiece]
	);
	const { rows } = await db.query(queryString);
	return rows[0];
};
