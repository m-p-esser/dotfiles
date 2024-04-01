import { IDBCharacterSet, IDBDataTypeDetails } from "./Types";
export declare const mysqlInfo: {
    maximumIdentifierLength: number;
    supportCatalogs: boolean;
    characterSets: Map<string, IDBCharacterSet>;
    dataTypes: Map<string, IDBDataTypeDetails>;
};
export declare const sqliteInfo: {
    maximumIdentifierLength: number;
    supportCatalogs: boolean;
    characterSets: Map<string, IDBCharacterSet>;
    dataTypes: Map<string, IDBDataTypeDetails>;
};
