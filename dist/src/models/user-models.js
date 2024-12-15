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
exports.fetchUserById = exports.fetchUsers = void 0;
const db_connection_1 = require("../db/db-connection");
const fetchUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM users`);
    return rows;
});
exports.fetchUsers = fetchUsers;
const fetchUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_connection_1.db.query(`SELECT * FROM users WHERE user_id=$1`, [
        userId,
    ]);
    return rows[0];
});
exports.fetchUserById = fetchUserById;
