export declare type ShellTaskStatusType = "pending" | "running" | "done" | "error";
declare type PromptCallback = (text: string, isPassword: boolean) => Promise<string | undefined>;
export declare type StatusCallback = (status: ShellTaskStatusType) => void;
declare type MessageCallback = (message: string) => void;
export declare class ShellTask {
    readonly caption: string;
    private promptCallback;
    private messageCallback;
    private currentStatus;
    private statusCallback?;
    private currentProgress?;
    constructor(caption: string, promptCallback: PromptCallback, messageCallback: MessageCallback);
    get status(): ShellTaskStatusType;
    get percentageDone(): number | undefined;
    static getCurrentTimeStamp(): string;
    setStatusCallback(callback: StatusCallback): void;
    runTask(shellArgs: string[], dbConnectionId?: number, responses?: string[]): Promise<void>;
    private setStatus;
    private sendMessage;
    private isShellFeedbackRequest;
    private isShellSimpleResult;
}
export {};
