import { db } from "../db/db-connection";

export const fetchNumberOfPiecesByExhibition = async (exhibitionId: number) => {
	const { rows } = await db.query(
		`SELECT COUNT(*) AS exhibition_piece_count 
        FROM exhibition_pieces 
        WHERE exhibition_id=$1`,
		[exhibitionId]
	);
    return rows[0].exhibition_piece_count;
};
