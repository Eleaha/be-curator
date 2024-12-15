import { db } from "./db-connection";

export const dropTables = async () => {
	await db.query(`DROP TABLE IF EXISTS exhibition_pieces`);
        await db.query(`DROP TABLE IF EXISTS exhibitions`);
	await db.query(`DROP TABLE IF EXISTS collection_pieces`);
	await db.query(`DROP TABLE IF EXISTS institutions`);
	await db.query(`DROP TABLE IF EXISTS users`);
};

export const createTables = async () => {
	await db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        bio VARCHAR);`);

	await db.query(`CREATE TABLE institutions (
        institution_id SERIAL PRIMARY KEY,
        institution_name VARCHAR);`);

	await db.query(`CREATE TABLE collection_pieces (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        institution_id INT NOT NULL REFERENCES institutions(institution_id),
        piece_id VARCHAR NOT NULL
        );`);

	await db.query(`CREATE TABLE exhibitions (
        exhibition_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        title VARCHAR NOT NULL,
        description VARCHAR,
        bg_colour VARCHAR DEFAULT '#000000'
        );`);

	await db.query(`CREATE TABLE exhibition_pieces (
        id SERIAL PRIMARY KEY,
        exhibition_id INT NOT NULL REFERENCES exhibitions(exhibition_id) ON DELETE CASCADE,
        institution_id INT NOT NULL REFERENCES institutions(institution_id),
        piece_id VARCHAR NOT NULL,
        piece_index INT NOT NULL,
        img_url VARCHAR NOT NULL,
        note TEXT
        );`);
};