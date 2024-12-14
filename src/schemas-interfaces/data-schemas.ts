import z from "zod";

const StandardQuerySchema = z.object({
	search: z.string(),
	// limit: z.string(),
	// page: z.string(),
});

const StandardQueriesSchema = z.record(z.string(), StandardQuerySchema);

const PieceSchema = z.object({
	institution_id: z.string(),
	piece_id: z.string(),
	title: z.string(),
	material: z.string().optional(),
	maker: z.string(),
	img_url: z.string(),
	date: z.string(),
	description: z.string().optional(),
});

const ExhibitionPiecePayloadSchema = z.object({
	exhibition_id: z.coerce.number().int().optional(),
	institution_id: z.coerce.number().int(),
	piece_id: z.string(),
	piece_index: z.coerce.number().int(),
	img_url: z.string(),
	note: z.string().max(2000).optional(),
});

const ExhibitionPayloadSchema = z.object({
	user_id: z.coerce.number().int(),
	title: z.string().max(200),
	description: z.string().max(1000).optional(),
	bg_colour: z.string().regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/),
});

const ExhibitionUpdateSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	bg_colour: z
		.string()
		.regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/)
		.optional(),
});

export type StandardQueries = z.infer<typeof StandardQueriesSchema>;
export type Piece = z.infer<typeof PieceSchema>;
export type ExhibitionPiecePayload = z.infer<
	typeof ExhibitionPiecePayloadSchema
>;
export type ExhibitionPayload = z.infer<typeof ExhibitionPayloadSchema>;

export {
	StandardQueriesSchema,
	PieceSchema,
	ExhibitionPiecePayloadSchema,
	ExhibitionPayloadSchema,
	ExhibitionUpdateSchema,
};
