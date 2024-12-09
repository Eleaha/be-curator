import standardisedInteractions from "./apis-standardised.json";
import {
	InteractionKey,
	StandardInteractions,
} from "./schemas-interfaces/interfaces";

export const mapApiPiecesData = (id: InteractionKey, data: any[]) => {
	const interactions: StandardInteractions = standardisedInteractions;

	const { pieces_data } = interactions[id].data_map;

	const vAndAImgApiQuery = id === "1" ? "full/500,/0/default.jpg" : "";

	return data[pieces_data.data_key as keyof typeof data].map((rawPiece: any) => {
		const maker: string = pieces_data.maker_key
			? rawPiece[pieces_data.maker_key][pieces_data.maker]
			: rawPiece[pieces_data.maker];

		const date: string =
			id === "2"
				? rawPiece.longTitle.match(/\d+$/)[0]
				: rawPiece[pieces_data.date];

		return {
			institution_id: id,
			piece_id: rawPiece[pieces_data.piece_id],
			title: rawPiece[pieces_data.title] || "Untitled",
			maker: maker,
			img_url:
				rawPiece[pieces_data.img_key][pieces_data.img_url] + vAndAImgApiQuery,
			date: date,
		};
	});
};
