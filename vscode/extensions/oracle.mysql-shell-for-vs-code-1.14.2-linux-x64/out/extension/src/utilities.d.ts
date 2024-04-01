import { ProviderResult } from "vscode";
export declare const switchVsCodeContext: (key: string, enable: boolean) => ProviderResult<unknown>;
export declare const showMessageWithTimeout: (message: string, timeout?: number) => void;
export declare const showModalDialog: (message: string, okText?: string, detail?: string | undefined) => Promise<boolean>;
