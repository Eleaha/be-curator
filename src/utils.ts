import format from "pg-format";
import standardisedInteractions from "./apis-standardised.json";
import { Piece } from "./schemas-interfaces/data-schemas";
import {
	InteractionKey,
	StandardInteractions,
} from "./schemas-interfaces/interfaces";

export const mapApiPiecesData = (
	institutionId: InteractionKey,
	data: any[]
) => {
	const interactions: StandardInteractions = standardisedInteractions;

	const { pieces_data } = interactions[institutionId].data_map;

	const vAndAImgApiQuery =
		institutionId === "1" ? "full/500,/0/default.jpg" : "";

	return data[pieces_data.data_key as keyof typeof data].map((rawPiece: any) => {
		const maker: string = pieces_data.maker_key
			? rawPiece[pieces_data.maker_key][pieces_data.maker]
			: rawPiece[pieces_data.maker];

		const date: string =
			institutionId === "2"
				? rawPiece.longTitle.match(/\d+$/)[0]
				: rawPiece[pieces_data.date];

		return {
			institution_id: institutionId,
			piece_id: rawPiece[pieces_data.piece_id],
			title: rawPiece[pieces_data.title] || "Untitled",
			maker: maker || "Unknown maker",
			img_url:
				rawPiece[pieces_data.img_key][pieces_data.img_url] + vAndAImgApiQuery,
			date: date,
		};
	});
};

export const mapApiPieceData = (
	institutionId: InteractionKey,
	rawPiece: any
) => {
	if (institutionId === "1") {
		const { meta, record } = rawPiece;

		const rawMakers: string[] = [
			...(record.artistMakerPerson || ""),
			...(record.artistsMakerOrganisations || ""),
			...(record.artistMakerPeople || ""),
		];

		const makers: string = rawMakers
			.map((rawMaker: any) => rawMaker.name.text)
			.toString();
		
		const title: string = record.titles.length ? record.titles[0].title : "Untitled"
		const date: string = record.productionDates.length
			? record.productionDates[0].date.text
			: "Unknown date";

		const piece: Piece = {
			institution_id: institutionId,
			piece_id: record.systemNumber,
			title,
			material: record.materialsAndTechniques || "Unknown material",
			maker: makers || "Unknown maker",
			img_url: meta.images._iiif_image + "full/800,/0/default.jpg",
			date,
			description: record.physicalDescription,
		};
		return piece;
	}

	if (institutionId === "2") {
		const { artObject } = rawPiece;

		const piece: Piece = {
			institution_id: institutionId,
			piece_id: artObject.objectNumber,
			title: artObject.title || "Unknown",
			material: artObject.physicalMedium || "Unknown",
			maker: artObject.principalMaker || "Unknown",
			img_url: artObject.webImage.url,
			date: artObject.dating.presentingDate || "Unknown",
			description: artObject.plaqueDescriptionEnglish,
		};
		return piece;
	}
};

export const formatSet = (objectToFormat: { (key: string): any }) => {
	const columns: any[] = Object.keys(objectToFormat);

	let setString: string = columns
		.map((column: string) => {
			return format(
				"%I = %L",
				column,
				objectToFormat[column as keyof typeof objectToFormat]
			);
		})
		.join(", ");

	return setString;
};
