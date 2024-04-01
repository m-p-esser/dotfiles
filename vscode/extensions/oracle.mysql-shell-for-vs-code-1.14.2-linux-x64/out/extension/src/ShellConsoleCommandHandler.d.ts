import { ExtensionHost } from "./ExtensionHost";
export declare class ShellConsoleCommandHandler {
    private providers;
    private url?;
    setup(host: ExtensionHost): void;
    closeProviders(): void;
    private get currentProvider();
    private connectedToUrl;
    private createTabCaption;
}
