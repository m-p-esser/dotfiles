import { IConnectionDetails } from ".";
export declare class ShellInterfaceDbConnection {
    readonly id = "dbConnection";
    addDbConnection(profileId: number, connection: IConnectionDetails, folderPath?: string): Promise<number | undefined>;
    updateDbConnection(profileId: number, connection: IConnectionDetails, folderPath?: string): Promise<void>;
    removeDbConnection(profileId: number, connectionId: number): Promise<void>;
    listDbConnections(profileId: number, folderPath?: string): Promise<IConnectionDetails[]>;
    getDbConnection(connectionId: number): Promise<IConnectionDetails | undefined>;
}
