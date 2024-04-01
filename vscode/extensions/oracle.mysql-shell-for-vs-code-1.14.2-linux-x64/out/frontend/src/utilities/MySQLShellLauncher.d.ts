import child_process from "child_process";
declare type ShellOutputCallback = (output: string) => void;
declare type ShellErrorCallback = (error: Error) => void;
declare type ShellExitCallback = (code: number) => void;
export declare type LogLevel = "NONE" | "ERROR" | "WARNING" | "INFO" | "DEBUG" | "DEBUG2" | "DEBUG3";
export interface IShellLaunchConfiguration {
    rootPath: string;
    inDevelopment: boolean;
    parameters: string[];
    processInput?: string;
    logLevel: LogLevel;
    onStdOutData: ShellOutputCallback;
    onStdErrData?: ShellOutputCallback;
    onError?: ShellErrorCallback;
    onExit?: ShellExitCallback;
}
export declare class MySQLShellLauncher {
    private onOutput;
    private onError;
    private onExit?;
    static readonly extensionShellUserConfigFolderBaseName = "mysqlsh-gui";
    private shellProcess;
    private launchDetails;
    constructor(onOutput: ShellOutputCallback, onError: ShellErrorCallback, onExit?: ShellExitCallback | undefined);
    static getShellUserConfigDir: (inDevelopment: boolean) => string;
    static runMysqlShell: (config: IShellLaunchConfiguration) => child_process.ChildProcess;
    static findFreePort: () => Promise<number>;
    private static getShellPath;
    private static checkPort;
    exitProcess(): Promise<void>;
    startShellAndConnect: (rootPath: string, inDevelopment: boolean, secure: boolean, logLevel?: LogLevel, target?: string | undefined, forwardPort?: ((dynamicUrl: URL) => Promise<URL>) | undefined) => void;
}
export {};
