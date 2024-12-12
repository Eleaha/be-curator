import format from "pg-format";

import { dropTables, createTables } from "./manage-tables";
import { db } from "./db-connection";

import { TestData } from "../test-data/test-data-interfaces";

export const seed = async (testData: TestData) => {
	await dropTables();
	await createTables();

	const users = format(
		`
        INSERT INTO users (username, email, password, bio) VALUES %L;`,
		testData.userData.map(Object.values)
	);

	const institutions = format(
		`
        INSERT INTO institutions (institution_name) VALUES %L;`,
		testData.instituteData.map(Object.values)
	);

	const collectionPieces = format(
		`
        INSERT INTO collection_pieces (user_id, institution_id, piece_id) VALUES %L;`,
		testData.collectionPieceData.map(Object.values)
	);

	const exhibitions = format(
		`
        INSERT INTO exhibitions (user_id, title, description, bg_colour) VALUES %L;`,
		testData.exhibitionData.map(Object.values)
	);

	const exhibitionPieces = format(
		`
        INSERT INTO exhibition_pieces (exhibition_id, institution_id, piece_id, piece_index, img_url, note) VALUES %L;`,
		testData.exhibitionPieceData.map(Object.values)
	);

	const queries: string[] = [
		users,
		institutions,
		collectionPieces,
		exhibitions,
		exhibitionPieces,
	];

	for (const query of queries) {
		await db.query(query);
	}
};
