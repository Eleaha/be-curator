"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExhibitionUpdateSchema = exports.ExhibitionPayloadSchema = exports.ExhibitionPiecePayloadSchema = exports.PieceSchema = exports.StandardQueriesSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const StandardQuerySchema = zod_1.default.object({
    search: zod_1.default.string(),
    // limit: z.string(),
    // page: z.string(),
});
const StandardQueriesSchema = zod_1.default.record(zod_1.default.string(), StandardQuerySchema);
exports.StandardQueriesSchema = StandardQueriesSchema;
const PieceSchema = zod_1.default.object({
    institution_id: zod_1.default.string(),
    piece_id: zod_1.default.string(),
    title: zod_1.default.string(),
    material: zod_1.default.string().optional(),
    maker: zod_1.default.string(),
    img_url: zod_1.default.string(),
    date: zod_1.default.string(),
    description: zod_1.default.string().optional(),
});
exports.PieceSchema = PieceSchema;
const ExhibitionPiecePayloadSchema = zod_1.default.object({
    exhibition_id: zod_1.default.coerce.number().int().optional(),
    institution_id: zod_1.default.coerce.number().int(),
    piece_id: zod_1.default.string(),
    // piece_index: z.coerce.number().int(),
    img_url: zod_1.default.string(),
    note: zod_1.default.string().max(2000).optional(),
});
exports.ExhibitionPiecePayloadSchema = ExhibitionPiecePayloadSchema;
const ExhibitionPayloadSchema = zod_1.default.object({
    user_id: zod_1.default.coerce.number().int(),
    title: zod_1.default.string().max(200),
    description: zod_1.default.string().max(1000).optional(),
    bg_colour: zod_1.default.string().regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/),
});
exports.ExhibitionPayloadSchema = ExhibitionPayloadSchema;
const ExhibitionUpdateSchema = zod_1.default.object({
    title: zod_1.default.string().max(200).optional(),
    description: zod_1.default.string().max(1000).optional(),
    bg_colour: zod_1.default
        .string()
        .regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/)
        .optional(),
});
exports.ExhibitionUpdateSchema = ExhibitionUpdateSchema;
