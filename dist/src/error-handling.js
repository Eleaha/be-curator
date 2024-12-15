"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const zod_1 = require("zod");
const handleErrors = (err, req, res, next) => {
    const badRequestCodes = ["22P02", "42703"];
    const notFoundCodes = ["23503"];
    if (badRequestCodes.includes(err.code)) {
        res.status(400).send({ msg: "Bad Request" });
    }
    if (notFoundCodes.includes(err.code)) {
        res.status(404).send({ msg: "Not Found" });
    }
    if (err instanceof zod_1.ZodError) {
        if (err.errors[0].path[0] === "bg_colour" && err.errors[0].code === "invalid_string") {
            res.status(400).send({ msg: "Bad Request - Invalid Hex Code" });
        }
        if (err.errors[0].code === "invalid_type") {
            res.status(400).send({ msg: "Bad Request" });
        }
    }
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    if (err.response.status && err.response.statusText) {
        res.status(err.response.status).send({ msg: err.response.statusText });
    }
    return next(err);
};
exports.handleErrors = handleErrors;
