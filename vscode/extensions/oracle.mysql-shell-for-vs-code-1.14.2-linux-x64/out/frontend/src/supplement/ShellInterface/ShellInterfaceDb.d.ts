import { IShellDbConnection } from "../../communication/ProtocolGui";
export declare type RoutineType = "function" | "procedure";
export declare class ShellInterfaceDb {
    protected moduleSessionLookupId: string;
    startSession(id: string, connection: number | IShellDbConnection): Promise<void>;
    closeSession(): Promise<void>;
    getCatalogObjects(type: string, filter?: string): Promise<string[]>;
    getSchemaObjects(schema: string, type: string, routineType?: RoutineType, filter?: string): Promise<string[]>;
    getTableObjects(schema: string, table: string, type: string, filter?: string): Promise<string[]>;
    get moduleSessionId(): string | undefined;
}
