import { WebviewPanel } from "vscode";
import { IRequestTypeMap, IRequisitionCallbackValues, IWebviewProvider, RequisitionHub } from "../../../frontend/src/supplement/Requisitions";
declare type WebviewDisposeHandler = (view: WebviewProvider) => void;
declare type WebviewChangeStateHandler = (view: WebviewProvider, active: boolean) => void;
export declare class WebviewProvider implements IWebviewProvider {
    #private;
    protected url: URL;
    protected onDispose: WebviewDisposeHandler;
    protected onStateChange?: WebviewChangeStateHandler | undefined;
    protected panel?: WebviewPanel;
    protected requisitions?: RequisitionHub;
    constructor(url: URL, onDispose: WebviewDisposeHandler, onStateChange?: WebviewChangeStateHandler | undefined);
    get caption(): string;
    set caption(value: string);
    close(): void;
    runCommand<K extends keyof IRequestTypeMap>(requestType: K, parameter: IRequisitionCallbackValues<K>, settingName?: string): Promise<boolean>;
    protected runInPanel(block: () => Promise<boolean>, settingName?: string): Promise<boolean>;
    protected createPanel(placement?: string): Promise<boolean>;
    protected handleDispose(): void;
    protected requisitionsCreated(): void;
    private selectConnectionTab;
    private dialogResponse;
    private updateStatusbar;
    private forwardSimple;
    private updateVscodeSettings;
    private prepareEditorGroup;
}
export {};
