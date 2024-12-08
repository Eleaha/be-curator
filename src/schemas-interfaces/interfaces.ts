export interface StandardInteraction {
	base_url: string;
	needs_key: boolean;
	query: {
		pieces: string;
		piece: string;
		search: string;
		location: string;
		name_of_piece: string;
		type: string;
		material: string;
		maker: string;
		img: string;
		limit: string;
		page: string;
		key?: string;
	};
	data_map: {
		pieces_data: {
			data_key: string;
			piece_id: string;
			title: string;
			maker_key?: string;
			maker: string;
			img_key: string;
			img_url: string;
			date: string;
		};
	};
}

export interface StandardInteractions {
	[key: string]: StandardInteraction;
}

export type InteractionKey = keyof StandardInteractions;
