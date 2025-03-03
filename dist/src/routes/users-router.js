"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users-controllers");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.get("/", users_controllers_1.getUsers);
exports.usersRouter.get("/:user_id", users_controllers_1.getUserById);
