import { IConnectionOptions, MessageScheduler } from "../../../frontend/src/communication/MessageScheduler";
export declare class NodeMessageScheduler extends MessageScheduler {
    protected static createInstance(): MessageScheduler;
    protected createWebSocket(target: URL, options: IConnectionOptions): WebSocket;
}
