"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = exports.dropTables = void 0;
const db_connection_1 = require("./db-connection");
const dropTables = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_connection_1.db.query(`DROP TABLE IF EXISTS exhibition_pieces`);
    yield db_connection_1.db.query(`DROP TABLE IF EXISTS exhibitions`);
    yield db_connection_1.db.query(`DROP TABLE IF EXISTS collection_pieces`);
    yield db_connection_1.db.query(`DROP TABLE IF EXISTS institutions`);
    yield db_connection_1.db.query(`DROP TABLE IF EXISTS users`);
});
exports.dropTables = dropTables;
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_connection_1.db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        bio VARCHAR);`);
    yield db_connection_1.db.query(`CREATE TABLE institutions (
        institution_id SERIAL PRIMARY KEY,
        institution_name VARCHAR);`);
    yield db_connection_1.db.query(`CREATE TABLE collection_pieces (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        institution_id INT NOT NULL REFERENCES institutions(institution_id),
        piece_id VARCHAR NOT NULL
        );`);
    yield db_connection_1.db.query(`CREATE TABLE exhibitions (
        exhibition_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        title VARCHAR NOT NULL,
        description VARCHAR,
        bg_colour VARCHAR DEFAULT '#000000',
        from_date DATE DEFAULT CURRENT_DATE,
        to_date DATE DEFAULT CURRENT_DATE
        );`);
    yield db_connection_1.db.query(`CREATE TABLE exhibition_pieces (
        id SERIAL PRIMARY KEY,
        exhibition_id INT NOT NULL REFERENCES exhibitions(exhibition_id) ON DELETE CASCADE,
        institution_id INT NOT NULL REFERENCES institutions(institution_id),
        piece_id VARCHAR NOT NULL,
        piece_index INT NOT NULL,
        img_url VARCHAR NOT NULL,
        note TEXT
        );`);
});
exports.createTables = createTables;
