import { ExtensionHost } from "./ExtensionHost";
export declare class MDSCommandHandler {
    private dialogManager;
    private shellSession;
    private ociTreeDataProvider;
    setup: (host: ExtensionHost) => void;
    private showNewJsonDocument;
    private showMdsHWClusterDialog;
    private showMdsHWLoadDataDialog;
    private showMdsEndpointDialog;
    private isPortForwardingData;
}
