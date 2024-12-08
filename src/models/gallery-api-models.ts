import axios from "axios";
import standardisedInteractions from "../apis-standardised.json";
import {
	InteractionKey,
	StandardInteractions,
} from "../schemas-interfaces/interfaces";
import { mapApiPiecesData } from "../utils";
import apiKeys from "../../api-keys.json";

export const fetchPieces = async (search: string, id: InteractionKey) => {
	const queries: StandardInteractions = standardisedInteractions;
	const { base_url, query } = queries[id];
	
	const apiKey: string = queries[id].needs_key
		? "&" + query.key + apiKeys[id as keyof typeof apiKeys]
		: "";

	const apiQuery = `${base_url}${query.pieces}${query.search}${search}&${query.limit}10&${query.img}${apiKey}`;

	const response = await axios.get(apiQuery);
	const pieceData = response.data;
	const pieces = mapApiPiecesData(id, pieceData);

	return pieces;
};
