"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.InstituteSchema = exports.ExhibitionSchema = exports.ExhibitionPieceSchema = exports.CollectionPieceSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const CollectionPieceSchema = zod_1.default.object({
    id: zod_1.default.number().int().optional(),
    user_id: zod_1.default.number().int(),
    institution_id: zod_1.default.number().int(),
    piece_id: zod_1.default.string(),
});
exports.CollectionPieceSchema = CollectionPieceSchema;
const ExhibitionPieceSchema = zod_1.default.object({
    id: zod_1.default.number().int().optional(),
    exhibition_id: zod_1.default.number().int(),
    institution_id: zod_1.default.number().int(),
    piece_id: zod_1.default.string(),
    piece_index: zod_1.default.number().int(),
    img_url: zod_1.default.string(),
    note: zod_1.default.string().max(2000).optional(),
});
exports.ExhibitionPieceSchema = ExhibitionPieceSchema;
const ExhibitionSchema = zod_1.default.object({
    exhibition_id: zod_1.default.number().int().optional(),
    user_id: zod_1.default.number().int(),
    title: zod_1.default.string().min(1),
    description: zod_1.default.string().max(1000).optional(),
    bg_colour: zod_1.default.string().regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/),
    pieces: zod_1.default.array(ExhibitionPieceSchema).optional()
});
exports.ExhibitionSchema = ExhibitionSchema;
const InstituteSchema = zod_1.default.object({
    institution_id: zod_1.default.number().int().optional(),
    institution_name: zod_1.default.string(),
});
exports.InstituteSchema = InstituteSchema;
const UserSchema = zod_1.default.object({
    user_id: zod_1.default.number().int().optional(),
    username: zod_1.default.string().min(1),
    email: zod_1.default.string().email(),
});
exports.UserSchema = UserSchema;
