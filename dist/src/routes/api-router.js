"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const api_controllers_1 = require("../controllers/api-controllers");
const express_1 = __importDefault(require("express"));
exports.apiRouter = express_1.default.Router();
exports.apiRouter.get("/", api_controllers_1.getEndpoints);
