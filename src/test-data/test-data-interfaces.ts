import {
	CollectionPiece,
	Exhibition,
	ExhibitionPiece,
	Institute,
	User,
} from "../schemas-interfaces/db-schemas";

export interface TestData {
	collectionPieceData: CollectionPiece[];
	exhibitionPieceData: ExhibitionPiece[];
	exhibitionData: Exhibition[];
	instituteData: Institute[];
	userData: User[];
}
