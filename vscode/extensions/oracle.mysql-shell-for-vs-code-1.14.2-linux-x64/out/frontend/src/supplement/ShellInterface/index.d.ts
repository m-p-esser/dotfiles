import { IDictionary } from "../../app-logic/Types";
import { IMySQLConnectionOptions } from "../../communication/MySQL";
import { ISqliteConnectionOptions } from "../../communication/Sqlite";
export declare enum DBType {
    MySQL = "MySQL",
    Sqlite = "Sqlite"
}
declare type IShellConnectionOptions = IMySQLConnectionOptions | ISqliteConnectionOptions | IDictionary;
export interface IConnectionDetails {
    id: number;
    dbType: DBType;
    caption: string;
    description: string;
    options: IShellConnectionOptions;
    useSSH?: boolean;
    useMDS?: boolean;
    version?: number;
    sqlMode?: string;
    hideSystemSchemas?: boolean;
}
export interface IShellSessionDetails {
    sessionId: number;
    caption?: string;
    description?: string;
    version?: number;
    sqlMode?: string;
    dbConnectionId?: number;
}
export interface IBackendInformation {
    architecture: string;
    major: number;
    minor: number;
    patch: number;
    platform: string;
    serverDistribution: string;
    serverMajor: number;
    serverMinor: number;
    serverPatch: number;
}
export {};
