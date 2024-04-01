import { IDialogRequest, IDialogResponse } from "../../../frontend/src/app-logic/Types";
export declare class DialogWebviewManager {
    private pendingDialogRequests;
    private runningDialogs;
    private url?;
    constructor();
    showDialog(request: IDialogRequest, caption: string): Promise<IDialogResponse | void>;
    private handleDispose;
    private connectedToUrl;
    private proxyRequest;
}
