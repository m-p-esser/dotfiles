import { IBackendInformation } from ".";
export declare class ShellInterfaceCore {
    get backendInformation(): Promise<IBackendInformation | undefined>;
    getLogLevel(): Promise<string>;
    setLogLevel(logLevel: string): Promise<void>;
    getDbTypes(): Promise<string[]>;
    validatePath(path: string): Promise<boolean>;
    createDatabaseFile(path: string): Promise<void>;
    getDebuggerScriptNames(): Promise<string[]>;
    getDebuggerScriptContent(path: string): Promise<string>;
}
