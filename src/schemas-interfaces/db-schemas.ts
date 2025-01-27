import z from "zod";

const CollectionPieceSchema = z.object({
	id: z.number().int().optional(),
	user_id: z.number().int(),
	institution_id: z.number().int(),
	piece_id: z.string(),
});

const ExhibitionPieceSchema = z.object({
	id: z.number().int().optional(),
	exhibition_id: z.number().int(),
	institution_id: z.number().int(),
	piece_id: z.string(),
	piece_index: z.number().int(),
	img_url: z.string(),
	note: z.string().max(2000).optional(),
});

const ExhibitionSchema = z.object({
	exhibition_id: z.number().int().optional(),
	user_id: z.number().int(),
	title: z.string().min(1),
	description: z.string().max(1000).optional(),
	bg_colour: z.string().regex(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/),
	pieces: z.array(ExhibitionPieceSchema).optional(),
	to_date: z.string(),
	from_date: z.string()
});

const InstituteSchema = z.object({
	institution_id: z.number().int().optional(),
	institution_name: z.string(),
});

const UserSchema = z.object({
	user_id: z.number().int().optional(),
	username: z.string().min(1),
	email: z.string().email(),
});

export {
	CollectionPieceSchema,
	ExhibitionPieceSchema,
	ExhibitionSchema,
	InstituteSchema,
	UserSchema,
};

export type CollectionPiece = z.infer<typeof CollectionPieceSchema>;
export type ExhibitionPiece = z.infer<typeof ExhibitionPieceSchema>;
export type Exhibition = z.infer<typeof ExhibitionSchema>;
export type Institute = z.infer<typeof InstituteSchema>;
export type User = z.infer<typeof UserSchema>;
