import { DataCallback } from "../../communication/MessageScheduler";
import { IPromptReplyBackend, ShellPromptResponseType } from "../../communication/Protocol";
import { ShellAPIGui, IShellResultType } from "../../communication/ProtocolGui";
import { ShellInterfaceMds } from "./ShellInterfaceMds";
export declare class ShellInterfaceShellSession implements IPromptReplyBackend {
    mds: ShellInterfaceMds;
    private moduleSessionLookupId;
    constructor(sessionId?: string);
    get hasSession(): boolean;
    startShellSession(id: string, dbConnectionId?: number, shellArgs?: unknown[], requestId?: string, callback?: DataCallback<ShellAPIGui.GuiShellStartSession>): Promise<IShellResultType | undefined>;
    closeShellSession(): Promise<void>;
    execute(command: string, requestId?: string, callback?: DataCallback<ShellAPIGui.GuiShellExecute>): Promise<IShellResultType | undefined>;
    sendReply(requestId: string, type: ShellPromptResponseType, reply: string, moduleSessionId?: string): Promise<void>;
    getCompletionItems(text: string, offset: number): Promise<Array<{
        offset?: number;
        options?: string[];
    }>>;
    private get moduleSessionId();
}
