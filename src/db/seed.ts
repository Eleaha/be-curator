import format from "pg-format";

import { dropTables, createTables } from "./manage-tables";
import { db } from "./db-connection";

import { TestData } from "../interfaces";

export const seed = async (testData: TestData) => {
	await dropTables();
	await createTables();

	const users = format(
		`
        INSERT INTO users VALUES %L;`,
		testData.userData.map(Object.values)
	);

	const institutions = format(
		`
        INSERT INTO institutions VALUES %L;`,
		testData.instituteData.map(Object.values)
	);

	const collectionPieces = format(
		`
        INSERT INTO collection_pieces VALUES %L;`,
		testData.collectionPieceData.map(Object.values)
	);

	const exhibitions = format(
		`
        INSERT INTO exhibitions VALUES %L;`,
		testData.exhibitionData.map(Object.values)
	);

	const exhibitionPieces = format(
		`
        INSERT INTO exhibition_pieces VALUES %L;`,
		testData.exhibitionPieceData.map(Object.values)
	);

	const insertQueryData: string[] = [
		users,
		institutions,
		collectionPieces,
		exhibitions,
		exhibitionPieces,
	];

	insertQueryData.forEach((query: string) => db.query(query));
};
