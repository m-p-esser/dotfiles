import { ExtensionHost } from "./ExtensionHost";
export declare class MRSCommandHandler {
    #private;
    setup: (host: ExtensionHost) => void;
    private configureMrs;
    private bootstrapLocalRouter;
    private getBaseDir;
    private getLocalRouterConfigDir;
    private startStopLocalRouter;
    private browseDocs;
    private handleDocsWebviewPanelDispose;
}
