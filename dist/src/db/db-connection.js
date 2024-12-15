"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const ENV = process.env.NODE_ENV || "development";
dotenv_1.default.config({
    path: `${__dirname}/../../.env.${ENV}`,
});
const config = {};
if (ENV === "production" || ENV === "development") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 10;
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}
exports.db = new pg_1.Pool(config);
