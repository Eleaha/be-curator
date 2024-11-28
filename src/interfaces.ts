import { CollectionPiece, Exhibition, ExhibitionPiece, Institute, User } from "./schemas"

export interface TestData {
    collectionPieceData: CollectionPiece[],
    exhibitionPieceData: ExhibitionPiece[],
    exhibitionData: Exhibition[],
    instituteData: Institute[],
    userData: User[]
}