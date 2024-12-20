"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSet = exports.mapApiPieceData = exports.mapApiPiecesData = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const apis_standardised_json_1 = __importDefault(require("./apis-standardised.json"));
const mapApiPiecesData = (institutionId, data) => {
    const interactions = apis_standardised_json_1.default;
    const { pieces_data } = interactions[institutionId].data_map;
    const vAndAImgApiQuery = institutionId === "1" ? "full/500,/0/default.jpg" : "";
    return data[pieces_data.data_key].map((rawPiece) => {
        const maker = pieces_data.maker_key
            ? rawPiece[pieces_data.maker_key][pieces_data.maker]
            : rawPiece[pieces_data.maker];
        const date = institutionId === "2"
            ? rawPiece.longTitle.match(/\d+$/)[0]
            : rawPiece[pieces_data.date];
        return {
            institution_id: institutionId,
            piece_id: rawPiece[pieces_data.piece_id],
            title: rawPiece[pieces_data.title] || "Untitled",
            maker: maker || "Unknown",
            img_url: rawPiece[pieces_data.img_key][pieces_data.img_url] + vAndAImgApiQuery,
            date: date,
        };
    });
};
exports.mapApiPiecesData = mapApiPiecesData;
const mapApiPieceData = (institutionId, rawPiece) => {
    if (institutionId === "1") {
        const { meta, record } = rawPiece;
        const rawMakers = [
            ...(record.artistMakerPerson || ""),
            ...(record.artistsMakerOrganisations || ""),
            ...(record.artistMakerPeople || ""),
        ];
        const makers = rawMakers
            .map((rawMaker) => rawMaker.name.text)
            .toString();
        const piece = {
            institution_id: institutionId,
            piece_id: record.systemNumber,
            title: record.titles[0].title || "Unknown",
            material: record.materialsAndTechniques || "Unknown",
            maker: makers || "Unknown",
            img_url: meta.images._iiif_image + "full/800,/0/default.jpg",
            date: record.productionDates[0].date.text || "Unknown",
            description: record.physicalDescription,
        };
        return piece;
    }
    if (institutionId === "2") {
        const { artObject } = rawPiece;
        const piece = {
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
exports.mapApiPieceData = mapApiPieceData;
const formatSet = (objectToFormat) => {
    const columns = Object.keys(objectToFormat);
    let setString = columns
        .map((column) => {
        return (0, pg_format_1.default)("%I = %L", column, objectToFormat[column]);
    })
        .join(", ");
    return setString;
};
exports.formatSet = formatSet;
