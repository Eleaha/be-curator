import axios from "axios";
import dotenv from "dotenv";
import standardisedInteractions from "../apis-standardised.json";
import {
	InteractionKey,
	StandardInteractions,
} from "../schemas-interfaces/interfaces";
import { mapApiPieceData, mapApiPiecesData } from "../utils";
import apiKeys from "../../api-keys.json";
import { Piece } from "../schemas-interfaces/data-schemas";

export const fetchPieces = async (
	search: string,
	institutionId: InteractionKey
) => {
	const queries: StandardInteractions = standardisedInteractions;
	const { base_url, query } = queries[institutionId];

	const apiKey: string = queries[institutionId].needs_key
		? "&" + query.key + process.env.RIJKSAPIKEY
		: "";

	const apiQuery = `${base_url}${query.pieces}${query.search}${search}&${query.limit}10&${query.img}${apiKey}`;

	const response = await axios.get(apiQuery);
	const piecesData = response.data;
	const pieces = mapApiPiecesData(institutionId, piecesData);

	return pieces;
};

export const fetchPiece = async (
	institutionId: InteractionKey,
	objectId: string
) => {
	const queries: StandardInteractions = standardisedInteractions;
	const { base_url, query } = queries[institutionId];

	const apiKey: string = queries[institutionId].needs_key
		? "?" + query.key + apiKeys[institutionId as keyof typeof apiKeys]
		: "";

	const apiQuery: string = `${base_url}${query.piece}${objectId}${apiKey}`;
	const response = await axios.get(apiQuery);
	const pieceData = response.data;

	if (pieceData.artObjectPage === null) await Promise.reject({ status: 404, msg: "Not Found" });

	const piece: Piece = mapApiPieceData(institutionId, pieceData)!;
	return piece;
};
