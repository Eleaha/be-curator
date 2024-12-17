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
exports.getUserById = exports.getUsers = void 0;
const user_models_1 = require("../models/user-models");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_models_1.fetchUsers)();
    res.status(200).send({ users });
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const user = yield (0, user_models_1.fetchUserById)(+user_id);
        user
            ? res.status(200).send({ user })
            : yield Promise.reject({ status: 404, msg: "Not Found" });
    }
    catch (err) {
        return next(err);
    }
});
exports.getUserById = getUserById;
