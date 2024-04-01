import { IShellSessionDetails } from "../../../frontend/src/supplement/ShellInterface";
import { WebviewProvider } from "./WebviewProvider";
export declare class ShellConsoleViewProvider extends WebviewProvider {
    private openSessions;
    constructor(url: URL, onDispose: (view: WebviewProvider) => void);
    show(page: string): Promise<boolean>;
    openSession(session: IShellSessionDetails): Promise<boolean>;
    removeSession(session: IShellSessionDetails): Promise<boolean>;
    protected requisitionsCreated(): void;
    protected sessionAdded: (session: IShellSessionDetails) => Promise<boolean>;
    protected sessionRemoved: (session: IShellSessionDetails) => Promise<boolean>;
    protected handleDispose(): void;
}
