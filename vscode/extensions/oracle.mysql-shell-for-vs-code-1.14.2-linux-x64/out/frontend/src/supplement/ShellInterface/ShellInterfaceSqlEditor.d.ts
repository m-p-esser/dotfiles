import { DataCallback } from "../../communication/MessageScheduler";
import { IPromptReplyBackend, ShellPromptResponseType } from "../../communication/Protocol";
import { ShellAPIGui, IOpenConnectionData, IDbEditorResultSetData, IShellPasswordFeedbackRequest } from "../../communication/ProtocolGui";
import { ShellInterfaceDb } from "./ShellInterfaceDb";
import { ShellInterfaceMds } from "./ShellInterfaceMds";
import { ShellInterfaceMrs } from "./ShellInterfaceMrs";
export declare class ShellInterfaceSqlEditor extends ShellInterfaceDb implements IPromptReplyBackend {
    mds: ShellInterfaceMds;
    mrs: ShellInterfaceMrs;
    get hasSession(): boolean;
    startSession(id: string): Promise<void>;
    closeSession(): Promise<void>;
    getGuiModuleDisplayInfo(): Promise<void>;
    isGuiModuleBackend(): Promise<boolean>;
    openConnection(dbConnectionId: number, requestId?: string, callback?: DataCallback<ShellAPIGui.GuiSqleditorOpenConnection>): Promise<IOpenConnectionData | IShellPasswordFeedbackRequest | undefined>;
    execute(sql: string, params?: string[], requestId?: string, callback?: DataCallback<ShellAPIGui.GuiSqleditorExecute>): Promise<IDbEditorResultSetData | undefined>;
    reconnect(): Promise<void>;
    killQuery(): Promise<void>;
    setAutoCommit(state: boolean): Promise<void>;
    getAutoCommit(): Promise<boolean | undefined>;
    getCurrentSchema(): Promise<string | undefined>;
    setCurrentSchema(schemaName: string): Promise<void>;
    sendReply(requestId: string, type: ShellPromptResponseType, reply: string, moduleSessionId?: string): Promise<void>;
}
