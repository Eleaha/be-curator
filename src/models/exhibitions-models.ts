import format from "pg-format";
import { db } from "../db/db-connection";
import {
	ExhibitionPayload,
	ExhibitionPiecePayload,
} from "../schemas-interfaces/data-schemas";
import { formatSet } from "../utils";

export const fetchExhibitions = async () => {
	const { rows } = await db.query(`SELECT * FROM exhibitions`);
	return rows;
};

export const insertExhibitionPiece = async (
	payload: ExhibitionPiecePayload
) => {
	const formattedExhibitionPiece: any[] = Object.values(payload);
	const queryString: string = format(
		`
			INSERT INTO exhibition_pieces 
			(exhibition_id, piece_index, institution_id, piece_id, img_url, note)
			VALUES %L
			RETURNING *;
		`,
		[formattedExhibitionPiece]
	);
	const { rows } = await db.query(queryString);
	return rows[0];
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

export const updateExhibitionById = async (
	exhibitionId: number,
	payload: { (key: string): string }
) => {
	const setString = formatSet(payload);

	const queryString: string = format(
		`
			UPDATE exhibitions SET %s WHERE exhibition_id = %L
			RETURNING *;
		`,
		setString,
		exhibitionId
	);

	const { rows } = await db.query(queryString);
	return rows[0];
};

export const removeExhibitionByd = async (exhibition_id: number) => {
	const { rows } = await db.query(
		`DELETE FROM exhibitions
		WHERE exhibition_id=$1
		RETURNING *;`,
		[exhibition_id]
	);
	return rows;
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

export const updateExhibitionPieceById = async (
	exhibitionPieceId: number,
	payload: { (key: string): string }
) => {
	const setString = formatSet(payload);

	const queryString: string = format(
		`
			UPDATE exhibition_pieces SET %s WHERE id = %L
			RETURNING *;
		`,
		setString,
		exhibitionPieceId
	);
	const { rows } = await db.query(queryString);
	console.log(rows)
	return rows[0];
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

export const removeExhibitionPiece = async (exhibition_piece_id: number) => {
	const { rows } = await db.query(
		`DELETE FROM exhibition_pieces
		WHERE id=$1
		RETURNING *;`,
		[exhibition_piece_id]
	);
	return rows;
};
