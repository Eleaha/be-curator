import z from "zod";

const StandardQuerySchema = z.object({
    search: z.string(),
    // limit: z.string(),
    // page: z.string(),
});

const StandardQueriesSchema = z.record(z.string(), StandardQuerySchema)

const PieceSchema = z.object({
	institution_id: z.string(),
	piece_id: z.string(),
	title: z.string(),
    type: z.string().optional(),
	maker: z.string(),
	img_url: z.string(),
	date: z.string(),
	description: z.string().optional(),
});

export type StandardQueries = z.infer<typeof StandardQueriesSchema>
export type Piece = z.infer<typeof PieceSchema>

export { StandardQueriesSchema, PieceSchema }

