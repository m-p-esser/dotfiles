/// <reference path="../../../../../frontend/src/components/CommunicationDebugger/debugger-runtime.d.ts" />
import { IProtocolParameters } from "./ProtocolParameterMapper";
import { IProtocolResults } from "./ProtocolResultMapper";
import { multiResultAPIs } from "./ProtocolGui";
export interface IConnectionOptions {
    url: URL;
    shellConfigDir?: string;
}
declare type ResponseType<K extends keyof IProtocolResults> = K extends typeof multiResultAPIs[number] ? Array<IProtocolResults[K]> : IProtocolResults[K];
declare type ResponsePromise<K extends keyof IProtocolResults> = Promise<ResponseType<K>>;
export declare type DataCallback<K extends keyof IProtocolResults> = (data: IProtocolResults[K], requestId: string) => void;
interface ISendRequestParameters<K extends keyof IProtocolParameters> {
    requestId?: string;
    requestType: K;
    parameters: IProtocolParameters[K];
    onData?: DataCallback<K>;
}
export declare class MessageScheduler {
    #private;
    protected static instance?: MessageScheduler;
    private static readonly multiResultList;
    protected socket?: WebSocket;
    private debugging;
    private disconnecting;
    private reconnectTimer;
    private reconnectTimeout;
    private ongoingRequests;
    static get get(): MessageScheduler;
    protected constructor();
    protected static createInstance(): MessageScheduler;
    get isConnected(): boolean;
    set inDebugCall(value: boolean);
    set traceEnabled(value: boolean);
    get traceEnabled(): boolean;
    connect(options: IConnectionOptions): Promise<void>;
    disconnect(): void;
    sendRequest<K extends keyof IProtocolResults>(details: ISendRequestParameters<K>, useExecute?: boolean, caseConversionIgnores?: string[]): ResponsePromise<K>;
    sendRawRequest(details: INativeShellRequest, callback?: DataCallback<"native">): Promise<INativeShellResponse>;
    protected createWebSocket(target: URL, options: IConnectionOptions): WebSocket;
    private onMessage;
    private constructAndSendRequest;
    private onOpen;
    private onClose;
    private onError;
    private convertDataToResponse;
    private isErrorInfo;
    private isWebSessionData;
}
export {};
