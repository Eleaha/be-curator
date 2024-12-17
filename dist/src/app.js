"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const api_router_1 = require("./routes/api-router");
const users_router_1 = require("./routes/users-router");
const pieces_router_1 = require("./routes/pieces-router");
const error_handling_1 = require("./error-handling");
const exhibitions_router_1 = require("./routes/exhibitions-router");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use("/api", api_router_1.apiRouter);
exports.app.use("/api/users", users_router_1.usersRouter);
exports.app.use("/api/pieces", pieces_router_1.piecesRouter);
exports.app.use("/api/exhibitions", exhibitions_router_1.exhibitionsRouter);
exports.app.all("*", (req, res, next) => {
    res.status(404).send({ msg: "Not Found" });
});
exports.app.use((err, req, res, next) => {
    (0, error_handling_1.handleErrors)(err, req, res, next);
});
exports.app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
});
